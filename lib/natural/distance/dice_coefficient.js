/*
Copyright (c) 2021, Hugo W.L. ter Doest

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

function getBigrams (str) {
  let str1 = str
  // pad with a space if str consists of one character
  if (str.length === 1) {
    str1 = str + ' '
  }
  const bigrams = new Set()
  const length = str1.length
  for (let i = 0; i < length - 1; i++) {
    const bigram = str1.slice(i, i + 2)
    bigrams.add(bigram)
  }
  return bigrams
}

function intersect (set1, set2) {
  const intersection = new Set()
  set1.forEach(value => {
    if (set2.has(value)) {
      intersection.add(value)
    }
  })
  return intersection
}

// Perform some sanitization steps
function sanitize (str) {
  // Turn characters to lower string, remove space at the beginning and end,
  // replace multiple spaces in the middle by single spaces
  return str.toLowerCase().replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '')
}

function diceCoefficient (str1, str2) {
  const sanitizedStr1 = sanitize(str1)
  const sanitizedStr2 = sanitize(str2)
  const bigrams1 = getBigrams(sanitizedStr1)
  const bigrams2 = getBigrams(sanitizedStr2)
  return (2 * intersect(bigrams1, bigrams2).size) / (bigrams1.size + bigrams2.size)
}

module.exports = diceCoefficient
