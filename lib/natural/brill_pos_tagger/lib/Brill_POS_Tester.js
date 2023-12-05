/*
  Brill's POS Testing class
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

class BrillPOSTester {
  test (corpus, tagger) {
    let totalWords = 0
    let correctTagsLexicon = 0
    let correctTagsAfterRules = 0

    // Tag the corpus using the tagger
    corpus.sentences.forEach(function (sentence) {
      const s = sentence.taggedWords.map(function (token) {
        return token.token
      })

      // Use the lexicon to tag the sentence
      const taggedSentence = tagger.tagWithLexicon(s)
      // Count the right tags
      sentence.taggedWords.forEach(function (token, i) {
        totalWords++
        if (token.tag === taggedSentence.taggedWords[i].tag) {
          correctTagsLexicon++
        }
      })

      // Use the rule set to tag the sentence
      const taggedSentenceAfterRules = tagger.applyRules(taggedSentence)
      // Count the right tags
      sentence.taggedWords.forEach(function (token, i) {
        if (token.tag === taggedSentenceAfterRules.taggedWords[i].tag) {
          correctTagsAfterRules++
        }
      })
    })

    // Return percentage right
    return [100 * correctTagsLexicon / totalWords, 100 * correctTagsAfterRules / totalWords]
  }
}

module.exports = BrillPOSTester
