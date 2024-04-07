/*
Copyright (c) 2023, Hugo W.L. ter Doest

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

const stemmer = require('../lib/natural/stemmers/porter_stemmer_de')
const snowBallDict = require('./test_data/snowball_de.json')
const DEBUG = false

describe('porter_stemmer_no', function () {
  it('should perform stemming on a lot of words', function () {
    const ok = []
    const ko = []

    Object.keys(snowBallDict).forEach(word => {
      const stemmed = stemmer.stem(word)
      const expectedStem = snowBallDict[word]
      DEBUG && console.log(word + ' -> ' + stemmed)

      if (stemmed === expectedStem) {
        ok.push(word)
      } else {
        ko.push({
          word: word,
          expected: expectedStem,
          actual: stemmed
        })
      }
    })

    expect(ko.length).toBe(0)
  })
})
