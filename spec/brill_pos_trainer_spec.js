/*
  Unit test for Brill's POS Trainer
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

var natural = require('../lib/natural');
var fs = require('fs');

var base_folder_test_data = './spec/test_data/';
var brownCorpusFile = base_folder_test_data + 'browntag_nolines_excerpt.txt';

function splitInTrainAndTest(data, percentageTrain) {
  var corpusTrain = [];
  var corpusTest = [];

  var originalCorpus = data.split('\n');
  // Remove empty elements
  originalCorpus = originalCorpus.filter(function(elt) {
    return elt != ""
  });

  // Split the corpus
  var p = percentageTrain / 100;
  originalCorpus.forEach(function(line, i) {
    if (line !== "") {
      if (Math.random() < p) {
        corpusTrain.push(line);
      }
      else {
        corpusTest.push(line);
      }
    }
    else {
      originalCorpus.splice(i, 1)
    }
  });

  return [originalCorpus, corpusTrain, corpusTest];
}

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
  var data = null;
  var corpusTexts = null;
  var trainCorpus = null;
  var testCorpus = null;
  var nrLinesInTrainCorpus = null;
  var nrLinesInTestCorpus = null;
  var trainLexicon = null;
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

  it('should read a file with corpus', function() {
    data = fs.readFileSync(brownCorpusFile, 'utf8');
    expect(data).not.toBe("");
  });

  it('should split the corpus in a training and testing corpus', function() {
    corpusTexts = splitInTrainAndTest(data, 50);
    nrLinesInTrainCorpus = corpusTexts[1].length;
    nrLinesInTestCorpus = corpusTexts[2].length;
    expect(nrLinesInTrainCorpus + nrLinesInTestCorpus).toEqual(corpusTexts[0].length);
  });

  it('should process the corpora', function () {
    trainCorpus = new natural.Corpus(corpusTexts[1], 1);
    testCorpus = new natural.Corpus(corpusTexts[2], 1);
    expect(trainCorpus.nrSentences()).toEqual(nrLinesInTrainCorpus);
    expect(testCorpus.nrSentences()).toEqual(nrLinesInTestCorpus);
  });

  it('should build a lexicon from the training corpus', function() {
    trainLexicon = trainCorpus.buildLexicon();
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
    trainer = new natural.BrillPOSTrainer();
    ruleSet = trainer.train(trainCorpus, templates, trainLexicon);
  });

  it('should test the derived transformation rules on the test corpus', function() {
    var tagger = new natural.BrillPOSTagger(trainLexicon, ruleSet);
    var tester = new natural.BrillPOSTester();
    var percentageRight = tester.test(testCorpus, tagger);
    expect(Math.abs(percentageRight[0] - percentageRight[1])).toBeLessThan(2);
  });

});
