/*
Copyright (c) 2011, Rob Ellis, Chris Umbel

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

const Tokenizer = require('./tokenizer')
const util = require('util')
const _ = require('underscore')

// Base Class for RegExp Matching
const RegexpTokenizer = function (opts) {
  const options = opts || {}
  this._pattern = options.pattern || this._pattern
  this.discardEmpty = options.discardEmpty || true

  // Match and split on GAPS not the actual WORDS
  this._gaps = options.gaps

  if (this._gaps === undefined) {
    this._gaps = true
  }
}

util.inherits(RegexpTokenizer, Tokenizer)

RegexpTokenizer.prototype.tokenize = function (s) {
  let results

  if (this._gaps) {
    results = s.split(this._pattern)
    return (this.discardEmpty) ? _.without(results, '', ' ') : results
  } else {
    return s.match(this._pattern)
  }
}

exports.RegexpTokenizer = RegexpTokenizer

const orthographyMatchers = require('./orthography_matchers')

/***
 * A tokenizer that accepts an alphabet definition.
 * @param {string} options.language ISO 639-1 for the language, e.g. 'en'
 */
const OrthographyTokenizer = function (options) {
  const pattern = orthographyMatchers[options.language]
  if (!pattern) {
    WordTokenizer.call(this, options)
  } else {
    this._pattern = pattern
    RegexpTokenizer.call(this, options)
  }
}

util.inherits(OrthographyTokenizer, RegexpTokenizer)

exports.OrthographyTokenizer = OrthographyTokenizer

/***
 * A tokenizer that divides a text into sequences of alphabetic and
 * non-alphabetic characters.  E.g.:
 *
 *      >>> WordTokenizer().tokenize("She said 'hello'.")
 *      ['She', 'said', 'hello']
 *
 */
const WordTokenizer = function (options) {
  this._pattern = /[^A-Za-zА-Яа-я0-9_]+/
  RegexpTokenizer.call(this, options)
}

util.inherits(WordTokenizer, RegexpTokenizer)
exports.WordTokenizer = WordTokenizer

/***
 * A tokenizer that divides a text into sequences of alphabetic and
 * non-alphabetic characters.  E.g.:
 *
 *      >>> WordPunctTokenizer().tokenize("She said 'hello'.")
 *      ["She","said","'","hello","'","."]
 *
 */
const WordPunctTokenizer = function (options) {
  this._pattern = /([A-zÀ-ÿ-]+|[0-9._]+|.|!|\?|'|"|:|;|,|-)/i
  RegexpTokenizer.call(this, options)
}

util.inherits(WordPunctTokenizer, RegexpTokenizer)
exports.WordPunctTokenizer = WordPunctTokenizer
