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

var sentences = [
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
