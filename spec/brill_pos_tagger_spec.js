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

var base_folder_rules = './lib/natural/brill_pos_tagger/data';
var base_folder_test_data = 'spec/test_data';

var en_rules_file = base_folder_rules + '/English/tr_from_posjs.txt';
var en_lexicon_file = base_folder_rules + '/English/lexicon_from_posjs.json';

var en_ex_nyt_article = base_folder_test_data + '/NYT-20150205-picassos-granddaughter-plans-to-sell-art-worrying-the-market.txt';
var en_ex_nyt_article_expected_tag_results = base_folder_test_data + '/NYT-20150205-picassos-granddaughter-plans_expected_tag_results.txt';

var du_rules_file = base_folder_rules + '/Dutch/brill_CONTEXTRULES.jg';
var du_lexicon_file = base_folder_rules + '/Dutch/brill_LEXICON.jg';

var du_ex_volkskrant_article = base_folder_test_data + '/Volkskrant-20150205-Knot-geldpers-aanzetten-is-paardenmiddel-voor-half-procent-inflatie.txt';


describe('Brill\'s POS Tagger', function() {
  var brill_pos_tagger;
  it('should initialise correctly with tagging rules for English', function(done) {
    brill_pos_tagger = new natural.BrillPOSTagger(en_lexicon_file, en_rules_file, 'NN', function(error) {
      done();
    });
  });

  var sentences;
  it('should correctly read a NYT article about Picasso', function(done) {
    fs.readFile(en_ex_nyt_article, 'utf8', function (error, text) {
      sentences = text.split('\n');
      done();
    });
  });
  
  var posjs_results;
  it('should correctly read tag results of pos-js for the NYT article', function(done) {
    fs.readFile(en_ex_nyt_article_expected_tag_results, 'utf8', function (error, text) {
      posjs_results = JSON.parse(text);
      done();
    });
  });
  
  var tokenizer = new natural.WordTokenizer();

  it('should process the article just like the dariusk/pos-js module', function() {
    sentences.forEach(function(sentence, index) {
      var tokenized_sentence = tokenizer.tokenize(sentence);
      var taggedWords = brill_pos_tagger.tag(tokenized_sentence);
      expect(taggedWords).toEqual(posjs_results[index]);
    });
  });
  
  it('should initialise correctly with tagging rules for Dutch', function(done) {
    brill_pos_tagger = new natural.BrillPOSTagger(du_lexicon_file, du_rules_file, 'N', function(error) {
      done();
    });
  });
  
  it('should correctly read a Volkskrant article about the ECB', function(done) {
    fs.readFile(du_ex_volkskrant_article, 'utf8', function (error, text) {
      sentences = text.split('\n');
      done();
    });
  });
  
  it('should process the Volkskrant article', function() {
    sentences.forEach(function(sentence, index) {
      var tokenized_sentence = tokenizer.tokenize(sentence);
      var taggedWords = brill_pos_tagger.tag(tokenized_sentence);
      expect(tokenized_sentence.length).toEqual(taggedWords.length);
    });
  });
  
});
