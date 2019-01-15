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

var fs = require('fs');

var base_folder_test_data = 'spec/test_data/';
var brownCorpus = require('spec/test_data/browntag_nolines_excerpt_maxent.json');
var sampleFile = base_folder_test_data + 'sample.json';
var classifierFile = base_folder_test_data + 'classifier.json';

var natural = require('../lib/natural');
var Classifier = natural.MaxEntClassifier;
var FeatureSet = natural.FeatureSet;
var Context = natural.Context;

// Load some classes specific to part of speech tagging
var Corpus = natural.ME_Corpus;
var POS_Element = natural.POS_Element;
var Sentence = natural.ME_Sentence;
// Lexicon-based tagger is used for comparison
var Tagger = natural.BrillPOSTagger;

const JSON_FLAG = 2;
var nrIterations = 2;
var minImprovement = 0.01;
var trainCorpusSize = 50; // percentage

const DEBUG = false;

// Structure of the event space
// - Classes are possible tags
// - A context consists of a window of words and a window of tags

function applyClassifierToTestCorpus(testCorpus, tagger, classifier) {
  var totalWords = 0;
  var correctyTaggedLexicon = 0;
  var correctlyTaggedMaxEnt = 0;

  testCorpus.sentences.forEach(function(sentence){
    // Put the words of the sentence in an array
    var s = sentence.taggedWords.map(function(token) {
      return token.token;
    });

    // Use the lexicon to tag the sentence
    var taggedSentence = tagger.tagWithLexicon(s);
    // Count the right tags
    sentence.taggedWords.forEach(function(token, i) {
      totalWords++;
      if (token.tag === taggedSentence.taggedWords[i].tag) {
        correctyTaggedLexicon++;
      }
    });

    var sentenceLength = sentence.length;
    // Classify tags using maxent
    taggedSentence.taggedWords.forEach(function(taggedWord, index) {

      // Create context for classication
      var context = new Context({
          wordWindow: {},
          tagWindow: {}
      });
      // And fill it:

      // Current wordWindow
      context.data.wordWindow["0"] = taggedWord.token;
      // Previous bigram
      if (index > 1) {
        context.data.tagWindow["-2"] = taggedSentence.taggedWords[index - 2].tag;
      }
      // Left bigram
      if (index > 0) {
        context.data.tagWindow["-1"] = taggedSentence.taggedWords[index - 1].tag;
      }
      // Right bigram
      if (index < sentenceLength - 1) {
        context.data.tagWindow["1"] = taggedSentence.taggedWords[index + 1].tag;
      }
      // Next bigram
      if (index < sentenceLength - 2) {
        context.data.tagWindow["2"] = taggedSentence.taggedWords[index + 2].tag;
      }
      // Left bigram words
      if (index > 0) {
        context.data.wordWindow["-1"] = taggedSentence.taggedWords[index - 1].token;
      }
      // Right bigram words
      if (index < sentenceLength - 1) {
        context.data.wordWindow["1"] = taggedSentence.taggedWords[index + 1].token;
      }

      // Classify using maximum entropy model
      var tag = classifier.classify(context);

      if (tag === "") {
        tag = tagger.lexicon.tagWordWithDefaults(context.data.wordWindow["0"])
      }

      // Collect stats
      if (tag === sentence.taggedWords[index].tag) {
        // Correctly tagged
        correctlyTaggedMaxEnt++;
      }
      DEBUG && console.log("(word, classification, right tag): " + "(" + taggedWord.token +
        ", " + tag + ", " + sentence.taggedWords[index].tag + ")");
    });
  });

  DEBUG && console.log("Number of words tagged: " + totalWords);
  DEBUG && console.log("Percentage correctly tagged lexicon: " + correctyTaggedLexicon/totalWords * 100 + "%");
  DEBUG && console.log("Percentage correctly tagged maxent:  " + correctlyTaggedMaxEnt/totalWords * 100 + "%");
}

