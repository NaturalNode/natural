/*
  Corpus class for parsing and analysing corpora
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

const Lexicon = require('./Lexicon')

const BROWN = 1
const JSON = 2

// sentences: an array of annotated sentences
// A sentence is an array of annotated tokens
// A token is an object with (token, tag, testTag, ruleList)
class Corpus {
  constructor (data, typeOfCorpus, SentenceClass) {
    this.wordCount = 0
    this.sentences = []
    const that = this
    if (data) {
      // For other types of corpora add a case here and supply a parsing method
      switch (typeOfCorpus) {
        case BROWN:
          this.parseBrownCorpus(data, SentenceClass)
          break
        case JSON:
          // Assume it is a JSON object of a corpus
          data.sentences.forEach(function (s) {
            const taggedSentence = new SentenceClass(s.taggedWords)
            that.sentences.push(taggedSentence)
            that.wordCount += s.taggedWords.length
          })
          break
      }
    }
  }

  // data is raw text
  // A corpus parsing method should split the corpus in sentences each of which
  // consist of an array of tokens.
  parseBrownCorpus (data, SentenceClass) {
    const that = this

    const lines = data.split('\n')
    lines.forEach(function (line) {
      const trimmedLine = line.trim()
      // Only parse lines that contain characters
      if (trimmedLine !== '') {
        const taggedSentence = new SentenceClass()
        const tokens = line.trim().split(/\s+/)
        tokens.forEach(function (token) {
          that.wordCount++
          // Create a tagged sentences consisting of tokens
          const wordPlusTag = token.split('_')
          taggedSentence.addTaggedWord(wordPlusTag[0], wordPlusTag[1])
        })

        // Add the sentence to the corpus
        that.sentences.push(taggedSentence)
      }
    })
  }

  // Returns an array of all POS tags used in the corpus
  getTags () {
    return Object.keys(this.posTags)
  }

  // Splits the corpus in a training and testing set.
  // percentageTrain is the size of the training corpus in percent
  // Returns an array with two elements: training corpus, testing corpus
  splitInTrainAndTest (percentageTrain) {
    const corpusTrain = new Corpus()
    const corpusTest = new Corpus()

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

  // Analyses the corpus:
  // - registers used POS tags
  // - records the frequency of POS tag for each word
  analyse () {
    this.tagFrequencies = {}
    this.posTags = {}
    this.wordCount = 0

    const that = this
    this.sentences.forEach(function (sentence) {
      sentence.taggedWords.forEach(function (token) {
        that.wordCount++

        // Register the tags used in the corpus
        that.posTags[token.tag] = true

        // Register the frequency of the tag
        if (!that.tagFrequencies[token.token]) {
          that.tagFrequencies[token.token] = {}
        }
        if (!that.tagFrequencies[token.token][token.tag]) {
          that.tagFrequencies[token.token][token.tag] = 0
        }
        that.tagFrequencies[token.token][token.tag]++
      })
    })
  }

  // Creates a lexicon by taking the most frequently occurring tag of a word
  // as the right tag
  buildLexicon () {
    const lexicon = new Lexicon()
    const that = this

    this.analyse()
    Object.keys(this.tagFrequencies).forEach(function (token) {
      const catToFreq = that.tagFrequencies[token]
      const categories = Object.keys(catToFreq)

      function compareByFrequency (a, b) {
        if (catToFreq[a] > catToFreq[b]) {
          return -1
        } else {
          if (catToFreq[a] < catToFreq[b]) {
            return 1
          } else {
            return 0
          }
        }
      }

      const sortedCategories = categories.sort(compareByFrequency)
      lexicon.addWord(token, sortedCategories)
    })
    return lexicon
  }

  tag (lexicon) {
    this.sentences.forEach(function (sentence) {
      sentence.taggedWords.forEach(function (token) {
        // tagWord returns a list of categories, take the first category
        token.testTag = lexicon.tagWord(token.token)[0]
      })
    })
  }

  nrSentences () {
    return this.sentences.length
  }

  nrWords () {
    return this.wordCount
  }

  generateFeatures () {
    let features = []
    this.sentences.forEach(function (sentence) {
      features = sentence.generateFeatures(features)
    })
    // console.log(JSON.stringify(features));
    return features
  }

  prettyPrint () {
    this.sentences.forEach(function (sentence, index) {
      // logger.debug("sentence no " + index + "\n" +
      //  JSON.stringify(sentence, null, 2));
    })
  }
}

module.exports = Corpus
