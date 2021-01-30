/*
Copyright (c) 2018, Hugo W.L. ter Doest

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

const OrthographyTokenizer = require('../lib/natural/tokenizers/regexp_tokenizer').OrthographyTokenizer

const sentencesInFinnish = [
  ['Mikä sinun nimesi on?', ['Mikä', 'sinun', 'nimesi', 'on']],
  ['Hyvää kiitos, entä sinulle?', ['Hyvää', 'kiitos', 'entä', 'sinulle']],
  ['Tämä herrasmies maksaa kaiken', ['Tämä', 'herrasmies', 'maksaa', 'kaiken']]
]

describe('The orthography tokenizer tokenizes sentences in Finnish', function () {
  const tokenizer = new OrthographyTokenizer({ language: 'fi' })
  sentencesInFinnish.forEach(function (sentencePlusResult) {
    it('It should correctly tokenize the following sentence: ' + sentencePlusResult[0], function () {
      // console.log(tokenizer.tokenize(sentencePlusResult[0]));
      expect(tokenizer.tokenize(sentencePlusResult[0])).toEqual(sentencePlusResult[1])
    })
  })
})
