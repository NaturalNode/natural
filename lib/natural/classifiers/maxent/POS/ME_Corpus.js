/*
Corpus class specific for MaxEnt modeling
Copyright (C) 2018 Hugo W.L. ter Doest

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

'use strict'

const Sample = require('../Sample')
const Corpus = require('../../../brill_pos_tagger/lib/Corpus')

class MECorpus extends Corpus {
  generateSample () {
    const sample = new Sample([])
    this.sentences.forEach(function (sentence) {
      sentence.generateSampleElements(sample)
    })
    return sample
  }

  // Splits the corpus in a training and testing set.
  // percentageTrain is the size of the training corpus in percent
  // Returns an array with two elements: training corpus, testing corpus
  splitInTrainAndTest (percentageTrain) {
    const corpusTrain = new MECorpus()
    const corpusTest = new MECorpus()

    const p = percentageTrain / 100
    this.sentences.forEach(function (sentence, i) {
      if (Math.random() < p) {
        corpusTrain.sentences.push(sentence)
      } else {
        corpusTest.sentences.push(sentence)
      }
    })
    return [corpusTrain, corpusTest]
  }
}

module.exports = MECorpus
