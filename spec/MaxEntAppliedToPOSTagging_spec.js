/*
  Test of Classifier based on POS tagging
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

// const fs = require('fs')

// const base_folder_test_data = 'spec/test_data/'
const brownCorpus = require('spec/test_data/browntag_nolines_excerpt_maxent.json')
// const classifierFile = base_folder_test_data + 'classifier.json'

const natural = require('../lib/natural')
const Classifier = natural.MaxEntClassifier
const FeatureSet = natural.FeatureSet
const Context = natural.Context

// Load some classes specific to part of speech tagging
const Corpus = natural.MECorpus
// const POS_Element = natural.POSElement
const Sentence = natural.MESentence
// Lexicon-based tagger is used for comparison
const Tagger = natural.BrillPOSTagger

const JSON_FLAG = 2
const nrIterations = 2
const minImprovement = 0.01
const trainCorpusSize = 50 // percentage

const DEBUG = false

// Structure of the event space
// - Classes are possible tags
// - A context consists of a window of words and a window of tags

function applyClassifierToTestCorpus (testCorpus, tagger, classifier) {
  let totalWords = 0
  let correctyTaggedLexicon = 0
  let correctlyTaggedMaxEnt = 0

  testCorpus.sentences.forEach(function (sentence) {
    // Put the words of the sentence in an array
    const s = sentence.taggedWords.map(function (token) {
      return token.token
    })

    // Use the lexicon to tag the sentence
    const taggedSentence = tagger.tagWithLexicon(s)
    // Count the right tags
    sentence.taggedWords.forEach(function (token, i) {
      totalWords++
      if (token.tag === taggedSentence.taggedWords[i].tag) {
        correctyTaggedLexicon++
      }
    })

    const sentenceLength = sentence.length
    // Classify tags using maxent
    taggedSentence.taggedWords.forEach(function (taggedWord, index) {
      // Create context for classication
      const context = new Context({
        wordWindow: {},
        tagWindow: {}
      })
      // And fill it:

      // Current wordWindow
      context.data.wordWindow['0'] = taggedWord.token
      // Previous bigram
      if (index > 1) {
        context.data.tagWindow['-2'] = taggedSentence.taggedWords[index - 2].tag
      }
      // Left bigram
      if (index > 0) {
        context.data.tagWindow['-1'] = taggedSentence.taggedWords[index - 1].tag
      }
      // Right bigram
      if (index < sentenceLength - 1) {
        context.data.tagWindow['1'] = taggedSentence.taggedWords[index + 1].tag
      }
      // Next bigram
      if (index < sentenceLength - 2) {
        context.data.tagWindow['2'] = taggedSentence.taggedWords[index + 2].tag
      }
      // Left bigram words
      if (index > 0) {
        context.data.wordWindow['-1'] = taggedSentence.taggedWords[index - 1].token
      }
      // Right bigram words
      if (index < sentenceLength - 1) {
        context.data.wordWindow['1'] = taggedSentence.taggedWords[index + 1].token
      }

      // Classify using maximum entropy model
      let tag = classifier.classify(context)

      if (tag === '') {
        tag = tagger.lexicon.tagWordWithDefaults(context.data.wordWindow['0'])
      }

      // Collect stats
      if (tag === sentence.taggedWords[index].tag) {
        // Correctly tagged
        correctlyTaggedMaxEnt++
      }
      DEBUG && console.log('(word, classification, right tag): ' + '(' + taggedWord.token +
        ', ' + tag + ', ' + sentence.taggedWords[index].tag + ')')
    })
  })

  DEBUG && console.log('Number of words tagged: ' + totalWords)
  DEBUG && console.log('Percentage correctly tagged lexicon: ' + correctyTaggedLexicon / totalWords * 100 + '%')
  DEBUG && console.log('Percentage correctly tagged maxent:  ' + correctlyTaggedMaxEnt / totalWords * 100 + '%')
}

describe('Maximum Entropy Classifier applied to POS tagging', function () {
  // Prepare the train and test corpus
  DEBUG && console.log('Corpus after require: ' + JSON.stringify(brownCorpus, null, 2))
  const corpus = new Corpus(brownCorpus, JSON_FLAG, Sentence)
  DEBUG && console.log('Size of corpus: ' + corpus.sentences.length)
  DEBUG && console.log('Corpus: ' + JSON.stringify(corpus, null, 2))
  const trainAndTestCorpus = corpus.splitInTrainAndTest(trainCorpusSize)
  const trainCorpus = trainAndTestCorpus[0]
  DEBUG && console.log('Size of training corpus: ' + trainCorpus.sentences.length)
  DEBUG && console.log('Training corpus: ' + JSON.stringify(trainCorpus, null, 2))
  const testCorpus = trainAndTestCorpus[1]
  DEBUG && console.log('Size of testing corpus: ' + testCorpus.sentences.length)
  let sample = null
  let classifier = null
  let featureSet = null
  let lexicon = null
  let tagger = null

  // Generate sample from trainCorpus
  it('generates a sample from a corpus', function () {
    sample = trainCorpus.generateSample()
    expect(sample.size()).toBeGreaterThan(0)
    DEBUG && console.log('Size of the sample: ' + sample.size())
  })

  it('generates a set of features from the sample', function () {
    featureSet = new FeatureSet()
    DEBUG && console.log(sample)
    sample.generateFeatures(featureSet)
    expect(featureSet.size()).toBeGreaterThan(0)
    DEBUG && console.log('Number of features: ' + featureSet.size())
    DEBUG && console.log(featureSet.prettyPrint())
  })

  it('analyses the sample', function () {
    trainCorpus.analyse()
    lexicon = trainCorpus.buildLexicon()
    expect(lexicon.size()).toBeGreaterThan(0)
  })

  it('trains the maximum entropy classifier', function () {
    classifier = new Classifier(featureSet, sample)
    DEBUG && console.log('Classifier created')
    classifier.train(nrIterations, minImprovement)
    DEBUG && console.log('Checksum: ' + classifier.p.checkSum())
  })

  it('compares maximum entropy based POS tagger to lexicon-based tagger', function () {
    // Test the classifier against the test corpus
    // lexicon.setDefaultCategories('NN', 'NP');
    tagger = new Tagger(lexicon)
    applyClassifierToTestCorpus(testCorpus, tagger, classifier)
  })
})
