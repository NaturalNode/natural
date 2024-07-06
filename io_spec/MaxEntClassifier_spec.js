/*
Copyright (c) 2019, Hugo W.L. ter Doest

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

/* eslint-disable no-unused-expressions */

const fs = require('fs')
const _ = require('underscore')

const Sample = require('../lib/natural/classifiers/maxent/Sample')
const Element = require('../lib/natural/classifiers/maxent/SimpleExample/SE_Element')
const Context = require('../lib/natural/classifiers/maxent/Context')
const FeatureSet = require('../lib/natural/classifiers/maxent/FeatureSet')
const Classifier = require('../lib/natural/classifiers/maxent/Classifier')

const classifierFile = 'io_spec/test_data/classifier.json'
const nrIterations = 50
const minImprovement = 0.01
const DEBUG = false

describe('Maximum entropy classifier file IO', function () {
  // Prepare sample
  const sample = new Sample()
  sample.addElement(new Element('x', new Context('0')))
  sample.addElement(new Element('y', new Context('0')))
  sample.addElement(new Element('x', new Context('1')))
  sample.addElement(new Element('y', new Context('1')))

  // Prepare feature set
  const featureSet = new FeatureSet()
  sample.generateFeatures(featureSet)

  // Prepare classifier
  const classifier = new Classifier(featureSet, sample)
  DEBUG && console.log('Classifier created')
  classifier.train(nrIterations, minImprovement)
  DEBUG && console.log('Checksum: ' + classifier.p.checkSum())

  it('saves the classifier to a file', function (done) {
    classifier.save(classifierFile, function (err, classifier) {
      if (err) {
        console.log(err)
        expect(false).toBe(true)
      } else {
        DEBUG && console.log('Classifier saved to ' + classifierFile)
        expect(fs.existsSync(classifierFile)).toBe(true)
      }
      done()
    })
  })

  it('loads the classifier from a file', function (done) {
    classifier.load(classifierFile, Element, function (err, c) {
      if (err) {
        console.log(err)
        expect(false).toBe(true)
      } else {
        DEBUG && console.log('Classifier loaded from ' + classifierFile)

        // Train the classifier
        c.train(nrIterations, minImprovement)

        // Compare loaded classifier to original classifier
        expect(_.isEqual(classifier.sample, c.sample)).toEqual(true)
        classifier.features.features.forEach((f, index) => {
          Object.keys(f).forEach(key => {
            if (typeof f[key] !== 'function') {
              expect(c.features.features[index][key]).toEqual(f[key])
            }
          })
        })
      }
      done()
    })
  })
})
