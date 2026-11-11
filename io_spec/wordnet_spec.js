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

const WordNet = require('../lib/natural/wordnet/wordnet')

describe('wordnet', function () {
  it('should lookup synonyms', function (done) {
    const wordnet = new WordNet()

    wordnet.lookupSynonyms('entity', function (records) {
      expect(records.length).toBe(3)
      done()
    })
  })

  function expectResults (records) {
    expect(records.length).toBe(3)
    expect(records[0].synsetOffset).toBe(4431553)
    expect(records[1].synsetOffset).toBe(2137)
    expect(records[2].synsetOffset).toBe(1930)
  }

  it('should lookup synonyms give a synset offset and a pos', function (done) {
    const wordnet = new WordNet()

    wordnet.getSynonyms(1740, 'n', function (records) {
      expectResults(records)
      done()
    })
  })

  it('should lookup synonyms via a provided synset object', function (done) {
    const wordnet = new WordNet()

    wordnet.lookup('entity', function (results) {
      wordnet.getSynonyms(results[0], function (records) {
        expectResults(records)
        done()
      })
    })
  })

  it('should add records but once', function (done) {
    const wordnet = new WordNet()

    wordnet.lookup('node', function (records) {
      expect(records.length).toBe(8)
      expect(records[0].lemma).toBe('node')

      done()
    })
  })

  describe('an offset that is not the start of a record', function () {
    const fs = require('fs')

    it('should give null for a synset offset past the end of the file', function (done) {
      const wordnet = new WordNet()
      const size = fs.statSync(wordnet.nounData.filePath).size

      wordnet.get(size + 1000, 'n', function (result) {
        expect(result).toBeNull()
        done()
      })
    })

    it('should give null for a synset offset in the middle of a record', function (done) {
      const wordnet = new WordNet()

      wordnet.get(1741, 'n', function (result) {
        expect(result).toBeNull()
        done()
      })
    })

    it('should still give the record for a valid synset offset', function (done) {
      const wordnet = new WordNet()

      wordnet.get(1740, 'n', function (result) {
        expect(result.synsetOffset).toBe(1740)
        expect(result.lemma).toBe('entity')
        done()
      })
    })

    it('should give no synonyms for a synset offset past the end of the file', function (done) {
      const wordnet = new WordNet()
      const size = fs.statSync(wordnet.nounData.filePath).size

      wordnet.getSynonyms(size + 1000, 'n', function (records) {
        expect(records).toEqual([])
        done()
      })
    })
  })

  describe('reading a line', function () {
    const fs = require('fs')
    const os = require('os')
    const path = require('path')
    const WordNetFile = require('../lib/natural/wordnet/wordnet_file')

    function readLineAt (content, position, callback) {
      const file = path.join(os.tmpdir(), 'natural-wordnet-file-' + process.pid + '.txt')
      fs.writeFileSync(file, content)
      const fd = fs.openSync(file, 'r')
      WordNetFile.appendLineChar(fd, position, 0, Buffer.alloc(16), function (line) {
        fs.closeSync(fd)
        fs.unlinkSync(file)
        callback(line)
      })
    }

    it('should give the last line of a file that does not end in a newline', function (done) {
      readLineAt('first\nlast', 6, function (line) {
        expect(line).toBe('last')
        done()
      })
    })

    it('should give an empty line for a position past the end of the file', function (done) {
      readLineAt('first\n', 100, function (line) {
        expect(line).toBe('')
        done()
      })
    })
  })
})
