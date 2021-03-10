/*
Copyright (c) 2020, Johan Maupetit, Hugo W.L. ter Doest

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

// Integration with natural
const Stemmer = require('../stemmer_fr')
const CarryStemmer = new Stemmer()

const stepConfs = require('./stepConfs')
const { pipe } = require('./utils')

const defaultConf = {
  steps: stepConfs,
  vowels: /[aeiouäâàéèëêïîöôùüûœ]/i
}

// count number of vowel-consonant groups
const getWordSize = (word) => {
  let isPrevVowel = false
  let nbVCgroups = 0

  for (let i = 0; i < word.length; i += 1) {
    const letter = word[i]
    const isVowel = defaultConf.vowels.test(letter)

    if (!isVowel && isPrevVowel) {
      nbVCgroups += 1
    }

    isPrevVowel = isVowel
  }

  return nbVCgroups
}

const tranform = (word, stepConf) => {
  let newWord = null

  for (
    let suffixLength = word.length - 1;
    suffixLength > 0 && !newWord;
    suffixLength -= 1
  ) {
    const suffix = word.substr(-suffixLength)
    const baseWord = word.substr(0, word.length - suffixLength)

    for (
      let minRadixSize = 0;
      minRadixSize <= 1 && !newWord;
      minRadixSize += 1
    ) {
      const transformations = stepConf[minRadixSize] || {}
      const newSuffix = transformations[suffix]

      if (newSuffix === undefined) {
        continue
      }

      const candidate = `${baseWord}${newSuffix}`

      if (getWordSize(candidate) > minRadixSize) {
        newWord = candidate
        break
      }
    }
  }

  return newWord || word
}

function NodeCarry (userConf = defaultConf) {
  const conf = {
    ...defaultConf,
    ...userConf
  }

  this.steps = [0, 1, 2]
    .map((iStep) => (word) => tranform(word, conf.steps[iStep]))

  this.stem = pipe(...this.steps)
};

// Create a Carry stemmer
const nodeCarry = new NodeCarry()
// Attach the Carry stemmer to natural's generic stemmer
CarryStemmer.stem = nodeCarry.stem
module.exports = CarryStemmer
