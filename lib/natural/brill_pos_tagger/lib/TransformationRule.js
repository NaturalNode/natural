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

var log4js = require('log4js');
var logger = log4js.getLogger();

var Predicate = require("./Predicate");

logger.setLevel('DEBUG');

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
  this.sites = {};
  logger.debug('TransformationRule constructor: ' + this.literal);
}

TransformationRule.prototype.key = function() {
  return(this.literal.toString());
};

TransformationRule.prototype.apply = function(tagged_sentence, position) {
  if ((tagged_sentence[position][1] === this.old_category) ||
      (this.old_category === category_wild_card)) {
    if (this.predicate.evaluate(tagged_sentence, position)) {
      tagged_sentence[position][1] = this.new_category;
      logger.debug('TransformationRule.apply: changed category ' + 
                   this.old_category + ' to ' + this.new_category +
                   ' at position ' + position);
    }
  }
};

TransformationRule.prototype.newCategory = function(tagged_sentence, position) {
  if ((tagged_sentence[position][1] === this.old_category) ||
    (this.old_category === category_wild_card)) {
    if (this.predicate.evaluate(tagged_sentence, position)) {
      return(this.new_category);
    }
  }
};

//
// Functions for processing corpus locations
//
TransformationRule.prototype.isApplicableAt = function(corpus, site) {
  var taggedSentence = [];
  corpus.sentences[site.sentence].forEach(function(token) {
    taggedSentence.push([token.token, token.tag]);
  });
  return(this.predicate.evaluate(taggedSentence, site.index));
};

TransformationRule.prototype.applyAt = function(corpus, site) {
  var taggedSentence = [];
  corpus.sentences[site.sentence].forEach(function(token) {
    taggedSentence.push([token.token, token.tag]);
  });
  this.apply(taggedSentence, site.index);
  // Assign the new tag to the corpus site
  corpus.sentences[site.sentence][site.index].testTag = taggedSentence[site.index][1];
};

// Register a site with this rule
TransformationRule.prototype.addSite = function(site) {
  this.sites[site.key()] = site;
};

// Removes site from the registered sites
TransformationRule.prototype.removeSite = function(site) {
  if (this.sites[site.key()]) {
    delete this.sites[site.key()];
  }
};

// Calculate the net score of this rule
TransformationRule.prototype.score = function() {
  return (this.positive - this.negative);
};

module.exports = TransformationRule;
