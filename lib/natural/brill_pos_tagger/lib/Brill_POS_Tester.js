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

function Brill_POS_Tester() {

}

Brill_POS_Tester.prototype.test = function(corpus, tagger) {
  var totalWords = 0;
  var correctTagsLexicon = 0;
  var correctTagsAfterRules = 0;

  // Tag the corpus using the tagger
  corpus.sentences.forEach(function(sentence) {
    var s = sentence.map(function(token) {
      return token.token;
    });

    // Use the lexicon to tag the sentence
    var taggedSentence = tagger.tagWithLexicon(s);
    // Count the right tags
    sentence.forEach(function(token, i) {
      totalWords++;
      if (token.tag === taggedSentence[i][1]) {
        correctTagsLexicon++;
      }
    });

    // Use the rule set to tag the sentence
    var taggedSentenceAfterRules = tagger.applyRules(taggedSentence);
    // Count the right tags
    sentence.forEach(function(token, i) {
      if (token.tag === taggedSentenceAfterRules[i][1]) {
        correctTagsAfterRules++;
      }
    });
  });

  // Return percentage right
  return [100 * correctTagsLexicon/ totalWords, 100 * correctTagsAfterRules / totalWords];
};

module.exports = Brill_POS_Tester;
