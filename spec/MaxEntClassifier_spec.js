/*
Unit test of Classifier
Copyright (C) 2018 Hugo W.L. ter Doest

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

const natural = require('../lib/natural')

const SEElement = natural.SEElement
const Context = natural.Context
const FeatureSet = natural.FeatureSet
const Sample = natural.Sample
const Classifier = natural.MaxEntClassifier

const classifierFilename = 'classifier.json'
const minImprovement = 0.01
const nrIterations = 20

let sample = null
let featureSet = null
let classifier = null

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

    expect(classifier).not.toBe(undefined)
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
      if (err) {
        console.log(err)
      } else {
        DEBUG && console.log('Classifier saved to ' + classifierFilename)
      }
      done()
    })
  })

  let newClassifier = null
  it('Load classifer', function (done) {
    classifier.load(classifierFilename, SEElement, function (err, c) {
      if (err) {
        console.log(err)
      } else {
        DEBUG && console.log('Classifier loaded from ' + classifierFilename)
        newClassifier = c
      }
      done()
    })
    if (newClassifier) {
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
