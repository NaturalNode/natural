/*
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

const Trie = require('../trie/trie')

// Probabilistic spellchecker based on http://norvig.com/spell-correct.html
// The general idea is simple. Given a word, the spellchecker calculates all strings that are some user-defined edit distance away. Of those many candidates, it filters the ones that are not words and then returns an array of possible corrections in order of decreasing probability, based on the edit distance and the candidate's frequency in the input corpus
// Words that are an edit distance of n away from the mispelled word are considered infinitely more probable than words that are of an edit distance >n

// wordlist is a corpus (an array) from which word probabilities are calculated (so something like /usr/share/dict/words (on OSX) will work okay, but real world text will work better)
class Spellcheck {
  constructor (wordlist) {
    this.trie = new Trie()
    this.trie.addStrings(wordlist)
    this.word2frequency = {}
    for (const i in wordlist) {
      if (!this.word2frequency[wordlist[i]]) {
        this.word2frequency[wordlist[i]] = 0
      }
      this.word2frequency[wordlist[i]]++
    }
  }

  isCorrect (word) {
    return this.trie.contains(word)
  }

  // Returns a list of suggested corrections, from highest to lowest probability
  // maxDistance is the maximum edit distance
  // According to Norvig, literature suggests that 80% to 95% of spelling errors are an edit distance of 1 away from the correct word. This is good, because there are roughly 54n+25 strings 1 edit distance away from any given string of length n. So after maxDistance = 2, this becomes very slow.
  getCorrections (word, maxDistance) {
    const self = this
    if (!maxDistance) maxDistance = 1
    let edits = this.editsWithMaxDistance(word, maxDistance)
    edits = edits.slice(1, edits.length)
    edits = edits.map(function (editList) {
      return editList.filter(function (word) { return self.isCorrect(word) })
        .map(function (word) { return [word, self.word2frequency[word]] })
        .sort(function (a, b) { return a[1] > b[1] ? -1 : 1 })
        .map(function (wordscore) { return wordscore[0] })
    })
    let flattened = []
    for (const i in edits) {
      if (edits[i].length) {
        flattened = flattened.concat(edits[i])
      }
    }
    return flattened.filter(function (v, i, a) {
      return a.indexOf(v) === i
    })
  }

  // Returns all edits that are 1 edit-distance away from the input word
  edits (word) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'
    let edits = []
    for (let i = 0; i < word.length + 1; i++) {
      if (i > 0) edits.push(word.slice(0, i - 1) + word.slice(i, word.length)) // deletes
      if (i > 0 && i < word.length + 1) edits.push(word.slice(0, i - 1) + word.slice(i, i + 1) + word.slice(i - 1, i) + word.slice(i + 1, word.length)) // transposes
      for (let k = 0; k < alphabet.length; k++) {
        if (i > 0) edits.push(word.slice(0, i - 1) + alphabet[k] + word.slice(i, word.length)) // replaces
        edits.push(word.slice(0, i) + alphabet[k] + word.slice(i, word.length)) // inserts
      }
    }
    // Deduplicate edits
    edits = edits.filter(function (v, i, a) { return a.indexOf(v) === i })
    return edits
  }

  // Returns all edits that are up to "distance" edit distance away from the input word
  editsWithMaxDistance (word, distance) {
    return this.editsWithMaxDistanceHelper(distance, [[word]])
  }

  editsWithMaxDistanceHelper (distanceCounter, distance2edits) {
    if (distanceCounter === 0) return distance2edits
    const currentDepth = distance2edits.length - 1
    const words = distance2edits[currentDepth]
    // const edits = this.edits(words[0])
    distance2edits[currentDepth + 1] = []
    for (const i in words) {
      distance2edits[currentDepth + 1] = distance2edits[currentDepth + 1].concat(this.edits(words[i]))
    }
    return this.editsWithMaxDistanceHelper(distanceCounter - 1, distance2edits)
  }
}

module.exports = Spellcheck
