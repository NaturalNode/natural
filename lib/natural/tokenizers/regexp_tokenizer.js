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

const DEBUG = false

const Tokenizer = require('./tokenizer')
const _ = require('underscore')

class RegexpTokenizer extends Tokenizer {
  constructor (opts) {
    super(opts)
    const options = opts || {}
    this._pattern = options.pattern || this._pattern
    this.discardEmpty = options.discardEmpty || true

    // Match and split on GAPS not the actual WORDS
    this._gaps = options.gaps

    if (this._gaps === undefined) {
      this._gaps = true
    }
  }

  tokenize (s) {
    let results

    if (this._gaps) {
      results = s.split(this._pattern)
      return (this.discardEmpty) ? _.without(results, '', ' ') : results
    } else {
      return s.match(this._pattern)
    }
  }
}

exports.RegexpTokenizer = RegexpTokenizer

const orthographyMatchers = require('./orthography_matchers')

class OrthographyTokenizer {
  constructor (options) {
    const pattern = orthographyMatchers[options.language]
    DEBUG && console.log(pattern)

    if (!pattern) {
      this.tokenizer = new WordTokenizer()
    } else {
      this.tokenizer = new RegexpTokenizer(options)
      this.tokenizer._pattern = pattern
      DEBUG && console.log(this.tokenizer)
    }
  }

  tokenize (text) {
    return this.tokenizer.tokenize(text)
  }
}

exports.OrthographyTokenizer = OrthographyTokenizer

/***
 * A tokenizer that divides a text into sequences of alphabetic and
 * non-alphabetic characters.  E.g.:
 *
 *      >>> WordTokenizer().tokenize("She said 'hello'.")
 *      ['She', 'said', 'hello']
 *
 */
class WordTokenizer extends RegexpTokenizer {
  constructor (options) {
    super(options)
    this._pattern = /[^A-Za-zА-Яа-я0-9_]+/
  }
}

exports.WordTokenizer = WordTokenizer

/***
 * A tokenizer that divides a text into sequences of alphabetic and
 * non-alphabetic characters.  E.g.:
 *
 *      >>> WordPunctTokenizer().tokenize("She said 'hello'.")
 *      ["She","said","'","hello","'","."]
 *
 */
class WordPunctTokenizer extends RegexpTokenizer {
  constructor (options) {
    if (!options) {
      options = {}
    }
    options.pattern = /([A-Za-zÀ-ÿ-]+|[0-9._]+|.|!|\?|'|"|:|;|,|-)/i
    super(options)
  }
}

exports.WordPunctTokenizer = WordPunctTokenizer