describe("Maximum Entropy Classifier applied to POS tagging", function() {
  // Prepare the train and test corpus
  DEBUG && console.log("Corpus after require: " + JSON.stringify(brownCorpus, null, 2));
  var corpus = new Corpus(brownCorpus, JSON_FLAG, Sentence);
  DEBUG && console.log("Size of corpus: " + corpus.sentences.length);
  DEBUG && console.log("Corpus: " + JSON.stringify(corpus, null, 2));
  var trainAndTestCorpus = corpus.splitInTrainAndTest(trainCorpusSize);
  var trainCorpus = trainAndTestCorpus[0];
  DEBUG && console.log("Size of training corpus: " + trainCorpus.sentences.length);
  DEBUG && console.log("Training corpus: " + JSON.stringify(trainCorpus, null, 2));
  var testCorpus = trainAndTestCorpus[1];
  DEBUG && console.log("Size of testing corpus: " + testCorpus.sentences.length);
  var sample = null;
  var classifier = null;
  var featureSet = null;
  var lexicon = null;
  var tagger = null;

  // Generate sample from trainCorpus
  it("generates a sample from a corpus", function() {
    sample = trainCorpus.generateSample();
    expect(sample.size()).toBeGreaterThan(0);
    DEBUG && console.log("Size of the sample: " + sample.size());
  });

  /*
  it("saves a sample to a file", function(done) {
    sample.save(sampleFile, function(err, sample) {
      if (err) {
        console.log(err);
        expect(false).toBe(true);
      }
      else {
        DEBUG && console.log("Sample saved to "  + sampleFile);
        expect(fs.existsSync(sampleFile)).toBe(true);
      }
      done();
    });
  });

  var newSample = null;
  it("loads a sample from a file", function(done) {
    sample.load(sampleFile, POS_Element, function(err, s) {
      if (err) {
        console.log(err);
        expect(false).toBe(true);
      }
      else {
        DEBUG && console.log("Sample loaded from "  + sampleFile);
        expect(s.size()).toEqual(sample.size());
        newSample = s;
      }
      done();
    });
    if (newSample) {
      expect(newSample.size()).toEqual(sample.size());
      sample = newSample;
    }
  });
  */

  it ("generates a set of features from the sample", function() {
    featureSet = new FeatureSet();
    DEBUG && console.log(sample);
    sample.generateFeatures(featureSet);
    expect(featureSet.size()).toBeGreaterThan(0);
    DEBUG && console.log("Number of features: " + featureSet.size());
    DEBUG && console.log(featureSet.prettyPrint());
  });

  it("analyses the sample", function() {
    trainCorpus.analyse();
    lexicon = trainCorpus.buildLexicon();
    expect(lexicon.size()).toBeGreaterThan(0);
  });

  it("trains the maximum entropy classifier", function() {
    classifier = new Classifier(featureSet, sample);
    DEBUG && console.log("Classifier created");
    classifier.train(nrIterations, minImprovement);
    DEBUG && console.log("Checksum: " + classifier.p.checkSum());
  });

  /*
  it ("saves the classifier to a file", function(done) {
    classifier.save(classifierFile, function(err, classifier) {
      if (err) {
        console.log(err);
        expect(false).toBe(true);
      }
      else {
        DEBUG && console.log("Classifier saved to "  + classifierFile);
        expect(fs.existsSync(classifierFile)).toBe(true);
      }
      done();
    });
  });

  var newClassifier = null;
  it("loads the classifier from a file", function(done) {
    classifier.load(classifierFile, POS_Element, function(err, c) {
      if (err) {
        console.log(err);
        expect(false).toBe(true);
      }
      else {
        //console.log("Sample loaded from "  + sampleFile);
        newClassifier = c;
      }
      done();
    });
    if (newClassifier) {
      expect(newClassifier.sample.size()).toEqual(classifier.sample.size());
      classifier = newClassifier;
    }
  });
  */

  it("compares maximum entropy based POS tagger to lexicon-based tagger", function() {
      // Test the classifier against the test corpus
      //lexicon.setDefaultCategories('NN', 'NP');
      tagger = new Tagger(lexicon);
      applyClassifierToTestCorpus(testCorpus, tagger, classifier);
  });
});
