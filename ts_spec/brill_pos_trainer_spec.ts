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

'use strict'

import {
  Corpus,
  ruleTemplates,
  RuleTemplate,
  Sentence,
  BrillPOSTrainer,
  BrillPOSTagger,
  BrillPOSTester
} from 'lib/natural'

import type { Lexicon, RuleSet } from 'lib/natural'

// Import a JSON file with the brown corpus
import brownCorpus from '../spec/test_data/browntag_nolines_excerpt.json'

const DEBUG = false
const JSON_FLAG = 2

function selectRuleTemplates (templateNames: string[]): RuleTemplate[] {
  const templates: RuleTemplate[] = []
  templateNames.forEach(function (name: string) {
    if (ruleTemplates[name] !== undefined) {
      const template = new RuleTemplate(name, ruleTemplates[name])
      templates.push(template)
    }
  })
  return templates
}

describe('Brill\'s POS Trainer', function () {
  let corpus = null
  let corpora: Corpus[]
  const percentageTrain = 60
  let trainLexicon: Lexicon
  // Templates consider only tags, no words
  const templateNames = [
    'NEXT-TAG',
    'PREV-TAG',
    'PREV-1-OR-2-OR-3-TAG',
    'PREV-1-OR-2-TAG',
    'NEXT1OR2TAG',
    'NEXT1OR2OR3TAG',
    'SURROUNDTAG',
    'PREV2TAG',
    'NEXT2TAG'
  ]
  let templates: RuleTemplate[]
  let trainer = null
  let ruleSet: RuleSet

  it('should split the corpus in a training and testing corpus', function () {
    corpus = new Corpus(brownCorpus, JSON_FLAG, Sentence)
    DEBUG && console.log('Corpus: ' + JSON.stringify(corpus, null, 2))
    corpora = corpus.splitInTrainAndTest(percentageTrain)
    expect(corpora[0].nrSentences() + corpora[1].nrSentences()).toEqual(corpus.nrSentences())
  })

  it('should build a lexicon from the training corpus', function () {
    trainLexicon = corpora[0].buildLexicon()
    // Set default category to noun (NN)
    // and default category for capitalised words to proper noun (NP)
    trainLexicon.setDefaultCategories('NN', 'NP')
    expect(trainLexicon.nrEntries()).not.toEqual(0)
  })

  it('should set up the rule templates', function () {
    templates = selectRuleTemplates(templateNames)
    expect(templates.length).toEqual(templateNames.length)
  })

  it('should train on the training corpus to derive transformation rules', function () {
    trainer = new BrillPOSTrainer(1)
    ruleSet = trainer.train(corpora[0], templates, trainLexicon)
    expect(ruleSet.nrRules()).toBeGreaterThan(0)
    expect(trainer.printRulesWithScores()).not.toEqual('')
  })

  it('should test the derived transformation rules on the test corpus', function () {
    const tagger = new BrillPOSTagger(trainLexicon, ruleSet)
    const tester = new BrillPOSTester()
    const scores = tester.test(corpora[1], tagger)
    expect(scores[1]).toBeGreaterThan(0)
  })
})
