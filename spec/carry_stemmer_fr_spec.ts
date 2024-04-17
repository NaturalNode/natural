/*
Copyright (c) 2020, Hugo W.L. ter Doest

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

import { CarryStemmerFr as stemmer } from 'lib/natural'

// const snowBallDict = require('spec/test_data/snowball_fr.json')

const tests = [
  {
    input: 'action',
    output: 'ac'
  },
  {
    input: 'acteur',
    output: 'ac'
  },
  {
    input: 'actrices',
    output: 'ac'
  },
  {
    input: 'Dleyton',
    output: 'Dleyton'
  },
  {
    input: 'volera',
    output: 'vol'
  }
]

const testSentences = [
  {
    input: 'Le petit cheval de manège',
    output: ['pet', 'cheval', 'manèg']
  }
]

describe('Carry stemmer', function () {
  tests.forEach(test => {
    it('stems ' + test.input + ' correctly', function () {
      expect(stemmer.stem(test.input)).toBe(test.output)
    })
  })

  testSentences.forEach(test => {
    it('tokenizes and stems ' + test.input + ' correctly', function () {
      expect(stemmer.tokenizeAndStem(test.input)).toEqual(test.output)
    })
  })

  /*
  it('should perform stemming on a lot of words', function() {
    var ok = [];
    var ko = [];

    Object.keys(snowBallDict).forEach(word => {

      var stemmed = stemmer.stem(word);
      var expectedStem = snowBallDict[word];

      if (stemmed === expectedStem) {
        ok.push(word);
      }
      else {
        ko.push({
          word: word,
          expected: expectedStem,
          actual: stemmed
        });
      }
    });

    expect(ko.length).toBe(0);
  });
*/
})
