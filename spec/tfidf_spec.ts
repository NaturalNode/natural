/*
Copyright (c) 2011, Rob Ellis, Chris Umbel

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

import { TfIdf, TreebankWordTokenizer, stopwords } from 'lib/natural'
import type { TfIdfTerm } from 'lib/natural'

let tfidf: TfIdf

describe('tfidf', function () {
  describe('stateless operations', function () {
    it('should tf', function () {
      expect(TfIdf.tf('document', { document: 2, one: 1 })).toBe(2)
      expect(TfIdf.tf('document', { greetings: 1, program: 1 })).toBe(0)
      expect(TfIdf.tf('program', { greetings: 1, program: 1 })).toBe(1)
    })
  })

  describe('keys', function () {
    it('should store and recall keys', function () {
      tfidf = new TfIdf()
      tfidf.addDocument('document one', 'un')
      tfidf.addDocument('document Two', 'deux')

      tfidf.tfidfs('two', function (i, tfidf, key) {
        if (i === 0) { expect(key).toBe('un') } else { expect(key).toBe('deux') }
      })
    })

    it('should handle a deserialized object passed to the constructor', function () {
      tfidf = new TfIdf({
        documents: [
          { __key: 'un', document: 1, one: 1 },
          { __key: 'deux', document: 1, two: 1 }
        ]
      })
      tfidf.tfidfs('two', function (i, tfidf, key) {
        if (i === 1) { expect(key).toBe('deux') } else { expect(key).toBe('un') }
      })
    })

    it('should work when called without a callback', function () {
      tfidf = new TfIdf({
        documents: [
          { __key: 'un', document: 1, one: 1 },
          { __key: 'deux', document: 1, two: 1 }
        ]
      })
      const tfidfs = tfidf.tfidfs('two')
      expect(tfidfs[1]).toBe(1 + Math.log(2.0 / 2.0))
    })

    it('should work with the restoreCache flag set to true', function () {
      tfidf = new TfIdf()
      tfidf.addDocument('document one', 'un')
      expect(tfidf.idf('one')).toBe(1 + Math.log(1.0 / 2.0))
      tfidf.addDocument('document Two', 'deux', true)

      tfidf.tfidfs('two', function (i, tfidf, key) {
        if (i === 0) { expect(key).toBe('un') } else { expect(key).toBe('deux') }
      })
    })
  })

  describe('stateful operations', function () {
    beforeEach(function () {
      tfidf = new TfIdf()
      tfidf.addDocument('document one')
      tfidf.addDocument('document Two')
    })

    it('should list important terms', function () {
      const terms: TfIdfTerm[] = tfidf.listTerms(0)
      expect(terms[0].tfidf).toBeGreaterThan(terms[1].tfidf)
    })
  })

  // Issue #634 - prevent tfidf to apply a tokenizer to terms that are already tokenized
  describe('tfidf with tokenized terms', function () {
    tfidf = new TfIdf()
    tfidf.addDocument(['domain', 'google.com'])
    const terms: TfIdfTerm[] = tfidf.listTerms(0)
    it('should list important terms correctly without tokenizing again', function () {
      expect(terms[0].tfidf).toBeGreaterThan(0)
      expect(terms[1].tfidf).toBeGreaterThan(0)
    })
  })

  describe('special cases', function () {
    // In response to
    it('should handle reserved function names correctly in documents', function () {
      const reservedWords = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ]
      tfidf = new TfIdf()
      tfidf.addDocument(reservedWords.join(' '))

      reservedWords.forEach((word: string) => {
        expect(tfidf.tfidf(word, 0)).toBe(1 * (1 + Math.log(1 / 2)))
      })
    })

    it('should handle an array passed to tfidf()', function () {
      tfidf = new TfIdf()
      const terms = ['this', 'document', 'is', 'about', 'poetry']
      tfidf.addDocument(terms.join(' '))
      expect(tfidf.tfidf(terms, 0)).toBe(2 * (1 + Math.log(1.0 / 2.0)))
    })
  })

  describe('correct calculations', function () {
    it('should compute idf correctly', function () {
      tfidf = new TfIdf()
      tfidf.addDocument('this document is about node.')
      tfidf.addDocument('this document is about ruby.')
      tfidf.addDocument('this document is about ruby and node.')
      tfidf.addDocument('this document is about node. it has node examples')

      expect(tfidf.idf('node')).toBe(1 + Math.log(4.0 / 4.0))
    })

    it('should compute idf correctly with non-string documents', function () {
      tfidf = new TfIdf()
      tfidf.addDocument('this document is about node.')
      tfidf.addDocument('this document is about ruby.')
      tfidf.addDocument('this document is about ruby and node.')
      tfidf.addDocument('this document is about node. it has node examples')
      tfidf.addDocument({ text: 'this document is about python' })
      tfidf.addDocument(['this', 'document', 'is', 'about', 'node', 'and', 'JavaScript'])

      expect(tfidf.idf('node')).toBe(1 + Math.log(6.0 / 5.0))
    })

    it('should compute tf correctly', function () {
      expect(TfIdf.tf('node', { this: 1, document: 1, is: 1, about: 1, node: 1 })).toBe(1)
      expect(TfIdf.tf('node', { this: 1, document: 1, is: 1, about: 1, ruby: 1 })).toBe(0)
      expect(TfIdf.tf('node', { this: 1, document: 1, is: 1, about: 1, ruby: 1, and: 1, node: 1 })).toBe(1)
      expect(TfIdf.tf('node', { this: 1, document: 1, is: 1, about: 1, node: 2, it: 1, has: 1, examples: 1 })).toBe(2)
    })

    // This is a test of the use case outlined in the readme.
    it('should compute tf-idf correctly', function () {
      const correctCalculations: number[] = [
        1 * (1 + Math.log(4.0 / 4.0)),
        0,
        2 * (1 + Math.log(4.0 / 4.0)),
        1 * (1 + Math.log(4.0 / 3.0))
      ]

      tfidf = new TfIdf()
      tfidf.addDocument('this document is about node.', { node: 0, ruby: 1 })
      tfidf.addDocument('this document is about ruby.', { node: 1, ruby: 3 })
      tfidf.addDocument('this document is about ruby and node.', { node: 0, ruby: 3 })
      tfidf.addDocument('this document is about node. it has node examples', { node: 2, ruby: 1 })

      tfidf.tfidfs('node', (i: number, measure: number, k: string | Record<string, any> | undefined): void => {
        if (typeof k === 'object') {
          expect(measure).toBe(correctCalculations[k.node])
        } else {
          console.log('Key was undefined')
        }
      })

      tfidf.tfidfs('ruby', (i: number, measure: number, k: string | Record<string, any> | undefined): void => {
        if (typeof k === 'object') {
          expect(measure).toBe(correctCalculations[k.ruby])
        } else {
          console.log('Key was undefined')
        }
      })
    })

    it('should not return NaN if a term is not present in any documents', function () {
      tfidf = new TfIdf()
      tfidf.addDocument('this document is about node.')

      expect(tfidf.tfidf('ruby', 0)).toBe(0)
    })

    // This test assures that tf-idf is computed correctly before and after a document is added
    // Computes and tests a few tf-idfs, then adds a document and ensures that those terms tf-idf value
    // is updated accordingly.
    it('should update a terms tf-idf score after adding documents', function () {
      tfidf = new TfIdf()

      // Add 2 documents
      tfidf.addDocument('this document is about node.', 0)
      tfidf.addDocument('this document is about ruby.', 1)

      // check the tf-idf for 'node'
      expect(tfidf.tfidf('node', 0)).toBe(1 * (1 + Math.log(2.0 / 2.0)))

      // Add 2 more documents
      tfidf.addDocument('this document is about ruby and node.')
      tfidf.addDocument('this document is about node. it has node examples')

      // Ensure that the tf-idf in the same document has changed to reflect the new idf.
      expect(tfidf.tfidf('node', 0)).toBe(1 * (1 + Math.log(4.0 / 4.0)))
    })

    // Test idf.setTokenizer
    it('should allow for specific types of Tokenizers', function () {
      tfidf = new TfIdf()

      tfidf.addDocument('this document isn\'t about node.', 0)
      tfidf.addDocument('that doc is about node.', 1)
      expect(tfidf.tfidf('n\'t', 0)).toBe(0)
      expect(tfidf.tfidf('isn', 0)).toBe(1 * (1 + Math.log(2 / 2)))

      tfidf = new TfIdf()

      tfidf.addDocument('this document isn\'t about node.', 0)
      tfidf.addDocument('this document isn\'t about node.', 1)

      expect(tfidf.tfidf('isn', 0)).toBe(1 * (1 + Math.log(2 / 3)))

      tfidf = new TfIdf()
      const tokenizer = new TreebankWordTokenizer()

      tfidf.addDocument('this document isn\'t about node.', 0)
      tfidf.setTokenizer(tokenizer)
      tfidf.addDocument('this doc isn\'t about node.', 1)

      expect(tfidf.tfidf('isn', 0)).toBe(1 * (1 + Math.log(2 / 2)))
      expect(tfidf.tfidf('n\'t', 1)).toBe(1 * (1 + Math.log(2 / 2)))
      expect(tfidf.tfidf('isn', 1)).toBe(0)
    })

    it('should require a valid tokenizer when using setTokenizer', function () {
      tfidf = new TfIdf()

      // @ts-expect-error Behaviour with wrong parameters is tested
      expect(function () { tfidf.setTokenizer(1) }).toThrow(new Error('Expected a valid Tokenizer'))
      // @ts-expect-error Behaviour with wrong parameters is tested
      expect(function () { tfidf.setTokenizer({}) }).toThrow(new Error('Expected a valid Tokenizer'))
    })
  })

  describe('Stopwords', function () {
    it('should load a custom set of stopwords', function () {
      tfidf = new TfIdf()
      expect(tfidf.setStopwords(stopwords)).toEqual(true)
      tfidf.addDocument('this document is about node.', 0)
      const terms = tfidf.listTerms(0)
      const tokens = terms.map(t => t.term)
      expect(tokens.indexOf('about')).toEqual(-1)
      expect(tokens.indexOf('this')).toEqual(-1)
    })
    it('should detect an incorrect stopwords list (not an array)', function () {
      const stopwords = {}
      // @ts-expect-error Test for behaviour with wrong parameters
      expect(tfidf.setStopwords(stopwords)).toEqual(false)
    })
    it('should detect an incorrect stopwords list (one of the elements is not a string)', function () {
      const stopwords = [function f () {}]
      // @ts-expect-error Test for behaviour with wrong parameters
      expect(tfidf.setStopwords(stopwords)).toEqual(false)
    })
  })

  describe('Remove documents', function () {
    it('should remove a document', function () {
      tfidf = new TfIdf()

      tfidf.addDocument('this document is about node.', 0)
      tfidf.addDocument('this document isn\'t about node.', 1)

      const result1 = tfidf.removeDocument(0)
      expect(result1).toEqual(true)
      const result2 = tfidf.removeDocument(0)
      expect(result2).toEqual(false)
    })
  })
})
