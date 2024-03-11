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

const natural = require('../lib/natural')
const sinon = require('sinon')
const baseClassifier = require('../lib/natural/classifiers/classifier')
const storage = require('../lib/natural/util/storage/StorageBackend')

function setupClassifier () {
  const classifier = new natural.BayesClassifier()
  classifier.addDocument(['fix', 'box'], 'computing')
  classifier.addDocument(['write', 'code'], 'computing')
  classifier.addDocument(['script', 'code'], 'computing')
  classifier.addDocument(['write', 'book'], 'literature')
  classifier.addDocument(['read', 'book'], 'literature')
  classifier.addDocument(['study', 'book'], 'literature')
  return classifier
}

describe('Bayes classifier file I/O', function () {
  it('should save and load a working classifier', function (done) {
    const classifier = new natural.BayesClassifier()
    classifier.addDocument('i fixed the box', 'computing')
    classifier.addDocument('i write code', 'computing')
    classifier.addDocument('nasty script code', 'computing')
    classifier.addDocument('write a book', 'literature')
    classifier.addDocument('read a book', 'literature')
    classifier.addDocument('study the books', 'literature')

    classifier.train()

    classifier.save('bayes_classifier.json', function (err) {
      if (err) {
        throw err
      }
      natural.BayesClassifier.load('bayes_classifier.json', null, function (err, newClassifier) {
        if (err) {
          throw err
        }
        newClassifier.addDocument('kick a ball', 'sports')
        newClassifier.addDocument('hit some balls', 'sports')
        newClassifier.addDocument('kick and punch', 'sports')
        newClassifier.train()
        expect(newClassifier.classify('a bug in the code')).toBe('computing')
        expect(newClassifier.classify('read all the books')).toBe('literature')
        expect(newClassifier.classify('kick butt')).toBe('sports')
        done()
      })
    })
  })

  it('should only execute the callback once when failing to load a classifier', function (done) {
    natural.BayesClassifier.load('nonexistant_bayes_classifier.json', null, function (err, newClassifier) {
      expect(err.code).toBe('ENOENT')
      expect(newClassifier).toBe(undefined)
      done()
    })
  })

  describe('Bayes classifier load', function () {
    let sandbox = null

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
    })

    afterEach(function () {
      sandbox.restore()
    })
    it('should pass an error to the callback function', function () {
      sandbox.stub(baseClassifier, 'load', function (filename, cb) {
        cb(new Error('An error occurred'))
      })
      natural.BayesClassifier.load('/spec/test_data/tfidf_document1.txt', null, function (err, newClassifier) {
        expect(err).toBe.ok
        expect(newClassifier).not.toBe.ok
      })
    })
  })

  it('should be able to save a classifier to a file-based storage backend and load it back ', async function () {
    const classifier = setupClassifier()
    classifier.train()
    const store = await new storage.StorageBackend(storage.STORAGE_TYPES.FILE)
    const key = await classifier.saveTo(store)
    expect(key).toBeDefined()
    const classifierLoaded = await natural.BayesClassifier.loadFrom(key, undefined, store)
    expect(Object.getPrototypeOf(classifierLoaded)).toEqual(Object.getPrototypeOf(classifier))
  })
})
