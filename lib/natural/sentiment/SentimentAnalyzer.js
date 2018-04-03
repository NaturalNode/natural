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

var languageFiles = {
  "afinn" : {
    "English": ["afinn-165", "./English/negations_en.json"],
    "Spanish": ["./Spanish/afinnShortSortedSpanish", "./Spanish/negations_es.json"]
  },
  "senticon": {
    "Spanish": ["./Spanish/senticon_es.json", "./Spanish/negations_es.json"],
    "English": ["./English/senticon_en.json", "./English/negations_en.json"],
    "Galician": ["./Galician/senticon_gl.json", ""],
    "Catalan": ["./Catalan/senticon_ca.json", ""],
    "Basque": ["./Basque/senticon_eu.json", ""]
  },
  "pattern": {
    "Dutch": ["./Dutch/pattern-sentiment-nl.json", "./Dutch/negations_du.json"],
    "Italian": ["./Italian/pattern-sentiment-it.json", ""],
    "English": ["./English/pattern-sentiment-en.json", "./English/negations_en.json"],
    "French": ["./French/pattern-sentiment-fr", ""]
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
    else {
      if (type == "pattern") {
        Object.keys(this.vocabulary).forEach(word => {
          this.vocabulary[word] = this.vocabulary[word].polarity;
        });
        //console.log(JSON.stringify(this.vocabulary, null, 2));
      }
    }

    this.negations = [];
    if (languageFiles[type][language][1] != "") {
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
    var nrHits = 0;

    words.forEach((token) => {
      var lowerCased = token.toLowerCase();
      if (this.negations.indexOf(lowerCased) > -1) {
        negator = -1;
        nrHits++;
      }
      else {
        // First try without stemming
        if (this.vocabulary[lowerCased] != undefined) {
          score += negator * this.vocabulary[lowerCased];
          nrHits++;
        }
        else {
          if (this.stemmer) {
            var stemmedWord = this.stemmer.stem(lowerCased);
            if(this.vocabulary[stemmedWord] != undefined) {
              score += negator * this.vocabulary[stemmedWord];
              nrHits++;
            }
          }
        }
      }
    });

    score = score / words.length;
    //console.log("Number of hits: " + nrHits);

    return score;
  }

}

module.exports = SentimentAnalyzer;
