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

const WordNetFile = require('./wordnet_file')
const util = require('util')

function get (location, callbackFunction) {
  const buff = Buffer.alloc(4096)

  this.open(function (err, fd, done) {
    if (err) {
      console.log(err)
      return
    }
    WordNetFile.appendLineChar(fd, location, 0, buff, function (line) {
      done()
      const data = line.split('| ')
      const tokens = data[0].split(/\s+/)
      const ptrs = []
      const wCnt = parseInt(tokens[3], 16)
      const synonyms = []

      for (let i = 0; i < wCnt; i++) {
        synonyms.push(tokens[4 + i * 2])
      }

      const ptrOffset = (wCnt - 1) * 2 + 6
      for (let i = 0; i < parseInt(tokens[ptrOffset], 10); i++) {
        ptrs.push({
          pointerSymbol: tokens[ptrOffset + 1 + i * 4],
          synsetOffset: parseInt(tokens[ptrOffset + 2 + i * 4], 10),
          pos: tokens[ptrOffset + 3 + i * 4],
          sourceTarget: tokens[ptrOffset + 4 + i * 4]
        })
      }

      // break "gloss" into definition vs. examples
      const glossArray = data[1].split('; ')
      const definition = glossArray[0]
      const examples = glossArray.slice(1)

      for (let k = 0; k < examples.length; k++) {
        examples[k] = examples[k].replace(/"/g, '').replace(/\s\s+/g, '')
      }

      callbackFunction({
        synsetOffset: parseInt(tokens[0], 10),
        lexFilenum: parseInt(tokens[1], 10),
        pos: tokens[2],
        wCnt: wCnt,
        lemma: tokens[4],
        synonyms: synonyms,
        lexId: tokens[5],
        ptrs: ptrs,
        gloss: data[1],
        def: definition,
        exp: examples
      })
    })
  })
}

const DataFile = function (dataDir, name) {
  WordNetFile.call(this, dataDir, 'data.' + name)
}

util.inherits(DataFile, WordNetFile)
DataFile.prototype.get = get

module.exports = DataFile
