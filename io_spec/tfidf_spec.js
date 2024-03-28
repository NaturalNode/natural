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

const TfIdf = require('../lib/natural/tfidf/tfidf')
let tfidf

describe('tfidf io', function () {
  it('should be able to be serialized', function () {
    tfidf = new TfIdf()
    tfidf.addDocument('document one', 'un')
    tfidf.addDocument('document Two', 'deux')
    const s = JSON.stringify(tfidf)
    expect(s).toBe('{"documents":[{"__key":"un","document":1,"one":1},{"__key":"deux","document":1,"two":1}],"_idfCache":{}}')
  })

  it('should deserialize', function () {
    const s = '{"documents":[{"__key":"un","document":1,"one":1},{"__key":"deux","document":1,"two":1}]}'
    const tfidf = new TfIdf(JSON.parse(s))
    expect(tfidf.tfidf('one', 0)).toBe(1)
    expect(tfidf.tfidf('two', 0)).toBe(0)
  })

  it('should process files', function () {
    const tfidf = new TfIdf()
    tfidf.addFileSync('io_spec/test_data/tfidf/one')
    tfidf.addFileSync('io_spec/test_data/tfidf/two')
    expect(tfidf.tfidf('Document', 0)).toBe(0.5945348918918356)
    expect(tfidf.tfidf('one', 0)).toBe(1)
    expect(tfidf.tfidf('two', 0)).toBe(0)
  })

  // Test tf-idf computation on files loaded using readFileSync
  it('should load documents from files', function () {
    tfidf = new TfIdf()

    tfidf.addFileSync('io_spec/test_data/tfidf/tfidf_document1.txt', null, { node: 0, ruby: 1 })
    tfidf.addFileSync('io_spec/test_data/tfidf/tfidf_document2.txt', null, { node: 1, ruby: 3 })
    tfidf.addFileSync('io_spec/test_data/tfidf/tfidf_document3.txt', null, { node: 0, ruby: 3 })
    tfidf.addFileSync('io_spec/test_data/tfidf/tfidf_document4.txt', null, { node: 2, ruby: 1 })

    const correctCalculations = [
      1 * (1 + Math.log(4.0 / 4.0)),
      0,
      2 * (1 + Math.log(4.0 / 4.0)),
      1 * (1 + Math.log(4.0 / 3.0))
    ]

    tfidf.tfidfs('node', function (i, measure, k) {
      expect(measure).toBe(correctCalculations[k.node])
    })

    tfidf.tfidfs('ruby', function (i, measure, k) {
      expect(measure).toBe(correctCalculations[k.ruby])
    })

    // addFileSync with restoreCache flag set to true.
    tfidf.addFileSync('io_spec/test_data/tfidf/tfidf_document4.txt', null, { node: 2, ruby: 1 }, true)
  })

  // Test idf caching when adding documents from addFileSync
  it('should update a terms tf-idf score after adding documents from addFileSync', function () {
    tfidf = new TfIdf()

    // Add 2 documents
    tfidf.addFileSync('io_spec/test_data/tfidf/tfidf_document1.txt', null, 0)
    tfidf.addFileSync('io_spec/test_data/tfidf/tfidf_document2.txt', null, 1)

    // check the tf-idf for 'node'
    expect(tfidf.tfidf('node', 0)).toBe(1 * (1 + Math.log(2.0 / 2.0)))

    // Add 2 more documents
    tfidf.addFileSync('io_spec/test_data/tfidf/tfidf_document3.txt')
    tfidf.addFileSync('io_spec/test_data/tfidf/tfidf_document4.txt')

    // Ensure that the tf-idf in the same document has changed to reflect the new idf.
    expect(tfidf.tfidf('node', 0)).toBe(1 * (1 + Math.log(4.0 / 4.0)))
  })

  it('should use the specified encoding for addFileSync', function () {
    tfidf = new TfIdf()

    tfidf.addFileSync('io_spec/test_data/tfidf/tfidf_document1.txt', 'base64')
    tfidf.addFileSync('io_spec/test_data/tfidf/tfidf_document1.txt', 'utf8')

    expect(tfidf.tfidf('dghpcybkb2n1bwvudcbpcybhym91dcbub2rllg', 0)).toBe(1 * (1 + Math.log(2.0 / 2.0)))
  })

  // Test encoding check for addFileSync
  it('should require a valid encoding for addFileSync', function () {
    tfidf = new TfIdf()

    expect(function () { tfidf.addFileSync('spec/test_data/tfidf_document1.txt', 'foobar') }).toThrow(new Error('Invalid encoding: foobar'))
  })
})
