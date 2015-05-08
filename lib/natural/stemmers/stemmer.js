/*
 Copyright (c) 2011, Chris Umbel

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

var stopwords = require('../util/stopwords');
var Tokenizer = require('../tokenizers/aggressive_tokenizer');

module.exports = function() {
  var stemmer = this;
  var stemmedStopwords = [];

  stemmer.stemStopwords = function() {
    for (var i = 0; i < stopwords.words.length; i++) {
      stemmedStopwords.push(stemmer.stem(stopwords.words[i]));
    }
  };

  stemmer.stem = function(token) {
    return token;
  };

  stemmer.addStopWord = function(stopWord) {
    stopwords.words.push(stopWord);
    stemmer.stemStopwords();
  };

  stemmer.addStopWords = function(moreStopWords) {
    stopwords.words = stopwords.words.concat(moreStopWords);
    stemmer.stemStopwords();
  };

  stemmer.tokenizeAndStem = function(text, keepStops) {
    var stemmedTokens = [];

    new Tokenizer().tokenize(text).forEach(function(token) {
      stemmedToken = stemmer.stem(token);
      if(keepStops || stemmedStopwords.indexOf(stemmedToken) == -1)
        stemmedTokens.push(stemmedToken);
    });

    return stemmedTokens;
  };

  stemmer.attach = function() {
    String.prototype.stem = function() {
      return stemmer.stem(this);
    };

    String.prototype.tokenizeAndStem = function(keepStops) {
      return stemmer.tokenizeAndStem(this, keepStops);
    };
  };

  stemmer.stemStopwords();
}
