/*
Copyright (c) 2014, Ismaël Héry

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

module.exports = function () {
  'use strict';

  var Stemmer = this,
    stopwords = require('../util/stopwords_pt'),
    Tokenizer = require('../tokenizers/aggressive_tokenizer_pt');

  Stemmer.stem = function (token) {
    return token;
  };

  Stemmer.addStopWords = function (word) {
    stopwords.words.push(word);
  };

  Stemmer.addStopWords = function (words) {
    stopwords.words = stopwords.words.concat(words);
  };

  Stemmer.tokenizeAndStem = function(text, keepStops) {
    var stemmedTokens = [];

    var tokenStemmer = function (token) {
      if (keepStops || stopwords.words.indexOf(token.toLowerCase()) === -1) {
        stemmedTokens.push(Stemmer.stem(token));
      }
    };

    new Tokenizer().tokenize(text).forEach(tokenStemmer);

    return stemmedTokens;
  };

  Stemmer.attach = function () {
    String.prototype.stem = function () {
      return Stemmer.stem(this);
    };

    String.prototype.tokenizeAndStem = function (keepStops) {
      return Stemmer.tokenizeAndStem(this, keepStops);
    };
  };
};
