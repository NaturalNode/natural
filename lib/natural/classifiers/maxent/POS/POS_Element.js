/*
  Element class for POS tagging
  Copyright (C) 2018 Hugo W.L. ter Doest

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


var util = require('util');
var Element = require('../Element');
var Feature = require('../Feature');

function POS_Element(a, b) {
   POS_Element.super_.call(this, a, b);
}

util.inherits(POS_Element, Element);

POS_Element.prototype.generateFeatures = function(featureSet) {
  var context = this.b.data;
  var tag = this.a;
  var token = context.wordWindow["0"];


  // Feature for the current word
  function currentWord(x) {
    if ((x.b.data.wordWindow["0"] === token) &&
        (x.a === tag)) {
        return 1;
    }
    return 0;
  }
  featureSet.addFeature(new Feature(currentWord, "wordFeature", ["0", token, "0", tag]));


  // Feature for previous bigram (previous two tags), positions -2, -1
  if (context.tagWindow["-2"]) {
    var prevPrevTag = context.tagWindow["-2"];
    var prevTag = context.tagWindow["-1"];
    function prevBigram(x) {
      if ((x.a === tag) &&
          (x.b.data.tagWindow["-2"] === prevPrevTag) &&
          (x.b.data.tagWindow["-1"] === prevTag)) {
          return 1;
        }
      return 0;
    }
    featureSet.addFeature(new Feature(prevBigram, "prevBigram", ["0", tag, "-2", prevPrevTag, "-1", prevTag]));
  }


/*
  // Feature for left bigram, positions -1, 0
  if (context.tagWindow["-1"]) {
    var prevTag = context.tagWindow["-1"];
    function leftBigram(x) {
      if ((x.b.data.tagWindow["-1"] === prevTag) &&
          (x.a === tag)) {
          return 1;
        }
      return 0;
    }
    featureSet.addFeature(new Feature(leftBigram, "leftBigram", ["0", tag, "-1", prevTag]));
  }
*/

/*

  // Feature for right bigram, positions 0, 1
  if (context.tagWindow["1"]) {
    var nextTag = context.tagWindow["1"];
    function rightBigram(x) {
      if ((x.a === tag) &&
          (x.b.data.tagWindow["1"] === nextTag)) {
          return 1;
        }
      return 0;
    }
    featureSet.addFeature(new Feature(rightBigram, "rightBigram", ["0", tag, "1", nextTag]));
  }
*/
/*
  // Feature for next bigram (next two tags), positions 1 and 2
  if (context.tagWindow["2"]) {
    var nextTag = context.tagWindow["1"];
    var nextNextTag = context.tagWindow["2"];
    function nextBigram(x) {
      if ((x.a === tag) &&
          (x.b.data.tagWindow["1"] === nextTag) &&
          (x.b.data.tagWindow["2"] === nextNextTag)) {
          return 1;
        }
      return 0;
    }
    featureSet.addFeature(new Feature(nextBigram, "nextBigram", ["0", tag, "1", nextTag, "2", nextNextTag]));
  }

  // Feature that looks at the left bigram words
  if (context.wordWindow["-1"]) {
    var prevWord = context.wordWindow["-1"];
    function leftBigramWords(x) {
      if ((x.a === tag) &&
          (x.b.data.wordWindow["0"] === token) &&
          (x.b.data.wordWindow["-1"] === prevWord)) {
          return 1;
        }
      return 0;
    }
    featureSet.addFeature(new Feature(leftBigramWords, "leftBigramWords", ["0", tag, "0", token, "-1", prevWord]));
  }

  // Feature that looks at the right bigram words
  if (context.wordWindow["1"]) {
    var nextWord = context.wordWindow["1"];
    function rightBigramWords(x) {
      if ((x.a === tag) &&
          (x.b.data.wordWindow["0"] === token) &&
          (x.b.data.wordWindow["1"] === nextWord)) {
          return 1;
        }
      return 0;
    }
    featureSet.addFeature(new Feature(rightBigramWords, "rightBigramWords", ["0", tag, "0", token, "1", nextWord]));
  }
*/

  // Feature that looks at the previous word and its category
  if (context.wordWindow["-1"]) {
    var prevWord = context.wordWindow["-1"];
    var prevTag = context.tagWindow["-1"];
    function prevWordAndCat(x) {
      if ((x.a === tag) &&
          (x.b.data.wordWindow["-1"] === prevWord) &&
          (x.b.data.tagWindow["-1"] === prevTag)) {
          return 1;
        }
      return 0;
    }
    featureSet.addFeature(new Feature(prevWordAndCat, "prevWordAndCat", ["0", tag, "-1", prevWord, "-1", prevTag]));
  }


/*
  // Feature that looks at the next word and its category
  if (context.wordWindow["1"]) {
    var nextWord = context.wordWindow["1"];
    var nextTag = context.tagWindow["1"];
    function nextWordAndCat(x) {
      if ((x.a === tag) &&
          (x.b.data.wordWindow["1"] === nextWord) &&
          (x.b.data.tagWindow["1"] === nextTag)) {
          return 1;
        }
      return 0;
    }
    featureSet.addFeature(new Feature(nextWordAndCat, "nextWordAndCat", ["0", tag, "1", nextWord, "1", nextTag]));
  }
*/
};

module.exports = POS_Element;
