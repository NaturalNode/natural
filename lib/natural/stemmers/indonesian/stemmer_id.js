/*
Copyright (c) 2017, Alif Bhaskoro, Andy Librian, R. Kukuh (Reimplemented from https://github.com/sastrawi/sastrawi)

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

const BaseStemmer = require('./base_stemmer_id')
const stemmer = new BaseStemmer()

// Dictionary
const dictionary = loadDictionary()

// Rules
const SuffixRules = require('./suffix_rules')
const PrefixRules = require('./prefix_rules')

const suffixRules = SuffixRules.rules
const prefixRules = PrefixRules.rules

// Removals
let removals = null

// Words
let originalWord = null
let currentWord = null

module.exports = stemmer

// perform full stemming algorithm on a single word
stemmer.stem = function (token) {
  // Cache stemmer not yet implemented
  // Set to lowercase
  token = token.toLowerCase()

  // Initiate everything
  removals = []

  if (isPlural(token)) {
    return stemPluralWord(token)
  } else {
    return stemSingularWord(token)
  }
}

// Stem for plural word
function stemPluralWord (pluralWord) {
  let matches = pluralWord.match(/^(.*)-(.*)$/)
  if (!matches) {
    return pluralWord
  }
  const words = [matches[1], matches[2]]

  // malaikat-malaikat-nya -> malaikat malaikat-nya
  const suffix = words[1]
  const suffixes = ['ku', 'mu', 'nya', 'lah', 'kah', 'tah', 'pun']
  matches = words[0].match(/^(.*)-(.*)$/)
  if (suffixes.indexOf(suffix) !== -1 && matches) {
    words[0] = matches[1]
    words[1] = matches[2] + '-' + suffix
  }

  // berbalas-balasan -> balas
  const rootWord1 = stemSingularWord(words[0])
  let rootWord2 = stemSingularWord(words[1])

  // meniru-nirukan -> tiru
  if (!find(words[1]) && rootWord2 === words[1]) {
    rootWord2 = stemSingularWord('me' + words[1])
  }
  if (rootWord1 === rootWord2) {
    return rootWord1
  } else {
    return pluralWord
  }
}

// Stem for singular word
function stemSingularWord (word) {
  originalWord = word // Save the original word for reverting later
  currentWord = word

  // Step 1
  if (currentWord.length > 3) {
    // Step 2-5
    stemmingProcess()
  }

  // Step 6
  if (find(currentWord)) {
    return currentWord
  } else {
    return originalWord
  }
}

// Return true if word is in plural form ex: gelas-gelas, else false
function isPlural (token) {
  const matches = token.match(/^(.*)-(ku|mu|nya|lah|kah|tah|pun)$/)
  if (matches) {
    return matches[1].search('-') !== -1
  }
  return token.search('-') !== -1
}

// Find certain word in dictionary
function find (word) {
  return dictionary.has(word)
}

function loadDictionary () {
  const fin = require('./data/kata-dasar.json')
  return new Set(fin.filter(Boolean))
}

// Stemming from step 2-5
function stemmingProcess () {
  if (find(currentWord)) { return }

  // Confix Stripping
  // Try to remove prefixes first before suffixes if the specification is met
  if (precedenceAdjustmentSpecification(originalWord)) {
    // Step 4, 5
    removePrefixes()
    if (find(currentWord)) { return }

    // Step 2, 3
    removeSuffixes()
    if (find(currentWord)) {
      return
    } else {
      // if the trial is failed, restore the original word
      // and continue to normal rule precedence (suffix first, prefix afterwards)
      currentWord = originalWord
      removals = []
    }
  }

  // Step 2, 3
  removeSuffixes()
  if (find(currentWord)) { return }

  // Step 4, 5
  removePrefixes()
  if (find(currentWord)) { return }

  // ECS Loop Restore Prefixes
  loopRestorePrefixes()
}

// Remove Suffixes
function removeSuffixes () {
  for (const i in suffixRules) {
    const resultObj = suffixRules[i](currentWord)

    // Add result to variable
    if (resultObj.removal !== undefined) {
      removals.push(resultObj.removal)
    }
    currentWord = resultObj.currentWord

    if (find(currentWord)) { return currentWord }
  }
}

// Remove Prefixes
function removePrefixes () {
  for (let i = 0; i < 3; i++) {
    checkPrefixRules()
    if (find(currentWord)) {
      return currentWord
    }
  }
}

function checkPrefixRules () {
  const removalCount = removals.length
  let j = 0
  for (j = 0; j < prefixRules.length; j++) {
    const resultObj = prefixRules[j](currentWord)

    // Add result to variable
    if (resultObj.removal !== undefined) {
      removals.push(resultObj.removal)
    }
    currentWord = resultObj.currentWord

    if (find(currentWord)) {
      return currentWord
    }
    if (removals.length > removalCount) {
      return
    }
  }
}

// Loop Restore Prefixes
function loopRestorePrefixes () {
  restorePrefix()

  const reversedRemovals = removals.reverse()
  const tempCurrentWord = currentWord

  for (const i in reversedRemovals) {
    const currentRemoval = reversedRemovals[i]

    if (!isSuffixRemovals(currentRemoval)) {
      continue
    }

    if (currentRemoval.getRemovedPart() === 'kan') {
      currentWord = currentRemoval.getResult() + 'k'

      // Step 4, 5
      removePrefixes()
      if (find(currentWord)) {
        return
      }
      currentWord = currentRemoval.getResult() + 'kan'
    } else {
      currentWord = currentRemoval.getOriginalWord()
    }

    // Step 4, 5
    removePrefixes()
    if (find(currentWord)) {
      return
    }

    currentWord = tempCurrentWord
  }
}

function isSuffixRemovals (removal) {
  const type = removal.getAffixType()
  if (type === 'DS' || type === 'PP' || type === 'P') {
    return true
  }
  return false
}

function restorePrefix () {
  for (let i = 0; i < removals.length; i++) {
    currentWord = removals[i].getOriginalWord()
    // break
  }

  for (let i = 0; i < removals.length; i++) {
    if (removals[i].getAffixType() === 'DP') {
      removals.splice(i, 1)
      i--
    }
  }
}

// Check if word require precedence adjustment or not
// Adjustment means remove prefix then suffix instead of remove suffix then prefix
function precedenceAdjustmentSpecification (word) {
  const regexRules = [
    /^be(.*)lah$/,
    /^be(.*)an$/,
    /^me(.*)i$/,
    /^di(.*)i$/,
    /^pe(.*)i$/,
    /^ter(.*)i$/
  ]

  for (const i in regexRules) {
    if (word.match(regexRules[i])) {
      return true
    }
  }
  return false
}

// exports for tests
stemmer.isPlural = isPlural
stemmer.dictionary = Array.from(dictionary)
stemmer.a = suffixRules[0]
