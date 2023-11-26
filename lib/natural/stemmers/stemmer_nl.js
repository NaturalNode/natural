/*
Copyright (c) 2018 Hugo W.L. ter Doest

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

const stopwords = require('../util/stopwords_nl')
const Tokenizer = require('../tokenizers/aggressive_tokenizer_nl')

class Stemmer {
  stem (token) {
    return token
  };

  tokenizeAndStem (text, keepStops) {
    const stemmedTokens = []

    const that = this
    new Tokenizer().tokenize(text).forEach(function (token) {
      if (keepStops || stopwords.words.indexOf(token) === -1) {
        let resultToken = token.toLowerCase()
        // if (resultToken.match(new RegExp('[a-zäëïöüáéíóúè0-9]+', 'gi'))) {
        if (resultToken.match(/[a-zäëïöüáéíóúè0-9]+/gi)) {
          resultToken = that.stem(resultToken)
        }
        stemmedTokens.push(resultToken)
      }
    })

    return stemmedTokens
  };

  /*
  attach () {
    const that = this
    String.prototype.stem = function () {
      return that.stem(this)
    }

    String.prototype.tokenizeAndStem = function (keepStops) {
      return that.tokenizeAndStem(this, keepStops)
    }
  }
  */
}

module.exports = Stemmer
