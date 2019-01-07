/*
    Unit test for Brill's POS Tagger: test against the pos module
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

var natural = require('../lib/natural');

const base_folder_rules = './lib/natural/brill_pos_tagger/data';
const base_folder_test_data = '/home/hugo/Workspace/natural/spec/test_data';

const en_rules_file = base_folder_rules + '/English/tr_from_posjs.txt';
const en_lexicon_file = base_folder_rules + '/English/lexicon_from_posjs.json';

const en_ex_nyt_article = 'NYT-20150205-picassos-granddaughter-plans-to-sell-art-worrying-the-market.json';
const en_ex_nyt_article_expected_tag_results = 'NYT-20150205-picassos-granddaughter-plans_expected_tag_results.json';

const du_rules_file = base_folder_rules + '/Dutch/brill_CONTEXTRULES.jg';
const du_lexicon_file = base_folder_rules + '/Dutch/brill_LEXICON.jg';

const  du_ex_volkskrant_article = 'Volkskrant-20150205-Knot-geldpers-aanzetten-is-paardenmiddel-voor-half-procent-inflatie.json';


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
  it('should initialise correctly with tagging rules for English', function() {
    lexicon = new natural.Lexicon(en_lexicon_file, 'NN');
    ruleSet = new natural.RuleSet(en_rules_file);
    brill_pos_tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
  });

  var tokenizer = new natural.WordTokenizer();

  it('should process the article just like the dariusk/pos-js module', function() {
    var obj = require('NYT-20150205-picassos-granddaughter-plans-to-sell-art-worrying-the-market');
    var text = obj.text;
    var sentences = text.split('\n');
    var obj = require(en_ex_nyt_article_expected_tag_results);
    var posjs_results = obj.taggedSentences;
    sentences.forEach(function(sentence, index) {
      var tokenized_sentence = tokenizer.tokenize(sentence);
      var taggedSentence = brill_pos_tagger.tag(tokenized_sentence);
      expect(compareTaggedSentences(posjs_results[index], taggedSentence)).toBe(true);
    });
  });

  it('should initialise correctly with tagging rules for Dutch', function() {
    lexicon = new natural.Lexicon(du_lexicon_file, 'N');
    var ruleSet = new natural.RuleSet(du_rules_file);
    brill_pos_tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
  });

  it('should process the Volkskrant article', function() {
    var text = require(du_ex_volkskrant_article).text;
    var sentences = text.split('\n');
    sentences.forEach(function(sentence, index) {
      var tokenized_sentence = tokenizer.tokenize(sentence);
      var taggedSentence = brill_pos_tagger.tag(tokenized_sentence);
      expect(tokenized_sentence.length).toEqual(taggedSentence.taggedWords.length);
    });
  });

});
