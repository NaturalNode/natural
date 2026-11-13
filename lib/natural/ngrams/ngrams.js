/*
Copyright (c) 2011, 2018 Rob Ellis, Chris Umbel, Hugo W.L. ter Doest

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

const _ = require('underscore')
const Tokenizer = require('../tokenizers/regexp_tokenizer').WordTokenizer
const padSequence = require('./pad_sequence')
let tokenizer = new Tokenizer()
let frequencies = {}
let nrOfNgrams = 0

exports.setTokenizer = function (t) {
  if (!_.isFunction(t.tokenize)) { throw new Error('Expected a valid Tokenizer') }
  tokenizer = t
}

exports.ngrams = function (sequence, n, startSymbol, endSymbol, stats) {
  return ngrams(sequence, n, startSymbol, endSymbol, stats)
}

exports.bigrams = function (sequence, startSymbol, endSymbol, stats) {
  return ngrams(sequence, 2, startSymbol, endSymbol, stats)
}

exports.trigrams = function (sequence, startSymbol, endSymbol, stats) {
  return ngrams(sequence, 3, startSymbol, endSymbol, stats)
}

exports.multrigrams = function (sequence, n, startSymbol, endSymbol, stats) {
  return ngrams(sequence, n, startSymbol, endSymbol, stats)
}

// Calculates a key (string) that can be used for a map
function arrayToKey (arr) {
  let result = '('
  arr.forEach(function (x) {
    result += x + ', '
  })
  result = result.substr(0, result.length - 2) + ')'
  return result
};

// Updates the statistics for the new ngram
function countNgrams (ngram) {
  nrOfNgrams++
  const key = arrayToKey(ngram)
  if (!frequencies[key]) {
    frequencies[key] = 0
  }
  frequencies[key]++
}

// If stats is true, statistics will be returned
const ngrams = function (sequence, n, startSymbol, endSymbol, stats) {
  const result = []
  frequencies = {}
  nrOfNgrams = 0

  if (!_.isArray(sequence)) {
    sequence = tokenizer.tokenize(sequence)
  }

  sequence = padSequence(sequence, n, startSymbol, endSymbol)
  const count = _.max([0, sequence.length - n + 1])

  // Build the complete ngrams
  for (let i = 0; i < count; i++) {
    const ngram = sequence.slice(i, i + n)
    result.push(ngram)
    if (stats) {
      countNgrams(ngram)
    }
  }

  if (stats) {
    // Count frequencies
    const Nr = {}
    Object.keys(frequencies).forEach(function (key) {
      if (!Nr[frequencies[key]]) {
        Nr[frequencies[key]] = 0
      }
      Nr[frequencies[key]]++
    })

    // Return the ngrams AND statistics
    return {
      ngrams: result,
      frequencies: frequencies,
      Nr: Nr,
      numberOfNgrams: nrOfNgrams
    }
  } else { // Do not break existing API of this module
    return result
  }
}
