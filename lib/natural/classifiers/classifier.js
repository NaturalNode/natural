/*
Copyright (c) 2011, Chris Umbel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

'use strict'

const PorterStemmer = require('../stemmers/porter_stemmer')
const events = require('events')
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

const Classifier = function (classifier, stemmer) {
  this.classifier = classifier
  this.docs = []
  this.features = {}
  this.stemmer = stemmer || PorterStemmer
  this.lastAdded = 0
  this.events = new events.EventEmitter()
}

function addDocument (text, classification) {
  // Ignore further processing if classification is undefined
  if (typeof classification === 'undefined') return

  // If classification is type of string then make sure it's dosen't have blank space at both end
  if (typeof classification === 'string') {
    classification = classification.trim()
  }

  if (typeof text === 'string') { text = this.stemmer.tokenizeAndStem(text, this.keepStops) }

  if (text.length === 0) {
    // ignore empty documents
    return
  }

  this.docs.push({
    label: classification,
    text: text
  })

  for (let i = 0; i < text.length; i++) {
    const token = text[i]
    this.features[token] = (this.features[token] || 0) + 1
  }
}

function removeDocument (text, classification) {
  const docs = this.docs
  let doc
  let pos

  if (typeof text === 'string') {
    text = this.stemmer.tokenizeAndStem(text, this.keepStops)
  }

  for (let i = 0, ii = docs.length; i < ii; i++) {
    doc = docs[i]
    if (doc.text.join(' ') === text.join(' ') &&
        doc.label === classification) {
      pos = i
    }
  }

  // Remove if there's a match
  if (!isNaN(pos)) {
    this.docs.splice(pos, 1)

    for (let i = 0, ii = text.length; i < ii; i++) {
      delete this.features[text[i]]
    }
  }
}

function textToFeatures (observation) {
  const features = []

  if (typeof observation === 'string') { observation = this.stemmer.tokenizeAndStem(observation, this.keepStops) }

  for (const feature in this.features) {
    if (observation.indexOf(feature) > -1) { features.push(1) } else { features.push(0) }
  }

  return features
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

function train () {
  const totalDocs = this.docs.length
  for (let i = this.lastAdded; i < totalDocs; i++) {
    const features = this.textToFeatures(this.docs[i].text)
    this.classifier.addExample(features, this.docs[i].label)
    this.events.emit('trainedWithDocument', { index: i, total: totalDocs, doc: this.docs[i] })
    this.lastAdded++
  }
  this.events.emit('doneTraining', true)
  this.classifier.train()
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

  // Convert docs to observation objects
  const obsDocs = []
  for (let i = this.lastAdded; i < totalDocs; i++) {
    let observation = this.docs[i].text
    if (typeof observation === 'string') { observation = this.stemmer.tokenizeAndStem(observation, this.keepStops) }
    obsDocs.push({
      index: i,
      observation: observation
    })
  }

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

    for (let j = self.lastAdded; j < totalDocs; j++) {
      self.classifier.addExample(docFeatures[j], self.docs[j].label)
      self.events.emit('trainedWithDocument', {
        index: j,
        total: totalDocs,
        doc: self.docs[j]
      })
      self.lastAdded++
    }

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

    for (let j = self.lastAdded; j < totalDocs; j++) {
      self.classifier.addExample(docFeatures[j], self.docs[j].label)
      self.events.emit('trainedWithDocument', {
        index: j,
        total: totalDocs,
        doc: self.docs[j]
      })
      self.lastAdded++
    }

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

function retrain () {
  this.classifier = new (this.classifier.constructor)()
  this.lastAdded = 0
  this.train()
}

function retrainParallel (numThreads, callback) {
  this.classifier = new (this.classifier.constructor)()
  this.lastAdded = 0
  this.trainParallel(numThreads, callback)
}

function getClassifications (observation) {
  return this.classifier.getClassifications(this.textToFeatures(observation))
}

function classify (observation) {
  return this.classifier.classify(this.textToFeatures(observation))
}

function restore (classifier, stemmer) {
  classifier.stemmer = stemmer || PorterStemmer
  classifier.events = new events.EventEmitter()
  return classifier
}

function save (filename, callback) {
  const data = JSON.stringify(this)
  const fs = require('fs')
  const classifier = this
  fs.writeFile(filename, data, 'utf8', function (err) {
    if (callback) {
      callback(err, err ? null : classifier)
    }
  })
}

function load (filename, callback) {
  const fs = require('fs')

  fs.readFile(filename, 'utf8', function (err, data) {
    let classifier

    if (!err) {
      classifier = JSON.parse(data)
    }

    if (callback) { callback(err, classifier) }
  })
}

function setOptions (options) {
  this.keepStops = !!(options.keepStops)
}

Classifier.prototype.addDocument = addDocument
Classifier.prototype.removeDocument = removeDocument
Classifier.prototype.train = train
if (Threads) {
  Classifier.prototype.trainParallel = trainParallel
  Classifier.prototype.trainParallelBatches = trainParallelBatches
  Classifier.prototype.retrainParallel = retrainParallel
}
Classifier.prototype.retrain = retrain
Classifier.prototype.classify = classify
Classifier.prototype.textToFeatures = textToFeatures
Classifier.prototype.save = save
Classifier.prototype.getClassifications = getClassifications
Classifier.prototype.setOptions = setOptions
Classifier.restore = restore
Classifier.load = load

module.exports = Classifier
