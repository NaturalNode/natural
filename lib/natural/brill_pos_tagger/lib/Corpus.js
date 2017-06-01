/*
  Corpus class
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

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.setLevel('INFO');

var Lexicon = require('./Lexicon');
var Token = require('./Token');
const BROWN = 1;

// sentences: an array of annotated sentences
// A sentence is an array of annotated tokens
// A token is an object with (token, tag, testTag, ruleList)
function Corpus(data, typeOfCorpus) {
  this.sentences = [];
  this.tagFrequencies = {};
  this.posTags = {};
  if (data && typeOfCorpus) {
    switch (typeOfCorpus) {
      case BROWN:
        this.processBrownCorpus(data);
        break;
      default:
        // Assume it is an array of tagged sentences
        this.sentences = data;
    }
  }
}

Corpus.prototype.processBrownCorpus = function(data) {
  var lines = data.split('\n');
  var that = this;
  lines.forEach(function(line) {
    var trimmedLine = line.trim();
    // Only parse lines that contain characters
    if (trimmedLine != "") {
      var taggedSentence = [];
      var tokens = line.trim().split(/\s+/);
      tokens.forEach(function (token) {
        // Create a tagged sentences consisting of tokens
        var wordPlusTag = token.split('_');
        var newToken = new Token(wordPlusTag[0], wordPlusTag[1], "", []);
        taggedSentence.push(newToken);

        // Register the tags used in the corpus
        that.posTags[wordPlusTag[1]] = true;

        // Register the frequency of the tag
        if (!that.tagFrequencies[wordPlusTag[0]]) {
          that.tagFrequencies[wordPlusTag[0]] = {};
        }
        if (!that.tagFrequencies[wordPlusTag[0]][wordPlusTag[1]]) {
          that.tagFrequencies[wordPlusTag[0]][wordPlusTag[1]] = 0;
        }
        that.tagFrequencies[wordPlusTag[0]][wordPlusTag[1]]++;
      });

      // Add the sentence to the corpus
      that.sentences.push(taggedSentence);
    }
  });
};

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
  // Copy the (reference to) the set of tags used in the original corpus
  corpusTrain.posTags = this.posTags;
  corpusTest.posTags = this.posTags;
  return [corpusTrain, corpusTest];
};

// Creates a lexicon by taking the most frequently occurring tag of a word
// as the right tag
Corpus.prototype.buildLexicon = function() {
  var lexicon = new Lexicon();
  var that = this;
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

Corpus.prototype.prettyPrint = function() {
  this.sentences.forEach(function(sentence, index) {
    logger.debug("sentence no " + index + "\n" +
      JSON.stringify(sentence, null, 2));
  });
};

module.exports = Corpus;
