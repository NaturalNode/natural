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
const fs = require('fs')

const EventEmitter = require('events')
const PorterStemmer = require('../stemmers/porter_stemmer')
const parallelTrainer = require('./classifier_train_parallel')

class Classifier extends EventEmitter {
  constructor (classifier, stemmer) {
    super()
    this.classifier = classifier
    this.docs = []
    this.features = {}
    this.stemmer = stemmer || PorterStemmer
    this.lastAdded = 0

    // Add methods for parallel training
    this.Threads = parallelTrainer.Threads
    this.trainParallel = parallelTrainer.trainParallel
    this.retrainParallel = parallelTrainer.retrainParallel
    this.trainParallelBatches = parallelTrainer.trainParallelBatches
  }

  addDocument (text, classification) {
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
      text
    })

    for (let i = 0; i < text.length; i++) {
      const token = text[i]
      this.features[token] = (this.features[token] || 0) + 1
    }
  }

  removeDocument (text, classification) {
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

  textToFeatures (observation) {
    const features = []

    if (typeof observation === 'string') { observation = this.stemmer.tokenizeAndStem(observation, this.keepStops) }

    for (const feature in this.features) {
      if (observation.indexOf(feature) > -1) {
        features.push(1)
      } else {
        features.push(0)
      }
    }

    return features
  }

  train () {
    const totalDocs = this.docs.length
    for (let i = this.lastAdded; i < totalDocs; i++) {
      const features = this.textToFeatures(this.docs[i].text)
      this.classifier.addExample(features, this.docs[i].label)
      this.emit('trainedWithDocument', { index: i, total: totalDocs, doc: this.docs[i] })
      this.lastAdded++
    }
    this.classifier.train()
    this.emit('doneTraining', true)
  }

  retrain () {
    this.classifier = new (this.classifier.constructor)()
    this.lastAdded = 0
    this.train()
  }

  getClassifications (observation) {
    return this.classifier.getClassifications(this.textToFeatures(observation))
  }

  classify (observation) {
    return this.classifier.classify(this.textToFeatures(observation))
  }

  static restore (classifier, stemmer) {
    classifier.stemmer = stemmer || PorterStemmer
    return classifier
  }

  save (filename, callback) {
    const data = JSON.stringify(this)
    const classifier = this
    fs.writeFile(filename, data, 'utf8', function (err) {
      if (callback) {
        callback(err, err ? null : classifier)
      }
    })
  }

  static load (filename, stemmer, callback) {
    if (!callback) {
      return
    }
    fs.readFile(filename, 'utf8', function (err, data) {
      if (err) {
        callback(err, null)
      } else {
        const classifier = JSON.parse(data)
        callback(err, Classifier.restore(classifier, stemmer))
      }
    })
  }

  async saveTo (storageBackend) {
    return await storageBackend.store(this)
  }

  static async loadFrom (key, storageBackend) {
    const obj = await storageBackend.retrieve(key)
    Object.setPrototypeOf(obj, Classifier.prototype)
    return obj
  }

  setOptions (options) {
    this.keepStops = !!(options.keepStops)
  }
}

module.exports = Classifier
