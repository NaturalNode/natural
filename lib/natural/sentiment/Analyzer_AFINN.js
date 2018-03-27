

//var baseFolder = "/c/Workspace/natural/lib/natural/sentiment/";
var baseFolder = "/home/hugo/Workspace/natural/lib/natural/sentiment/";
var languageFiles = {
  "English": ["afinn-165", baseFolder + "English/negations.json"],
  "Spanish": [baseFolder + "sentimenter_AFINN", baseFolder + "negations.json"]
};

class SentimentAnalyzer {
  constructor(language, stemmer) {
    this.language = language;
    this.stemmer = stemmer;
    this.vocabulary = require(languageFiles[language][0]);
    this.negations = [];
    if (languageFiles[language][1]) {
      this.negations = require(languageFiles[language][1]).words;
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
