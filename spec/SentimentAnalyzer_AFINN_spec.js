
var stemmer = require('../lib/natural/stemmers/porter_stemmer');
var Analyzer = require("../lib/natural/sentiment/Analyzer_AFINN");
var analyzer = new Analyzer("English", stemmer);
var sentences = [
  "I like cherries",
  "I like cherries very much",
  "I do not like cherries",
  "I hate cherries",
  "It seems that pollution is making things worse",
  "How are you doing?",
  "I am fine",
  "I feel a lot better today",
  "I feel great",
  ""
];

describe("The sentiment analyzer analyzes the sentiment in sententes", function() {
  it("should analyze a sentence correctly", function() {
    sentences.forEach(function(s) {
      var words = s.split(/\s+/);
      console.log("Sentiment of \"" + s + "\": " + analyzer.getSentiment(words));
    });
  });
});
