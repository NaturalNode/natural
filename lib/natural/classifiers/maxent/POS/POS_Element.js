/*
Element class for POS tagging
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

const Element = require('../Element')
const Feature = require('../Feature')

class POSElement extends Element {
  generateFeatures (featureSet) {
    const context = this.b.data
    const tag = this.a
    const token = context.wordWindow['0']

    // Feature for the current word
    function currentWord (x) {
      if ((x.b.data.wordWindow['0'] === token) &&
          (x.a === tag)) {
        return 1
      }
      return 0
    }
    featureSet.addFeature(new Feature(currentWord, 'wordFeature', ['0', token, '0', tag]))

    // Feature for previous bigram (previous two tags), positions -2, -1
    if (context.tagWindow['-2']) {
      const prevPrevTag = context.tagWindow['-2']
      const prevTag = context.tagWindow['-1']
      function prevBigram (x) {
        if ((x.a === tag) &&
            (x.b.data.tagWindow['-2'] === prevPrevTag) &&
            (x.b.data.tagWindow['-1'] === prevTag)) {
          return 1
        }
        return 0
      }
      featureSet.addFeature(new Feature(prevBigram, 'prevBigram', ['0', tag, '-2', prevPrevTag, '-1', prevTag]))
    }

    /*
    // Feature for left bigram, positions -1, 0
    if (context.tagWindow["-1"]) {
      var prevTag = context.tagWindow["-1"];
      function leftBigram(x) {
        if ((x.b.data.tagWindow["-1"] === prevTag) &&
            (x.a === tag)) {
            return 1;
          }
        return 0;
      }
      featureSet.addFeature(new Feature(leftBigram, "leftBigram", ["0", tag, "-1", prevTag]));
    }
  */

    /*

    // Feature for right bigram, positions 0, 1
    if (context.tagWindow["1"]) {
      var nextTag = context.tagWindow["1"];
      function rightBigram(x) {
        if ((x.a === tag) &&
            (x.b.data.tagWindow["1"] === nextTag)) {
            return 1;
          }
        return 0;
      }
      featureSet.addFeature(new Feature(rightBigram, "rightBigram", ["0", tag, "1", nextTag]));
    }
  */
    /*
    // Feature for next bigram (next two tags), positions 1 and 2
    if (context.tagWindow["2"]) {
      var nextTag = context.tagWindow["1"];
      var nextNextTag = context.tagWindow["2"];
      function nextBigram(x) {
        if ((x.a === tag) &&
            (x.b.data.tagWindow["1"] === nextTag) &&
            (x.b.data.tagWindow["2"] === nextNextTag)) {
            return 1;
          }
        return 0;
      }
      featureSet.addFeature(new Feature(nextBigram, "nextBigram", ["0", tag, "1", nextTag, "2", nextNextTag]));
    }

    // Feature that looks at the left bigram words
    if (context.wordWindow["-1"]) {
      var prevWord = context.wordWindow["-1"];
      function leftBigramWords(x) {
        if ((x.a === tag) &&
            (x.b.data.wordWindow["0"] === token) &&
            (x.b.data.wordWindow["-1"] === prevWord)) {
            return 1;
          }
        return 0;
      }
      featureSet.addFeature(new Feature(leftBigramWords, "leftBigramWords", ["0", tag, "0", token, "-1", prevWord]));
    }

    // Feature that looks at the right bigram words
    if (context.wordWindow["1"]) {
      var nextWord = context.wordWindow["1"];
      function rightBigramWords(x) {
        if ((x.a === tag) &&
            (x.b.data.wordWindow["0"] === token) &&
            (x.b.data.wordWindow["1"] === nextWord)) {
            return 1;
          }
        return 0;
      }
      featureSet.addFeature(new Feature(rightBigramWords, "rightBigramWords", ["0", tag, "0", token, "1", nextWord]));
    }
  */

    // Feature that looks at the previous word and its category
    if (context.wordWindow['-1']) {
      const prevWord = context.wordWindow['-1']
      const prevTag = context.tagWindow['-1']
      function prevWordAndCat (x) {
        if ((x.a === tag) &&
            (x.b.data.wordWindow['-1'] === prevWord) &&
            (x.b.data.tagWindow['-1'] === prevTag)) {
          return 1
        }
        return 0
      }
      featureSet.addFeature(new Feature(prevWordAndCat, 'prevWordAndCat', ['0', tag, '-1', prevWord, '-1', prevTag]))
    }

  /*
    // Feature that looks at the next word and its category
    if (context.wordWindow["1"]) {
      var nextWord = context.wordWindow["1"];
      var nextTag = context.tagWindow["1"];
      function nextWordAndCat(x) {
        if ((x.a === tag) &&
            (x.b.data.wordWindow["1"] === nextWord) &&
            (x.b.data.tagWindow["1"] === nextTag)) {
            return 1;
          }
        return 0;
      }
      featureSet.addFeature(new Feature(nextWordAndCat, "nextWordAndCat", ["0", tag, "1", nextWord, "1", nextTag]));
    }
  */
  }
}

module.exports = POSElement
