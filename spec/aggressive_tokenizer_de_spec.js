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

const Tokenizer = require('../lib/natural/tokenizers/aggressive_tokenizer_de')
const tokenizer = new Tokenizer()

describe('aggressive_tokenizer', function () {
  it('should tokenize strings with diacritics ä, ö and ü, and esszet ß', function () {
    expect(tokenizer.tokenize('Es werden nur Maßnahmen gefördert, die nicht aufgrund einer Rechtsvorschrift umgesetzt werden müssen.')).toEqual(
      ['Es', 'werden', 'nur', 'Maßnahmen', 'gefördert', 'die', 'nicht', 'aufgrund', 'einer',
      'Rechtsvorschrift', 'umgesetzt', 'werden', 'müssen'])
    expect(tokenizer.tokenize('Anträge sind vor Beginn der jeweiligen Maßnahme zu stellen.')).toEqual(
      ['Anträge', 'sind', 'vor', 'Beginn', 'der', 'jeweiligen', 'Maßnahme', 'zu', 'stellen'])
  })
})
