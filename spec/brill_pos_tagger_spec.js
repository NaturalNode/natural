/*
    Unit test for Brill's POS Tagger: test against the pos module
    Copyright (C) 2015 Hugo W.L. ter Doest

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
var fs = require('fs');

var base_folder_rules = 'lib/natural/brill_pos_tagger/data';
var base_folder_test_data = 'spec/test_data';

var en_rules_file = base_folder_rules + '/English/tr_from_posjs.json';
var en_lexicon_file = base_folder_rules + '/English/lexicon_from_posjs.json';

var en_ex_nyt_article = base_folder_test_data + '/NYT-20150205-picassos-granddaughter-plans-to-sell-art-worrying-the-market.json';
var en_ex_nyt_article_expected_tag_results = base_folder_test_data + '/NYT-20150205-picassos-granddaughter-plans_expected_tag_results.json';

var du_rules_file = base_folder_rules + '/Dutch/brill_CONTEXTRULES.json';
var du_lexicon_file = base_folder_rules + '/Dutch/brill_LEXICON.json';

var du_ex_volkskrant_article = base_folder_test_data + '/Volkskrant-20150205-Knot-geldpers-aanzetten-is-paardenmiddel-voor-half-procent-inflatie.json';

// Compares two tagged sentences. First one is in the old POSJS format, i.e.
// an array of two position arrays. The second one is a Sentence object
// that holds an array of objects for each position {token: "string", tag: "string"}
function compareTaggedSentences(sentenceInOldFormat, sentenceInNewFormat) {
  var equal = true;
  sentenceInOldFormat.forEach(function(wordPlusTag, index) {
    equal = equal &&
      (wordPlusTag[1] === sentenceInNewFormat.taggedWords[index].tag);
  });
  return equal;
}

describe('Brill\'s POS Tagger', function() {
  var brill_pos_tagger = null;
  var lexicon = null;
  var ruleSet = null;
  var sentences = null;
  it('should initialise correctly with tagging rules for English', function() {
    lexicon = new natural.Lexicon(en_lexicon_file, 'NN');
    ruleSet = new natural.RuleSet(en_rules_file);
    brill_pos_tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
  });

  it('should correctly read a NYT article about Picasso', function() {
    sentences = require(en_ex_nyt_article).sentences;
  });

  var posjs_results;
  it('should correctly read tag results of pos-js for the NYT article', function() {
    posjs_results = require(en_ex_nyt_article_expected_tag_results).results;
  });

  var tokenizer = new natural.WordTokenizer();

  it('should process the article just like the dariusk/pos-js module', function() {
    sentences.forEach(function(sentence, index) {
      var tokenized_sentence = tokenizer.tokenize(sentence);
      var sentence = brill_pos_tagger.tag(tokenized_sentence);
      expect(compareTaggedSentences(posjs_results[index], sentence)).toBe(true);
    });
  });

  it('should initialise correctly with tagging rules for Dutch', function() {
    lexicon = new natural.Lexicon(du_lexicon_file, 'N');
    var ruleSet = new natural.RuleSet(du_rules_file);
    brill_pos_tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
  });

  it('should correctly read a Volkskrant article about the ECB', function() {
    sentences = require(du_ex_volkskrant_article).sentences;
  });

  it('should process the Volkskrant article', function() {
    sentences.forEach(function(sentence, index) {
      var tokenized_sentence = tokenizer.tokenize(sentence);
      var sentence = brill_pos_tagger.tag(tokenized_sentence);
      expect(tokenized_sentence.length).toEqual(sentence.taggedWords.length);
    });
  });

});
