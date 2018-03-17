


var OrthographyTokenizer = require('../lib/natural/tokenizers/regexp_tokenizer').OrthographyTokenizer;
console.log(OrthographyTokenizer);

var sentencesInFinnish = [
  ["Mikä sinun nimesi on?", [ 'Mikä', 'sinun', 'nimesi', 'on' ]],
  ["Hyvää kiitos, entä sinulle?", [ 'Hyvää', 'kiitos', 'entä', 'sinulle' ]],
  ["Tämä herrasmies maksaa kaiken", [ 'Tämä', 'herrasmies', 'maksaa', 'kaiken' ]]
];

describe("The orthography tokenizer tokenizes sentences in Finnish", function() {
  var tokenizer = new OrthographyTokenizer({language: "fi"});
  console.log(tokenizer);
  sentencesInFinnish.forEach(function(sentencePlusResult) {
    it("It should correctly tokenize the following sentence: " + sentencePlusResult[0], function() {
      //console.log(tokenizer.tokenize(sentencePlusResult[0]));
      expect(tokenizer.tokenize(sentencePlusResult[0])).toEqual(sentencePlusResult[1]);
    });
  });
});
