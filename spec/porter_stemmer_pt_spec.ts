/*
Copyright (c) 2019, Luís Rodrigues, Hugo W.L. ter Doest

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

import { PorterStemmerPt as stemmer } from 'lib/natural'
import rawObj from '../spec/test_data/snowball_pt.json'
const snowBallDict = rawObj as Record<string, string>

const DEBUG = false

describe('porter_stemmer (pt)', function () {
  it('should perform stemming on a lot of words', function () {
    const errors = []

    Object.keys(snowBallDict).forEach(word => {
      const stemmed = stemmer.stem(word)
      const expectedStem = snowBallDict[word]
      if (stemmed !== snowBallDict[word]) {
        DEBUG && console.log('Error:', word, 'Expected:', expectedStem, 'Got:', stemmed)
        errors.push({
          word,
          expected: expectedStem,
          actual: stemmed
        })
      }
    })

    expect(errors.length).toEqual(0)
  })
})
