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

const Classifier = require('./classifier')
const ApparatusLogisticRegressionClassifier = require('apparatus').LogisticRegressionClassifier

class LogisticRegressionClassifier extends Classifier {
  constructor (stemmer) {
    const abc = new ApparatusLogisticRegressionClassifier()
    super(abc, stemmer)
  }

  static restore (classifier, stemmer) {
    classifier = Classifier.restore(classifier, stemmer)
    // Using ___proto__ is deprecated
    // classifier.__proto__ = LogisticRegressionClassifier.prototype
    Object.setPrototypeOf(classifier, LogisticRegressionClassifier.prototype)
    classifier.classifier = ApparatusLogisticRegressionClassifier.restore(classifier.classifier)

    return classifier
  }

  static load (filename, stemmer, callback) {
    Classifier.load(filename, (err, classifier) => {
      if (err) {
        callback(err)
      } else {
        callback(err, LogisticRegressionClassifier.restore(classifier, stemmer))
      }
    })
  }

  static async loadFrom (key, stemmer, storageBackend) {
    const classifier = await Classifier.loadFrom(key, storageBackend)
    return LogisticRegressionClassifier.restore(classifier, stemmer)
  }

  train () {
    // we need to reset the training state because logistic regression
    // needs its matricies to have their widths synced, etc.
    this.lastAdded = 0
    this.classifier = new ApparatusLogisticRegressionClassifier()
    super.train()
  }
}

module.exports = LogisticRegressionClassifier
