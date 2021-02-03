/*
    Classifier class that provides functionality for training and
    classification
    Copyright (C) 2017 Hugo W.L. ter Doest

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict'

const fs = require('fs')

const Context = require('./Context')
const Element = require('./Element')
const Sample = require('./Sample')
const Scaler = require('./GISScaler')
const FeatureSet = require('./FeatureSet')

function Classifier (features, sample) {
  if (features) {
    this.features = features
  } else {
    this.features = new FeatureSet()
  }
  this.features = features
  if (sample) {
    this.sample = sample
  } else {
    this.sample = new Sample()
  }
}

// Loads a classifier from file.
// Caveat: feature functions are generated from the sample elements. You need
// to create your own specialisation of the Element class that can generate
// your own specific feature functions
Classifier.prototype.load = function (filename, ElementClass, callback) {
  fs.readFile(filename, 'utf8', function (err, data) {
    if (!err) {
      const classifierData = JSON.parse(data)
      const sample = new Sample()
      classifierData.sample.elements.forEach(function (elementData) {
        const elt = new ElementClass(elementData.a, new Context(elementData.b.data))
        sample.addElement(elt)
      })
      const featureSet = new FeatureSet()
      sample.generateFeatures(featureSet)
      const classifier = new Classifier(featureSet, sample)
      callback(err, classifier)
    } else {
      if (callback) {
        callback(err)
      }
    }
  })
}

Classifier.prototype.save = function (filename, callback) {
  const data = JSON.stringify(this, null, 2)
  const classifier = this
  fs.writeFile(filename, data, 'utf8', function (err) {
    if (callback) {
      callback(err, err ? null : classifier)
    }
  })
}

Classifier.prototype.addElement = function (x) {
  this.sample.addElement(x)
}

Classifier.prototype.addDocument = function (context, classification, ElementClass) {
  Classifier.prototype.addElement(new ElementClass(classification, context))
}

Classifier.prototype.train = function (maxIterations, minImprovement, approxExpectation) {
  this.scaler = new Scaler(this.features, this.sample)
  this.p = this.scaler.run(maxIterations, minImprovement, approxExpectation)
}

Classifier.prototype.getClassifications = function (b) {
  const scores = []
  const that = this
  this.sample.getClasses().forEach(function (a) {
    const x = new Element(a, b)
    scores.push({
      label: a,
      value: that.p.calculateAPriori(x)
    })
  })
  return scores
}

Classifier.prototype.classify = function (b) {
  const scores = this.getClassifications(b)
  // Sort the scores in an array
  scores.sort(function (a, b) {
    return b.value - a.value
  })
  // Check if the classifier discriminates
  const min = scores[scores.length - 1].value
  const max = scores[0].value
  if (min === max) {
    return ''
  } else {
    // Return the highest scoring classes
    return scores[0].label
  }
}

module.exports = Classifier
