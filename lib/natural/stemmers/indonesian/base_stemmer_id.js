/*
Copyright (c) 2017, Alif Bhaskoro, Andy Librian, R. Kukuh (Reimplemented from https://github.com/sastrawi/sastrawi)

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

const stopwords = require('../../util/stopwords_id')
const Tokenizer = require('../../tokenizers/aggressive_tokenizer_id')

module.exports = function () {
  const stemmer = this

  stemmer.stem = function (token) {
    return token
  }

  stemmer.addStopWord = function (stopWord) {
    stopwords.words.push(stopWord)
  }

  stemmer.addStopWords = function (moreStopWords) {
    stopwords.words = stopwords.words.concat(moreStopWords)
  }

  stemmer.removeStopWord = function (stopWord) {
    this.removeStopWords([stopWord])
  }

  stemmer.removeStopWords = function (moreStopWords) {
    moreStopWords.forEach(function (stopWord) {
      const idx = stopwords.words.indexOf(stopWord)
      if (idx >= 0) {
        stopwords.words.splice(idx, 1)
      }
    })
  }

  stemmer.tokenizeAndStem = function (text, keepStops) {
    const stemmedTokens = []
    const lowercaseText = text.toLowerCase()
    const tokens = new Tokenizer().tokenize(lowercaseText)

    if (keepStops) {
      tokens.forEach(function (token) {
        stemmedTokens.push(stemmer.stem(token))
      })
    } else {
      tokens.forEach(function (token) {
        if (stopwords.words.indexOf(token) === -1) { stemmedTokens.push(stemmer.stem(token)) }
      })
    }

    return stemmedTokens
  }

  /*
  stemmer.attach = function () {
    String.prototype.stem = function () {
      return stemmer.stem(this)
    }

    String.prototype.tokenizeAndStem = function (keepStops) {
      return stemmer.tokenizeAndStem(this, keepStops)
    }
  }
  */
}
