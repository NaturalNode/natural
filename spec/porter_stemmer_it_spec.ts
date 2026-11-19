/*
Copyright (c) 2019, Leonardo Fenu, Chris Umbel, Hugo W.L. ter Doest

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

import { PorterStemmerIt as stemmer } from 'lib/natural'
import rawJson from '../spec/test_data/snowball_it.json'
const snowBallDict = rawJson as Record<string, string>

describe('porter_stemmer (it)', function () {
  it('should perform stem', function () {
    const errors = []
    Object.keys(snowBallDict).forEach(word => {
      const stemmed = stemmer.stem(word)
      const expectedStem = snowBallDict[word]
      if (stemmed !== snowBallDict[word]) {
        console.log('Error:', word, 'Expected:', expectedStem, 'Got:', stemmed)
        errors.push({
          word,
          expected: expectedStem,
          actual: stemmed
        })
      }
    })

    expect(errors.length).toEqual(0)
  })

  it('should test the region of the longest step 1 suffix only', function () {
    // "atrice" is the longest suffix but it is not in R2, so "ice" must not be removed
    expect(stemmer.stem('giocatrici')).toEqual('giocatric')
    expect(stemmer.stem('pagatrice')).toEqual('pagatric')
    expect(stemmer.stem('portatrici')).toEqual('portatric')
  })

  it('should mark i and u between accented vowels', function () {
    expect(stemmer.stem('gioià')).toEqual('gioi')
    expect(stemmer.stem('sdraiò')).toEqual('sdrai')
  })

  it('should not return the internal U marker for short words', function () {
    expect(stemmer.stem('qu')).toEqual('qu')
  })

  /*
  it('should tokenize and stem attached', function() {
    stemmer.attach();

    expect('SOPRA la panca la capra CAMPA'.tokenizeAndStem()).toEqual([ 'sopr', 'panc', 'capr', 'camp' ]);
    expect('SOTTO la panca la capra CREPA'.tokenizeAndStem()).toEqual([ 'sott', 'panc', 'capr', 'crep' ]);
  });
  */
})
