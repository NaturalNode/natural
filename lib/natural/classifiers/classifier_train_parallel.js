const os = require('os')

let Threads = null

try {
  Threads = require('webworker-threads')
} catch (e) {
  // Since webworker-threads are optional, only thow if the module is found
  if (e.code !== 'MODULE_NOT_FOUND') throw e
}

function checkThreadSupport () {
  if (typeof Threads === 'undefined') {
    throw new Error('parallel classification requires the optional dependency webworker-threads')
  }
}

function docsToFeatures (docs) {
  const parsedDocs = []

  for (let i = 0; i < docs.length; i++) {
    const features = []

    for (const feature in FEATURES) { // eslint-disable-line
      if (docs[i].observation.indexOf(feature) > -1) { features.push(1) } else { features.push(0) }
    }

    parsedDocs.push({
      index: docs[i].index,
      features: features
    })
  }

  return JSON.stringify(parsedDocs)
}

// Convert docs to observation objects
function docsToObs (docs, lastAdded, stemmer, keepStops) {
  const obsDocs = []
  for (let i = lastAdded; i < docs.length; i++) {
    let observation = this.docs[i].text
    if (typeof observation === 'string') {
      observation = stemmer.tokenizeAndStem(observation, keepStops)
    }
    obsDocs.push({
      index: i,
      observation: observation
    })
  }
  return obsDocs
}

function emitEvents (self, docFeatures, totalDocs) {
  for (let j = self.lastAdded; j < totalDocs; j++) {
    self.classifier.addExample(docFeatures[j], self.docs[j].label)
    self.events.emit('trainedWithDocument', {
      index: j,
      total: totalDocs,
      doc: self.docs[j]
    })
    self.lastAdded++
  }
}

function trainParallel (numThreads, callback) {
  checkThreadSupport()

  if (!callback) {
    callback = numThreads
    numThreads = undefined
  }

  if (isNaN(numThreads)) {
    numThreads = os.cpus().length
  }

  const totalDocs = this.docs.length
  const threadPool = Threads.createPool(numThreads)
  const docFeatures = {}
  let finished = 0
  const self = this

  // Init pool; send the features array and the parsing function
  threadPool.all.eval('var FEATURES = ' + JSON.stringify(this.features))
  threadPool.all.eval(docsToFeatures)

  const obsDocs = docsToObs(this.docs, this.lastAdded, this.stemmer, this.keepStops)

  // Called when a batch completes processing
  const onFeaturesResult = function (docs) {
    setTimeout(function () {
      self.events.emit('processedBatch', {
        size: docs.length,
        docs: totalDocs,
        batches: numThreads,
        index: finished
      })
    })

    for (let j = 0; j < docs.length; j++) {
      docFeatures[docs[j].index] = docs[j].features
    }
  }

  // Called when all batches finish processing
  const onFinished = function (err) {
    if (err) {
      threadPool.destroy()
      return callback(err)
    }

    emitEvents(self, docFeatures, totalDocs)
    self.events.emit('doneTraining', true)
    self.classifier.train()

    threadPool.destroy()
    callback(null)
  }

  // Split the docs and start processing
  const batchSize = Math.ceil(obsDocs.length / numThreads)
  let lastError

  for (let i = 0; i < numThreads; i++) {
    const batchDocs = obsDocs.slice(i * batchSize, (i + 1) * batchSize)
    const batchJson = JSON.stringify(batchDocs)

    threadPool.any.eval('docsToFeatures(' + batchJson + ')', function (err, docs) {
      lastError = err || lastError
      finished++

      if (docs) {
        docs = JSON.parse(docs)
        onFeaturesResult(docs)
      }

      if (finished >= numThreads) {
        onFinished(lastError)
      }
    })
  }
}

function trainParallelBatches (options) {
  checkThreadSupport()

  let numThreads = options && options.numThreads
  let batchSize = options && options.batchSize

  if (isNaN(numThreads)) {
    numThreads = os.cpus().length
  }

  if (isNaN(batchSize)) {
    batchSize = 2500
  }

  const totalDocs = this.docs.length
  const threadPool = Threads.createPool(numThreads)
  const docFeatures = {}
  let finished = 0
  const self = this

  let abort = false
  const onError = function (err) {
    if (!err || abort) return
    abort = true
    threadPool.destroy(true)
    self.events.emit('doneTrainingError', err)
  }

  // Init pool; send the features array and the parsing function
  const str = JSON.stringify(this.features)
  threadPool.all.eval('var FEATURES = ' + str + ';', onError)
  threadPool.all.eval(docsToFeatures, onError)

  // Convert docs to observation objects
  let obsDocs = []
  for (let i = this.lastAdded; i < totalDocs; i++) {
    let observation = this.docs[i].text
    if (typeof observation === 'string') { observation = this.stemmer.tokenizeAndStem(observation, this.keepStops) }
    obsDocs.push({
      index: i,
      observation: observation
    })
  }

  // Split the docs in batches
  const obsBatches = []
  let i = 0
  while (true) {
    const batch = obsDocs.slice(i * batchSize, (i + 1) * batchSize)
    if (!batch || !batch.length) break
    obsBatches.push(batch)
    i++
  }
  obsDocs = null
  self.events.emit('startedTraining', {
    docs: totalDocs,
    batches: obsBatches.length
  })

  // Called when a batch completes processing
  const onFeaturesResult = function (docs) {
    self.events.emit('processedBatch', {
      size: docs.length,
      docs: totalDocs,
      batches: obsBatches.length,
      index: finished
    })

    for (let j = 0; j < docs.length; j++) {
      docFeatures[docs[j].index] = docs[j].features
    }
  }

  // Called when all batches finish processing
  const onFinished = function () {
    threadPool.destroy(true)
    abort = true

    emitEvents(self, docFeatures, totalDocs)
    self.events.emit('doneTraining', true)
    self.classifier.train()
  }

  // Called to send the next batch to be processed
  let batchIndex = 0
  const sendNext = function () {
    if (abort) return
    if (batchIndex >= obsBatches.length) {
      return
    }

    sendBatch(JSON.stringify(obsBatches[batchIndex]))
    batchIndex++
  }

  // Called to send a batch of docs to the threads
  const sendBatch = function (batchJson) {
    if (abort) return
    threadPool.any.eval('docsToFeatures(' + batchJson + ');', function (err, docs) {
      if (err) {
        return onError(err)
      }

      finished++

      if (docs) {
        docs = JSON.parse(docs)
        setTimeout(onFeaturesResult.bind(null, docs))
      }

      if (finished >= obsBatches.length) {
        setTimeout(onFinished)
      }

      setTimeout(sendNext)
    })
  }

  // Start processing
  for (let i = 0; i < numThreads; i++) {
    sendNext()
  }
}

function retrainParallel (numThreads, callback) {
  this.classifier = new (this.classifier.constructor)()
  this.lastAdded = 0
  this.trainParallel(numThreads, callback)
}

module.exports = {
  Threads,
  trainParallel,
  trainParallelBatches,
  retrainParallel
}
