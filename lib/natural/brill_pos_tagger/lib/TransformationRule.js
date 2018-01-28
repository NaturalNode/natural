/*
  Transformation rules for the Brill tagger
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

var Predicate = require("./Predicate");
var Sentence = require('./Sentence');

//logger.setLevel('INFO');

var category_wild_card = "*";

function TransformationRule(c1, c2, predicate, parameter1, parameter2) {
  this.literal = [c1, c2, predicate, parameter1, parameter2];
  this.predicate = new Predicate(predicate, parameter1, parameter2);
  this.old_category = c1;
  this.new_category = c2;
  // These members are for the learning algorithm
  this.neutral = 0;
  this.negative = 0;
  this.positive = 0;
  this.hasBeenSelectedAsHighRuleBefore = false;
  //logger.debug('TransformationRule constructor: ' + this.literal);
}

TransformationRule.prototype.key = function() {
  return(this.literal.toString());
};

TransformationRule.prototype.apply = function(sentence, position) {
  if ((sentence.taggedWords[position].tag === this.old_category) ||
      (this.old_category === category_wild_card)) {
    if (this.predicate.evaluate(sentence, position)) {
      sentence.taggedWords[position].tag = this.new_category;
      //logger.debug('TransformationRule.apply: changed category ' +
        //this.old_category + ' to ' + this.new_category +
        //' at position ' + position);
    }
  }
};

//
// Methods for processing sentences from a corpus that consist of an array of tokens
//

// Returns true if the rule applies at site. As a side effect it assigns the new
// category to newTag
TransformationRule.prototype.isApplicableAt = function(sentence, taggedSentence, i) {
  //logger.debug("TransformationRule.prototype.isApplicableAt: " + taggedSentence);
  var applies = (taggedSentence.taggedWords[i].tag === this.old_category) &&
    this.predicate.evaluate(taggedSentence, i);
  //logger.debug("TransformationRule.prototype.isApplicableAt: " + applies);

  // Set newTag to let the trainer know what the new tag would become
  if (applies) {
    sentence.taggedWords[i].newTag = this.new_category;
  }
  return(applies);
};

TransformationRule.prototype.prettyPrint = function() {
  var result = "";
  // Old category and new category
  result += this.old_category + " " + this.new_category;
  // Predicate name
  result += " " + this.predicate.name;
  // Parameter 1 and 2
  if (this.predicate.parameter1) {
    result += " " + this.predicate.parameter1;
    if (this.predicate.parameter2) {
      result += " " + this.predicate.parameter2;
    }
  }
  return result;
};


// Applies the rule the given location (if it applies)
TransformationRule.prototype.applyAt = function(sentence, i) {
  var taggedSentence = sentence.clone();

  //logger.debug("TransformationRule.prototype.applyAt: input sentence length: " + sentence.length);
  //logger.debug("TransformationRule.prototype.applyAt: tagged sentence length: " + taggedSentence.length);

  this.apply(sentence, i);
  // Assign the new tag to the corpus site
  sentence.taggedWords[i].testTag = taggedSentence.taggedWords[i].tag;
};

// Calculate the net score of this rule
TransformationRule.prototype.score = function() {
  return (this.positive - this.negative);
};

module.exports = TransformationRule;
