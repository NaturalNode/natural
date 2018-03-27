

var baseFolder = "/c/Workspace/natural/lib/natural/sentiment/";
var languageFiles = {
  "English": ["afinn-165", baseFolder + "English/negations"],
  "Spanish": [baseFolder + "sentimenter_AFINN", baseFolder + "negations.json"]
};

class SentimentAnalyzer {
  constructor(language, stemmer) {
    this.language = language;
    this.vocabulary = require(languageFiles[language][0]);
    this.negations = [];
    if (languageFiles[language][1]) {
      this.negations = require(languageFiles[language][1]).words;
    }
    if (stemmer) {
      for(var token in this.vocabulary) {
            this.vocaStemmed[stemmer.stem(token)] = this.vocabulary[token];
      }
      this.vocabulary = this.vocaStemmed;
    }
  }

  // words is an array of words (strings)
  getSentiment(words) {
    var score = 0;
    var negator = 1;

    words.forEach((token) => {
      var lowerCased = token.toLowerCase();
      if(this.vocabulary[stemmer.stem(lowerCased)] != undefined){
        if (this.negations.indexOf(lowerCased) > -1) {
          negator = -1;
        }
        score += negator * this.vocaStemmed[stemmer.stem(lowerCased)];
      }
    });

    score = score / words.length;

    return score;
  }

}

module.exports = SentimentAnalyzer;
