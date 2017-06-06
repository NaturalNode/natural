/*
  Corpus class for parsing and analysing corpora
  Copyright (C) 2017 Hugo W.L. ter Doest

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//var log4js = require('log4js');
//var logger = log4js.getLogger();
//logger.setLevel('INFO');

var Lexicon = require('./Lexicon');
const BROWN = 1;

// sentences: an array of annotated sentences
// A sentence is an array of annotated tokens
// A token is an object with (token, tag, testTag, ruleList)
function Corpus(data, typeOfCorpus) {
  this.wordCount = 0;
  this.sentences = [];
  if (data && typeOfCorpus) {
    // For other types of corpora add a case here and supply a parsing method
    switch (typeOfCorpus) {
      case BROWN:
        this.parseBrownCorpus(data);
        break;
      default:
        // Assume it is an array of tagged sentences
        this.sentences = data;
    }
  }
}

// data is raw text
// A corpus parsing method should split the corpus in sentences each of which
// consist of an array of tokens.
Corpus.prototype.parseBrownCorpus = function(data) {
  var that = this;

  var lines = data.split('\n');
  lines.forEach(function(line) {
    var trimmedLine = line.trim();
    // Only parse lines that contain characters
    if (trimmedLine != "") {
      var taggedSentence = [];
      var tokens = line.trim().split(/\s+/);
      tokens.forEach(function (token) {
        that.wordCount++;
        // Create a tagged sentences consisting of tokens
        var wordPlusTag = token.split('_');
        taggedSentence.push({
          "token": wordPlusTag[0],
          "tag": wordPlusTag[1]
        });
      });

      // Add the sentence to the corpus
      that.sentences.push(taggedSentence);
    }
  });
};

// Returns an array of all POS tags used in the corpus
Corpus.prototype.getTags = function() {
  return Object.keys(this.posTags);
};

// Splits the corpus in a training and testing set.
// percentageTrain is the size of the training corpus in percent
// Returns an array with two elements: training corpus, testing corpus
Corpus.prototype.splitInTrainAndTest = function(percentageTrain) {
  var corpusTrain = new Corpus();
  var corpusTest = new Corpus();

  var p = percentageTrain / 100;
  this.sentences.forEach(function(sentence, i) {
    if (Math.random() < p) {
      corpusTrain.sentences.push(sentence);
    }
    else {
      corpusTest.sentences.push(sentence);
    }
  });
  return [corpusTrain, corpusTest];
};

// Analyses the corpus:
// - registers used PS tags
// - records the frequency of POS tag for each word
Corpus.prototype.analyse = function() {
  this.tagFrequencies = {};
  this.posTags = {};
  this.wordCount = 0;

  var that = this;
  this.sentences.forEach(function(sentence) {
    sentence.forEach(function(token) {
      that.wordCount++;

      // Register the tags used in the corpus
      that.posTags[token.tag] = true;

      // Register the frequency of the tag
      if (!that.tagFrequencies[token.token]) {
        that.tagFrequencies[token.token] = {};
      }
      if (!that.tagFrequencies[token.token][token.tag]) {
        that.tagFrequencies[token.token][token.tag] = 0;
      }
      that.tagFrequencies[token.token][token.tag]++;
    });
  });
};

// Creates a lexicon by taking the most frequently occurring tag of a word
// as the right tag
Corpus.prototype.buildLexicon = function() {
  var lexicon = new Lexicon();
  var that = this;

  this.analyse();
  Object.keys(this.tagFrequencies).forEach(function(token) {
    var catToFreq = that.tagFrequencies[token];
    var categories = Object.keys(catToFreq);

    function compareByFrequency(a, b) {
      if (catToFreq[a] > catToFreq[b]) {
        return -1;
      }
      else {
        if (catToFreq[a] < catToFreq[b]) {
          return 1;
        }
        else {
          return 0;
        }
      }
    }

    var sortedCategories = categories.sort(compareByFrequency);
    lexicon.addWord(token, sortedCategories);
  });
  return lexicon;
};

Corpus.prototype.tag = function(lexicon) {
  this.sentences.forEach(function(sentence) {
    sentence.forEach(function(token) {
      // tagWord returns a list of categories, take the first category
      token.testTag = lexicon.tagWord(token.token)[0];
    });
  });
};

Corpus.prototype.nrSentences = function() {
  return this.sentences.length;
};

Corpus.prototype.nrWords = function() {
  return this.wordCount;
};

Corpus.prototype.prettyPrint = function() {
  this.sentences.forEach(function(sentence, index) {
    //logger.debug("sentence no " + index + "\n" +
    //  JSON.stringify(sentence, null, 2));
  });
};

module.exports = Corpus;
