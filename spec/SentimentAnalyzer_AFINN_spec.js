
var Analyzer = require("../lib/natural/sentiment/Analyzer_AFINN");
var analyzer = new Analyzer("English");
var sentences = [
  "I like cherries",
  "I don't like cherries",
  "It seems that pollution is making things worse",
  "How are you doing?",
  "I feel a lot better today"
];

describe("The sentiment analyzer analyzes the sentiment in sententes", function() {
  it("should analyze a sentence correctly", function() {
    sententes.forEach(function(s) {
      var words = s.split(/\s+/);
      console.log("Sentiment of \"" + s + "\": " + analyzer.getSentiment(words));
    });
  });
});
