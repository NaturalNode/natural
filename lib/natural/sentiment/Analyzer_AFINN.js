

var baseFolder = "./";

var languageFiles = {
  "English": ["voca", "negations"],
  "Spanish": [baseFolder + "sentimenter_AFINN", baseFolder + "negations.json"]
};

class SentimentAnalyzer {
  constructor(language, stemmer) {
    this.language = language;
    this.senticonList = require(languageFiles[language][0]);
    this.negations = require(languageFiles[language][1]).literals;
    if (stemmer) {
      for(var token in this.senticonList){
            this.senticonStem[stemmer.stem(token)] = this.senticonList[token].pol;
      }
    }
  }

  getSentiment(words) {
    var score = 0;
    var negator = 1;

    words.forEach((token) => {
      if(this.senticonStem[stemmer.stem(token)] != undefined){
          score += negator * this.senticonStem[stemmer.stem(token)];
          if (this.negations.indexOf(token) > -1) {
            negator = -1;
          }
      }
    });

    score = score / words.length;

    return score;
  }

}

module.exports = SentimentAnalyzer;
