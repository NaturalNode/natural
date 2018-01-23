/*
  Simple POS Tagger based on a lexicon
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

//var TF_Parser = require('./TF_Parser');

function POS_Tagger(lexicon) {
  this.lexicon = lexicon;
}

// Tags a sentence, sentence is an array of words
// Returns an array of tagged words; a tagged words is an array consisting of
// the word itself followed by its lexical category
POS_Tagger.prototype.tag = function(sentence) {
  var taggedSentence = this.tagWithLexicon(sentence);
  return this.applyRules(taggedSentence);
};

POS_Tagger.prototype.tagWithLexicon = function(sentence) {
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

module.exports = POS_Tagger;
