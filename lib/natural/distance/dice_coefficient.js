/*
Copyright (c) 2011, John Crepezzi, Chris Umbel

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

// Get all of the pairs of letters for a string
const letterPairs = function (str) {
  if (str.length === 0) {
    return []
  }
  const numPairs = str.length - 1
  const pairs = new Array(numPairs)
  for (let i = 0; i < numPairs; i++) {
    pairs[i] = str.substring(i, i + 2)
  }
  return pairs
}

// Get all of the pairs in all of the words for a string
const wordLetterPairs = function (str) {
  const allPairs = []; let pairs
  const words = str.split(/\s+/)
  for (let i = 0; i < words.length; i++) {
    pairs = letterPairs(words[i])
    allPairs.push.apply(allPairs, pairs)
  }
  return allPairs
}

// Perform some sanitization steps
const sanitize = function (str) {
  return str.toLowerCase().replace(/^\s+|\s+$/g, '')
}

// Compare two strings, and spit out a number from 0-1
const compare = function (str1, str2) {
  const sanitizedStr1 = sanitize(str1)
  const sanitizedStr2 = sanitize(str2)
  const pairs1 = wordLetterPairs(sanitizedStr1)
  const pairs2 = wordLetterPairs(sanitizedStr2)
  let intersection = 0; const union = pairs1.length + pairs2.length
  if (union === 0) {
    if (sanitizedStr1 === sanitizedStr2) {
      return 1
    } else {
      return 0
    }
  } else {
    let i, j, pair1, pair2
    for (i = 0; i < pairs1.length; i++) {
      pair1 = pairs1[i]
      for (j = 0; j < pairs2.length; j++) {
        pair2 = pairs2[j]
        if (pair1 === pair2) {
          intersection++
          delete pairs2[j]
          break
        }
      }
    }
    return 2 * intersection / union
  }
}

module.exports = compare
