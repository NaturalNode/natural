/*
  Copyright (c) 2018, Domingo Martín Mancera, Hugo W.L. ter Doest (based on https://github.com/dmarman/lorca)

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

//var baseFolder = "/c/Workspace/natural/lib/natural/sentiment/";
var baseFolder = "/home/hugo/Workspace/natural/lib/natural/sentiment/";
var languageFiles = {
  "afinn" : {
    "English": ["afinn-165", baseFolder + "English/negations.json"],
    "Spanish": [baseFolder + "Spanish/sentimenter_AFINN", baseFolder + "Spanish/negations.json"]
  },
  "senticon": {
    "Spanish": [baseFolder + "Spanish/senticon", baseFolder + "Spanish/negations.json"]
  }
};

class SentimentAnalyzer {

  constructor(language, stemmer, type) {
    this.language = language;
    this.stemmer = stemmer;

    this.vocabulary = require(languageFiles[type][language][0]);
    if (type === "senticon") {
      Object.keys(this.vocabulary).forEach(word => {
        this.vocabulary[word] = this.vocabulary[word].pol;
      });
    }

    this.negations = [];
    if (languageFiles[type][language][1]) {
      this.negations = require(languageFiles[type][language][1]).words;
    }
    if (stemmer) {
      var vocaStemmed = {};
      for(var token in this.vocabulary) {
            vocaStemmed[stemmer.stem(token)] = this.vocabulary[token];
      }
      this.vocabulary = vocaStemmed;
    }
  }

  // words is an array of words (strings)
  getSentiment(words) {
    var score = 0;
    var negator = 1;

    words.forEach((token) => {
      var lowerCased = token.toLowerCase();
      if (this.negations.indexOf(lowerCased) > -1) {
        negator = -1;
      }
      if (this.stemmer) {
        var stemmedWord = this.stemmer.stem(lowerCased);
        if(this.vocabulary[stemmedWord] != undefined){
          score += negator * this.vocabulary[stemmedWord];
        }
      }
      else {
        if (this.vocabulary[lowerCased] != undefined) {
          score += negator * this.vocabulary[lowerCased];
        }
      }
    });

    score = score / words.length;

    return score;
  }

}

module.exports = SentimentAnalyzer;
