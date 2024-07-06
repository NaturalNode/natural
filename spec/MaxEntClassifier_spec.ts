/*
Unit test of Classifier
Copyright (C) 2018 Hugo W.L. ter Doest

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

import {
  Context,
  FeatureSet,
  Sample,
  MaxEntClassifier as Classifier,
  SEElement
} from 'lib/natural'

import type { Element } from 'lib/natural'

const classifierFilename = 'classifier.json'
const minImprovement = 0.01
const nrIterations = 20

let sample: Sample
let featureSet: FeatureSet
let classifier: Classifier

const DEBUG = false

describe('The MaxEnt module', function () {
  it('The Sample class creates a sample', function () {
    sample = new Sample()
    sample.addElement(new SEElement('x', new Context('0')))
    sample.addElement(new SEElement('x', new Context('0')))
    sample.addElement(new SEElement('x', new Context('0')))
    sample.addElement(new SEElement('y', new Context('0')))
    sample.addElement(new SEElement('y', new Context('0')))
    sample.addElement(new SEElement('y', new Context('0')))

    sample.addElement(new SEElement('x', new Context('1')))
    sample.addElement(new SEElement('y', new Context('1')))
    sample.addElement(new SEElement('y', new Context('1')))
    sample.addElement(new SEElement('y', new Context('1')))

    expect(sample.size()).toBe(10)
  })

  it('The FeatureSet class creates a feature set', function () {
    featureSet = new FeatureSet()
    sample.generateFeatures(featureSet)

    expect(featureSet.size()).toBe(2)
  })

  it('The Classifier class creates a classifier', function () {
    // Create a classifier
    classifier = new Classifier(featureSet, sample)

    expect(classifier).toBeDefined()
  })

  it('Classifier does not need a correction feature', function () {

  })

  it('The classifier stops training after a specified number or iterations ' +
    'or when the minimum improvement in likelihood is reached', function () {
    classifier.train(nrIterations, minImprovement)

    expect(classifier.scaler.iteration).toBeLessThan(nrIterations + 1)
    if (classifier.scaler.iteration < nrIterations) {
      expect(classifier.scaler.improvement).toBeLessThan(minImprovement)
    }
  })

  it('Save classifer to a file', function (done) {
    classifier.save(classifierFilename, function (err, c) {
      if (err !== null) {
        console.log(err)
      } else {
        DEBUG && console.log('Classifier saved to ' + classifierFilename)
      }
      done()
    })
  })

  let newClassifier: Classifier
  it('Load classifer', function (done) {
    classifier.load(classifierFilename, SEElement as unknown as Element, function (err, c) {
      if (err !== null) {
        console.log(err)
      } else if (c !== undefined) {
        DEBUG && console.log('Classifier loaded from ' + classifierFilename)
        newClassifier = c
      }
      done()
    })
    if (newClassifier !== undefined) {
      classifier = newClassifier
    }
  })

  it('The classifier classifies events', function () {
    let context = new Context('0')
    DEBUG && console.log('Classes plus scores ' + JSON.stringify(classifier.getClassifications(context)))
    let classification = classifier.classify(context)
    expect(classification).toBe('x')

    context = new Context('1')
    DEBUG && console.log('Classes plus scores ' + JSON.stringify(classifier.getClassifications(context)))
    classification = classifier.classify(context)
    expect(classification).toBe('y')
  })
})
