/*
  Brill's POS Tagger
  Copyright (C) 2019 Hugo W.L. ter Doest

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

const Sentence = require('./Sentence')

const DEBUG = false

function BrillPOSTagger (lexicon, ruleSet) {
  this.lexicon = lexicon
  this.ruleSet = ruleSet
}

// Tags a sentence, sentence is an array of words
// Returns an array of tagged words; a tagged words is an array consisting of
// the word itself followed by its lexical category
BrillPOSTagger.prototype.tag = function (sentence) {
  const taggedSentence = this.tagWithLexicon(sentence)
  DEBUG && console.log(taggedSentence)
  return this.applyRules(taggedSentence)
}

BrillPOSTagger.prototype.tagWithLexicon = function (sentence) {
  const taggedSentence = new Sentence()

  const that = this
  sentence.forEach(function (word, index) {
    const categories = that.lexicon.tagWord(word)
    taggedSentence.addTaggedWord(word, categories[0])
  })
  return (taggedSentence)
}

// Applies the transformation rules to an initially tagged sentence.
// taggedSentence is an array of tagged words.
// A tagged word is an array consisting of the word itself followed by its lexical category.
// Returns an array of tagged words as well
BrillPOSTagger.prototype.applyRules = function (sentence) {
  for (let i = 0, size = sentence.taggedWords.length; i < size; i++) {
    this.ruleSet.getRules().forEach(function (rule) {
      rule.apply(sentence, i)
    })
  }
  return sentence
}

module.exports = BrillPOSTagger
