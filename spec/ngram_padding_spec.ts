/*
Copyright (c) 2019, Rob Ellis, Chris Umbel, Hugo W.L. ter Doest

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

import { NGrams, NGramsZH } from 'lib/natural'

const implementations = [
  { name: 'ngrams', implementation: NGrams, token: 'hello' },
  { name: 'ngrams (zh)', implementation: NGramsZH, token: '你' }
]

implementations.forEach(({ name, implementation, token }) => {
  describe(name + ' padding short sequences', function () {
    it('should include the trigram spanning both boundary symbols', function () {
      expect(implementation.trigrams(token, '[start]', '[end]')).toEqual([
        ['[start]', '[start]', token],
        ['[start]', token, '[end]'],
        [token, '[end]', '[end]']
      ])
    })

    it('should generate complete 4-grams from a two-token array', function () {
      const sequence = [token, token]
      expect(implementation.ngrams(sequence, 4, '[start]', '[end]')).toEqual([
        ['[start]', '[start]', '[start]', token],
        ['[start]', '[start]', token, token],
        ['[start]', token, token, '[end]'],
        [token, token, '[end]', '[end]'],
        [token, '[end]', '[end]', '[end]']
      ])
      expect(sequence).toEqual([token, token])
    })

    it('should omit incomplete ngrams when only left padding is requested', function () {
      expect(implementation.ngrams([token], 4, '[start]')).toEqual([
        ['[start]', '[start]', '[start]', token]
      ])
    })

    it('should omit incomplete ngrams when only right padding is requested', function () {
      expect(implementation.ngrams([token], 4, null, '[end]')).toEqual([
        [token, '[end]', '[end]', '[end]']
      ])
    })

    it('should produce boundary-only ngrams for empty sequences with both paddings', function () {
      expect(implementation.bigrams('', '[start]', '[end]')).toEqual([
        ['[start]', '[end]']
      ])
      expect(implementation.trigrams([], '[start]', '[end]')).toEqual([
        ['[start]', '[start]', '[end]'],
        ['[start]', '[end]', '[end]']
      ])
    })

    it('should return no ngrams when the padded sequence is still too short', function () {
      expect(implementation.ngrams([], 3, '[start]')).toEqual([])
      expect(implementation.ngrams([], 3, null, '[end]')).toEqual([])
      expect(implementation.ngrams([token], 3)).toEqual([])
    })

    it('should accept empty strings as boundary symbols', function () {
      expect(implementation.trigrams([token], '', '')).toEqual([
        ['', '', token],
        ['', token, ''],
        [token, '', '']
      ])
    })

    it('should not pad unigrams', function () {
      expect(implementation.ngrams([token], 1, '[start]', '[end]')).toEqual([[token]])
      expect(implementation.ngrams([], 1, '[start]', '[end]')).toEqual([])
    })
  })
})

describe('ngram statistics for short padded sequences', function () {
  it('should count the complete padded ngrams', function () {
    expect(NGrams.trigrams('hello', '[start]', '[end]', true)).toEqual({
      ngrams: [
        ['[start]', '[start]', 'hello'],
        ['[start]', 'hello', '[end]'],
        ['hello', '[end]', '[end]']
      ],
      frequencies: {
        '([start], [start], hello)': 1,
        '([start], hello, [end])': 1,
        '(hello, [end], [end])': 1
      },
      Nr: { 1: 3 },
      numberOfNgrams: 3
    })
  })

  it('should count repeated boundary-only ngrams', function () {
    expect(NGrams.trigrams([], '#', '#', true)).toEqual({
      ngrams: [['#', '#', '#'], ['#', '#', '#']],
      frequencies: { '(#, #, #)': 2 },
      Nr: { 2: 1 },
      numberOfNgrams: 2
    })
  })
})
