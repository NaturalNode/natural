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

const LogisticRegressionClassifier = require('../lib/natural').LogisticRegressionClassifier
const storage = require('../lib/natural/util/storage/StorageBackend')

function setupClassifier () {
  const classifier = new LogisticRegressionClassifier()
  classifier.addDocument('i fixed the box', 'computing')
  classifier.addDocument('i write code', 'computing')
  classifier.addDocument('nasty script code', 'computing')
  classifier.addDocument('write a book', 'literature')
  classifier.addDocument('read a book', 'literature')
  classifier.addDocument('study the books', 'literature')
  classifier.train()
  return classifier
}

describe('Saving and loading logistic regression classifiers to/from file', function () {
  it('should save and load a working classifier', function () {
    const classifier = setupClassifier()

    classifier.save('lr_classifier.json', function (err) {
      if (err) {
        throw err
      }
      LogisticRegressionClassifier.load('lr_classifier.json', null, function (err, newClassifier) {
        if (err) {
          throw err
        }
        newClassifier.addDocument('hit some balls', 'sports')
        newClassifier.addDocument('kick a ball', 'sports')
        newClassifier.addDocument('kick and punch things', 'sports')
        newClassifier.train()

        expect(newClassifier.classify('a bug in the code')).toBe('computing')
        expect(newClassifier.classify('read all the books')).toBe('literature')
        expect(newClassifier.classify('kick butt')).toBe('sports')

        expect(Object.getPrototypeOf(newClassifier)).toEqual(Object.getPrototypeOf(classifier))
      })
    })
  })

  it('should only execute the callback once when failing to load a classifier', function () {
    LogisticRegressionClassifier.load('nonexistant_lr_classifier.json', null, function (err, newClassifier) {
      if (err) {
        expect(err.code).toBe('ENOENT')
        expect(newClassifier).toBe(undefined)
      }
    })
  })

  describe('Storing and retrieving Logistic Regression classifiers using the storage backend', function () {
    const classifier = setupClassifier()
    Object.keys(storage.STORAGE_TYPES).forEach(storageType => {
      it('should be able to save and load a classifier to ' + storageType, async function () {
        const store = await new storage.StorageBackend(storageType)
        const key = await classifier.saveTo(store)
        expect(key).toBeDefined()
        const classifierLoaded = await LogisticRegressionClassifier.loadFrom(key, undefined, store)
        expect(Object.getPrototypeOf(classifierLoaded)).toEqual(Object.getPrototypeOf(classifier))
      })
    })
  })
})
