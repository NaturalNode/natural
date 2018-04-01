/*
  Copyright (c) 2018, Hugo W.L. ter Doest

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

var stemmer = require('../lib/natural/stemmers/porter_stemmer');
var Analyzer = require("../lib/natural/sentiment/SentimentAnalyzer");
var analyzer = new Analyzer("Dutch", stemmer, "pattern");
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

var testConfigurations = [
  {
    "language": "Basque",
    "stemmer": "",
    "vocabularyType": "senticon",
    "testSentences": [{"sentence": "Korrika egitea ez du batere gogoko", "score": 0},
                      {"sentence": "Nire pasaportea galdu nuen", "score": 0},
                      {"sentence": "Lasterketa aise irabazi zuen", "score": 0},
                      {"sentence": "Seguru nago hori gezurra dela", "score": 0},
                      {"sentence": "Tom-i ez zaio galtzea gustatzen", "score": 0},
                      {"sentence": "mahai bat pertsona batentzako/bi personentzako, mesedez", "score": 0},
                      {"sentence": "Uda zoragarri bat igaro nahi duzu Donostian, Euskal Herriko hiririk ederrenetako batean? Euskal Herriko Unibertsitatea liderra da euskal unibertsitate sisteman, eta aukera ematen dizu \"Basque Culture II. International Summer School\" ikastaro erakargarrian parte hartzeko 2017ko uztailaren 3tik 14ra. Ikastaroa mundu osoan izen handia duten profesionalek emango dute, eta akademikoki aukera paregabea da euskal gizartea gertutik ezagutzeko eta aldi berean hemengo hizkuntza eta ohiturak ikasteko.", "score": 0}
                     ]
  }/*,
  {
    "language": "Catalan",
    "stemmer": "",
    "vocabularyType": "",
    "testSentences": []
  },
  {
    "language": "Dutch",
    "stemmer": "",
    "vocabularyType": "",
    "testSentences": []
  },
  {
    "language": "English",
    "stemmer": "",
    "vocabularyType": "",
    "testSentences": []
  },
  {
    "language": "French",
    "stemmer": "",
    "vocabularyType": "",
    "testSentences": []
  },
  {
    "language": "Galician",
    "stemmer": "",
    "vocabularyType": "",
    "testSentences": []
  },
  {
    "language": "Italian",
    "stemmer": "",
    "vocabularyType": "",
    "testSentences": []
  },
  {
    "language": "Spanish",
    "stemmer": "",
    "vocabularyType": "",
    "testSentences": []
  }*/

];

describe("The sentiment analyzer analyzes the sentiment of sentences in multiple languages using different types of vocabularies", function() {
  testConfigurations.forEach(config => {
    it("Should analyze a set of sentences with each configuration " + config, function() {
      var stemmer = null;
      // Create the stemmer
      if (config.stemmer != "") {
        stemmer = require(config.stemmer);
      }
      // Create analyzer
      var analyzer = new Analyzer(config.language, stemmer, config.vocabularyType);
      config.testSentences.forEach(sentencePlusScore => {
        var words = sentencePlusScore.sentence.split(/\s+/);
        var score = analyzer.getSentiment(words);
        console.log(score);
        expect(score).toEqual(sentencePlusScore.score);
      });
    });
  });
});
