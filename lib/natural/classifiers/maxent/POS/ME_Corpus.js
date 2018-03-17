/*
  Corpus class specific for MaxEnt modeling
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

var util = require('util');
var Sample = require('../Sample');
var Corpus = require('../../../brill_pos_tagger/lib/Corpus');

function ME_Corpus(data, BROWN, SentenceClass) {
   ME_Corpus.super_.call(this, data, BROWN, SentenceClass);
}

util.inherits(ME_Corpus, Corpus);

ME_Corpus.prototype.generateSample = function() {
  var sample = new Sample([]);
  this.sentences.forEach(function(sentence) {
    sentence.generateSampleElements(sample);
  });
  return sample;
};

// Splits the corpus in a training and testing set.
// percentageTrain is the size of the training corpus in percent
// Returns an array with two elements: training corpus, testing corpus
ME_Corpus.prototype.splitInTrainAndTest = function(percentageTrain) {
  var corpusTrain = new ME_Corpus();
  var corpusTest = new ME_Corpus();

  var p = percentageTrain / 100;
  this.sentences.forEach(function(sentence, i) {
    if (Math.random() < p) {
      corpusTrain.sentences.push(sentence);
    }
    else {
      corpusTest.sentences.push(sentence);
    }
  });
  return [corpusTrain, corpusTest];
};

module.exports = ME_Corpus;
