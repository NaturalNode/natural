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

'use strict'

const Predicate = require('./Predicate')

const categoryWildCard = '*'

class TransformationRule {
  constructor (c1, c2, predicate, parameter1, parameter2) {
    this.literal = [c1, c2, predicate, parameter1, parameter2]
    this.predicate = new Predicate(predicate, parameter1, parameter2)
    this.oldCategory = c1
    this.newCategory = c2
    // These members are for the learning algorithm
    this.neutral = 0
    this.negative = 0
    this.positive = 0
    this.hasBeenSelectedAsHighRuleBefore = false
  }

  key () {
    return (this.literal.toString())
  }

  apply (sentence, position) {
    if ((sentence.taggedWords[position].tag === this.oldCategory) ||
        (this.oldCategory === categoryWildCard)) {
      if (this.predicate.evaluate(sentence, position)) {
        sentence.taggedWords[position].tag = this.newCategory
      }
    }
  }

  //
  // Methods for processing sentences from a corpus that consist of an array of tokens
  //

  // Returns true if the rule applies at site. As a side effect it assigns the new
  // category to newTag
  isApplicableAt (sentence, taggedSentence, i) {
    const applies = (taggedSentence.taggedWords[i].tag === this.oldCategory) &&
      this.predicate.evaluate(taggedSentence, i)

    // Set newTag to let the trainer know what the new tag would become
    if (applies) {
      sentence.taggedWords[i].newTag = this.newCategory
    }
    return (applies)
  }

  prettyPrint () {
    let result = ''
    // Old category and new category
    result += this.oldCategory + ' ' + this.newCategory
    // Predicate name
    result += ' ' + this.predicate.name
    // Parameter 1 and 2
    if (this.predicate.parameter1) {
      result += ' ' + this.predicate.parameter1
      if (this.predicate.parameter2) {
        result += ' ' + this.predicate.parameter2
      }
    }
    return result
  }

  // Applies the rule the given location (if it applies)
  applyAt (sentence, i) {
    const taggedSentence = sentence.clone()

    this.apply(sentence, i)
    // Assign the new tag to the corpus site
    sentence.taggedWords[i].testTag = taggedSentence.taggedWords[i].tag
  }

  // Calculate the net score of this rule
  score () {
    return (this.positive - this.negative)
  }
}

module.exports = TransformationRule
