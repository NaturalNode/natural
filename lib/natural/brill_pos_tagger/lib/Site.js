/*
  Site class
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

// Site has two pointers to the location in the corpus: sentence and token index
// Furthermore a site has a list of rules that are applicable at this site.
function Site(i, j) {
  this.sentence = i;
  this.index = j;
  this.rules = {};
}

Site.prototype.addRule = function(rule) {
  this.rules[rule.key()] = rule;
};

Site.prototype.removeRule = function(rule) {
  delete this.rules[rule.key()];
};

// The key is used to maintain a collection of unique sites with a map
Site.prototype.key = function() {
  return("[" + this.sentence + ", " + this.index + "]");
};

// Returns a list of sites that may have been touched by a changing tag
Site.prototype.neighbourhood = function(corpus) {
  var sentenceLength = corpus.sentences[this.sentence].length;
  var list = [];

  if (this.index > 2) {
    list.push(new Site(this.sentence, this.index - 3));
  }
  if (this.index > 1) {
    list.push(new Site(this.sentence, this.index - 2));
  }
  if (this.index > 0) {
    list.push(new Site(this.sentence, this.index - 1));
  }
  if (this.index < sentenceLength - 1) {
    list.push(new Site(this.sentence, this.index + 1));
  }
  if (this.index < sentenceLength - 2) {
    list.push(new Site(this.sentence, this.index + 2));
  }
  if (this.index > sentenceLength - 3) {
    list.push(new Site(this.sentence, this.index + 3));
  }
  return list;
}

module.exports = Site;
