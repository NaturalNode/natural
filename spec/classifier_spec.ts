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

import { BayesClassifier } from 'lib/natural'

describe('classifier', function () {
  describe('addDocument', function () {
    it('should ignore an empty document', function () {
      const classifier = new BayesClassifier()
      classifier.addDocument('', 'philosophy')
      expect(classifier.docs.length).toBe(0)
    })

    it('should increment features', function () {
      const classifier = new BayesClassifier()
      classifier.addDocument('foo', '')
      classifier.addDocument('foo', '')
      classifier.addDocument('bar', '')
      classifier.addDocument('bar', '')
      classifier.addDocument('bar', '')
      classifier.addDocument('baz', '')
      expect(classifier.docs.length).toBe(6)
      expect(classifier.features.foo).toBe(2)
      expect(classifier.features.bar).toBe(3)
      expect(classifier.features.baz).toBe(1)
    })
  })

  describe('Classifier', function () {
    const pushedEvents: any[] = []
    function eventRegister (obj: any): void {
      pushedEvents.push(obj)
    }

    function assertEventResults (): void {
      expect(pushedEvents[0].index).toBe(0)
      expect(pushedEvents[0].total).toBe(6)
      expect(pushedEvents.length).toBe(6)
    }

    it('should emit events when documents are added or training is finished', function () {
      const classifier = new BayesClassifier()
      classifier.on('trainedWithDocument', eventRegister)
      classifier.on('doneTraining', assertEventResults)

      classifier.addDocument('i fixed the box', 'computing')
      classifier.addDocument('i write code', 'computing')
      classifier.addDocument('nasty script code', 'computing')
      classifier.addDocument('write a book', 'literature')
      classifier.addDocument('read a book', 'literature')
      classifier.addDocument('study the books', 'literature')

      classifier.train()
      classifier.removeListener('trainedWithDocument', eventRegister)
      classifier.removeListener('doneTraining', assertEventResults)
    })
  })

  describe('Classifier', function () {
    let classifier: BayesClassifier
    beforeEach(function () {
      classifier = new BayesClassifier()
      classifier.addDocument('i fixed the box', 'computing')
      classifier.addDocument('i write code', 'computing')
      classifier.addDocument('write a book', 'literature')
      classifier.addDocument('study the books', 'literature')
    })

    it('should do nothing if text is not a string', function () {
      expect(classifier.docs.length).toBe(4)
      classifier.removeDocument(['write a book'], 'literature')
      classifier.removeDocument(['study the books'], 'literature')
      expect(classifier.docs.length).toBe(4)
    })

    it('should do nothing if text is not a match', function () {
      expect(classifier.docs.length).toBe(4)
      classifier.removeDocument('something else', 'literature')
      classifier.removeDocument('another thing', 'literature')
      expect(classifier.docs.length).toBe(4)
    })
  })
})
