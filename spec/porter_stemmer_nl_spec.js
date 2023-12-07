/*
Copyright (c) 2019, Hugo W.L. ter Doest

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

const stemmer = require('../lib/natural/stemmers/porter_stemmer_nl')
const snowBallDict = require('spec/test_data/snowball_nl.json')
// const dutchSentences = require('spec/test_data/Volkskrant-20150205-Knot-geldpers-aanzetten-is-paardenmiddel-voor-half-procent-inflatie.json')
// const dutchStemResults = require('spec/test_data/dutchStemResults.json')

const DEBUG = false

describe('porter_stemmer_nl', function () {
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

    // The stemmer has an error count of 237 against the snowball list for nl that has 45669 entries
    expect(errors.length).toEqual(237)
  })

  // Commented out because hyphens are not processed correctly in the expected results
  /*
  it('should tokenize a piece of text', function () {
    dutchSentences.sentences.forEach((sentence, index) => {
      const result = stemmer.tokenizeAndStem(sentence, true)
      DEBUG && console.log(result)
      expect(result).toEqual(dutchStemResults.results[index])
    })
  })
  */

  /*
  it('should work with the attached notation', function() {
    stemmer.attach();
    expect("mogelijkheid".stem()).toEqual("mogelijk");
    expect("Knot: geldpers aanzetten is paardenmiddel voor half procent inflatie".tokenizeAndStem(true)).toEqual(
      [ 'knot', 'geldper', 'aanzet', 'is', 'paardenmiddel', 'vor', 'half', 'procent', 'inflatie' ]);
  });
  */
})
