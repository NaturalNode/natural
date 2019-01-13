/*
    Unit test for Brill's POS Tagger: test against the pos module
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

var natural = require('../lib/natural');

var englishSentences = require('spec/test_data/NYT-20150205-picassos-granddaughter-plans-to-sell-art-worrying-the-market.json').sentences;
var englishTagResults = require('spec/test_data/NYT-20150205-picassos-granddaughter-plans_expected_tag_results.json').results;

var dutchSentences = require('spec/test_data/Volkskrant-20150205-Knot-geldpers-aanzetten-is-paardenmiddel-voor-half-procent-inflatie.json').sentences;

var DEBUG = false;


// Compares two tagged sentences. First one is in the old POSJS format, i.e.
// an array of two position arrays. The second one is a Sentence object
// that holds an array of objects for each position {token: "string", tag: "string"}
function compareTaggedSentences(sentenceInOldFormat, sentenceInNewFormat) {
  var equal = true;
  sentenceInOldFormat.forEach(function(wordPlusTag, index) {
    equal = equal &&
      (wordPlusTag[1] === sentenceInNewFormat.taggedWords[index].tag);
    DEBUG && console.log(wordPlusTag[1] + ' ' + sentenceInNewFormat.taggedWords[index].tag);
  });
  return equal;
}

describe('Brill\'s POS Tagger', function() {
  var brill_pos_tagger = null;
  var lexicon = null;
  var ruleSet = null;
  var tokenizer = new natural.WordTokenizer();

  it('should process an English newspaper article just like the dariusk/pos-js module', function() {
    lexicon = new natural.Lexicon('EN', 'NN');
    expect(lexicon.nrEntries()).toBeGreaterThan(0);
    ruleSet = new natural.RuleSet('EN');
    expect(ruleSet.nrRules()).toBeGreaterThan(0);
    brill_pos_tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

    englishSentences.forEach(function(sentence, index) {
      var tokenized_sentence = tokenizer.tokenize(sentence);
      var taggedSentence = brill_pos_tagger.tag(tokenized_sentence);
      expect(compareTaggedSentences(englishTagResults[index], taggedSentence)).toBe(true);
    });
  });

  it('should tag a Dutch news paper article', function() {
    lexicon = new natural.Lexicon('DU', 'N');
    expect(lexicon.nrEntries()).toBeGreaterThan(0);
    var ruleSet = new natural.RuleSet('DU');
    expect(ruleSet.nrRules()).toBeGreaterThan(0);
    brill_pos_tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

    dutchSentences.forEach(function(sentence, index) {
      var tokenized_sentence = tokenizer.tokenize(sentence);
      var taggedSentence = brill_pos_tagger.tag(tokenized_sentence);
      expect(tokenized_sentence.length).toEqual(taggedSentence.taggedWords.length);
    });
  });

});
