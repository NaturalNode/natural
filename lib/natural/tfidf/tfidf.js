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

const _ = require('underscore')
const Tokenizer = require('../tokenizers/regexp_tokenizer').WordTokenizer
let tokenizer = new Tokenizer()
let stopwords = require('../util/stopwords').words
const fs = require('fs')

// Returns a frequency map of word to frequency
// Key is the document key and stored in the map that is returned as __keys
function buildDocument (text, key) {
  let stopOut

  if (typeof text === 'string') {
    text = tokenizer.tokenize(text.toLowerCase())
    stopOut = true
  } else if (!_.isArray(text)) {
    stopOut = false
    return text
  }

  return text.reduce(function (document, term) {
    // next line solves https://github.com/NaturalNode/natural/issues/119
    if (typeof document[term] === 'function') {
      document[term] = 0
    }
    if (!stopOut || stopwords.indexOf(term) < 0) {
      document[term] = (document[term] ? document[term] + 1 : 1)
    }
    return document
  }, { __key: key })
}

function documentHasTerm (term, document) {
  return document[term] && document[term] > 0
}

// backwards compatibility for < node 0.10
function isEncoding (encoding) {
  if (typeof Buffer.isEncoding !== 'undefined') { return Buffer.isEncoding(encoding) }
  switch ((encoding + '').toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
    case 'raw':
      return true
  }
  return false
}

class TfIdf {
  constructor (deserialized) {
    if (deserialized) {
      this.documents = deserialized.documents
    } else {
      this.documents = []
    }
    this._idfCache = {}
  }

  static tf (term, document) {
    return document[term] ? document[term] : 0
  }

  // Returns the inverse document frequency of the term
  // If force is true the cache will be invalidated and recomputed
  idf (term, force) {
    // Lookup the term in the New term-IDF caching,
    // this will cut search times down exponentially on large document sets.
    // if (this._idfCache[term] && this._idfCache.hasOwnProperty(term) && force !== true) { return this._idfCache[term] }
    if (this._idfCache[term] && force !== true) {
      return this._idfCache[term]
    }

    // Count the number of documents that contain the term
    const docsWithTerm = this.documents.reduce(function (count, document) {
      return count + (documentHasTerm(term, document) ? 1 : 0)
    }, 0)

    // Compute the inverse document frequency
    const idf = 1 + Math.log((this.documents.length) / (1 + docsWithTerm))

    // Add the idf to the term cache and return it
    this._idfCache[term] = idf
    return idf
  }

  // If restoreCache is set to true, all terms idf scores currently cached will be recomputed.
  // Otherwise, the cache will just be wiped clean
  addDocument (document, key, restoreCache) {
    this.documents.push(buildDocument(document, key))

    // make sure the cache is invalidated when new documents arrive
    if (restoreCache === true) {
      for (const term in this._idfCache) {
        // invoking idf with the force option set will
        // force a recomputation of the idf, and it will
        // automatically refresh the cache value.
        this.idf(term, true)
      }
    } else {
      // this._idfCache = {}
      // so that we do not have trouble with terms that match property names
      this._idfCache = Object.create(null)
    }
  }

  // If restoreCache is set to true, all terms idf scores currently cached will be recomputed.
  // Otherwise, the cache will just be wiped clean
  addFileSync (path, encoding, key, restoreCache) {
    if (!encoding) { encoding = 'utf8' }
    if (!isEncoding(encoding)) { throw new Error('Invalid encoding: ' + encoding) }

    const document = fs.readFileSync(path, encoding)
    this.documents.push(buildDocument(document, key))

    // make sure the cache is invalidated when new documents arrive
    if (restoreCache === true) {
      for (const term in this._idfCache) {
        // invoking idf with the force option set will
        // force a recomputation of the idf, and it will
        // automatically refresh the cache value.
        this.idf(term, true)
      }
    } else {
      this._idfCache = {}
    }
  }

  tfidf (terms, d) {
    const _this = this

    if (!_.isArray(terms)) {
      terms = tokenizer.tokenize(terms.toString().toLowerCase())
    }

    return terms.reduce(function (value, term) {
      let idf = _this.idf(term)
      idf = idf === Infinity ? 0 : idf
      return value + (TfIdf.tf(term, _this.documents[d]) * idf)
    }, 0.0)
  }

  listTerms (d) {
    const terms = []
    const _this = this
    for (const term in this.documents[d]) {
      if (this.documents[d]) {
        if (term !== '__key') {
          terms.push({
            term,
            tf: TfIdf.tf(term, _this.documents[d]),
            idf: _this.idf(term),
            tfidf: _this.tfidf(term, d)
          })
        }
      }
    }

    return terms.sort(function (x, y) { return y.tfidf - x.tfidf })
  }

  tfidfs (terms, callback) {
    const tfidfs = new Array(this.documents.length)

    for (let i = 0; i < this.documents.length; i++) {
      tfidfs[i] = this.tfidf(terms, i)

      if (callback) { callback(i, tfidfs[i], this.documents[i].__key) }
    }

    return tfidfs
  }

  // Define a tokenizer other than the default "WordTokenizer"
  setTokenizer (t) {
    if (!_.isFunction(t.tokenize)) { throw new Error('Expected a valid Tokenizer') }
    tokenizer = t
  }

  // Define a stopwords other than the default
  setStopwords (customStopwords) {
    if (!Array.isArray(customStopwords)) { return false }

    let wrongElement = false
    customStopwords.forEach(stopword => {
      if ((typeof stopword) !== 'string') {
        wrongElement = true
      }
    })
    if (wrongElement) {
      return false
    }

    stopwords = customStopwords
    return true
  }
}

module.exports = TfIdf
