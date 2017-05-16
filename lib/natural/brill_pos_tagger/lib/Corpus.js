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

var Token = require('./Token');
const BROWN = 1;

// sentences: an array of annotated sentences
// A sentence is an array of annotated tokens
// A token is an object with (token, tag, testTag, ruleList)
function Corpus(data, typeOfCorpus) {
  switch (typeOfCorpus) {
    case BROWN:
      this.processBrownCorpus(data);
      break;
    default:
      // Assume it is an array of tagged sentences
      this.sentences = data;
  }
}

Corpus.prototype.processBrownCorpus = function(data) {
  this.sentences = [];
  var lines = data.split('\n');
  var that = this;
  lines.forEach(function(line) {
    var taggedSentence = [];
    var tokens = line.trim().split(/\s+/);
    tokens.forEach(function(token) {
      var wordPlusTag = token.split('_');
      var newToken = new Token(wordPlusTag[0], wordPlusTag[1], "", []);
      taggedSentence.push(newToken);
    });
    that.sentences.push(taggedSentence);
  });
};

module.exports = Corpus;
