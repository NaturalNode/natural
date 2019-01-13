/*
  Unit test for Brill's POS Trainer
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
var Corpus = require('../lib/natural/brill_pos_tagger/lib/Corpus');
var SentenceClass = natural.Sentence;

const DEBUG = false;
const BROWN = 1;
const JSON_FLAG = 2;

var brownCorpus = require('spec/test_data/browntag_nolines_excerpt.json');

function selectRuleTemplates(templateNames) {
  var templates = [];
  templateNames.forEach(function(name) {
    if (natural.RuleTemplates[name]) {
      template = new natural.RuleTemplate(name, natural.RuleTemplates[name]);
      templates.push(template);
    }
  });
  return templates;
}

describe('Brill\'s POS Trainer', function() {
  var corpus = null;
  var corpora = null;
  var percentageTrain = 60;
  var trainLexicon = null;
  // Templates consider only tags, no words
  var templateNames = [
    "NEXT-TAG",
    "PREV-TAG",
    "PREV-1-OR-2-OR-3-TAG",
    "PREV-1-OR-2-TAG",
    "NEXT1OR2TAG",
    "NEXT1OR2OR3TAG",
    "SURROUNDTAG",
    "PREV2TAG",
    "NEXT2TAG"
  ];
  var templates = null;
  var trainer = null;
  var ruleSet = null;

  it('should split the corpus in a training and testing corpus', function() {
    corpus = new Corpus(brownCorpus, JSON_FLAG, SentenceClass);
    DEBUG && console.log("Corpus: " + JSON.stringify(corpus, null, 2))
    corpora = corpus.splitInTrainAndTest(percentageTrain);
    expect(corpora[0].nrSentences() + corpora[1].nrSentences()).toEqual(corpus.nrSentences());
  });

  it('should build a lexicon from the training corpus', function() {
    trainLexicon = corpora[0].buildLexicon();
    // Set default category to noun (NN)
    // and default category for capitalised words to proper noun (NP)
    trainLexicon .setDefaultCategories("NN", "NP");
    expect(trainLexicon.nrEntries()).not.toEqual(0);
  });

  it('should set up the rule templates', function() {
    templates = selectRuleTemplates(templateNames);
    expect(templates.length).toEqual(templateNames.length);
  });

  it('should train on the training corpus to derive transformation rules', function() {
    trainer = new natural.BrillPOSTrainer(1);
    ruleSet = trainer.train(corpora[0], templates, trainLexicon);
    expect(ruleSet.nrRules()).toBeGreaterThan(0);
  });

  it('should test the derived transformation rules on the test corpus', function() {
    var tagger = new natural.BrillPOSTagger(trainLexicon, ruleSet);
    var tester = new natural.BrillPOSTester();
    var scores = tester.test(corpora[1], tagger);
    expect(scores[1]).toBeGreaterThan(0);
  });

});
