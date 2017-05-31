/*
  Brill's POS Tagger
  Copyright (C) 2016 Hugo W.L. ter Doest

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

var fs = require("fs");

var TF_Parser = require('./TF_Parser');

function Brill_POS_Tagger(lexicon, ruleSet) {
  this.lexicon = lexicon;
  this.ruleSet = ruleSet;
}

// Tags a sentence, sentence is an array of words
// Returns an array of tagged words; a tagged words is an array consisting of
// the word itself followed by its lexical category
Brill_POS_Tagger.prototype.tag = function(sentence) {
  var taggedSentence = this.tagWithLexicon(sentence);
  return this.applyRules(taggedSentence);
};

Brill_POS_Tagger.prototype.tagWithLexicon = function(sentence) {
  var taggedSentence = new Array(sentence.length);

  var that = this;
  sentence.forEach(function(word, index) {
    taggedSentence[index] = [];
    taggedSentence[index][0] = word;
    var categories = that.lexicon.tagWord(word);
    taggedSentence[index][1] = categories[0];
  });
  return(taggedSentence);
};

// Applies the transformation rules to an initially tagged sentence.
// taggedSentence is an array of tagged words.
// A tagged word is an array consisting of the word itself followed by its lexical category.
// Returns an array of tagged words as well
Brill_POS_Tagger.prototype.applyRules = function(taggedSentence) {
  // Apply transformation rules
  for (var i = 0, size = taggedSentence.length; i < size; i++) {
    this.ruleSet.getRules().forEach(function(rule) {
      rule.apply(taggedSentence, i);
    });
  }
  return(taggedSentence);
};

module.exports = Brill_POS_Tagger;
