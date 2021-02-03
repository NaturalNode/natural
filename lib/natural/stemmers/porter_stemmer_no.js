/*
Copyright (c) 2014, Kristoffer Brabrand

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

const Stemmer = require('./stemmer_no')

// Get the part of the token after the first non-vowel following a vowel
function getR1 (token) {
  const match = token.match(/[aeiouyæåø]{1}[^aeiouyæåø]([A-Za-z0-9_æøåÆØÅäÄöÖüÜ]+)/)

  if (match) {
    const preR1Length = match.index + 2

    if (preR1Length < 3 && preR1Length > 0) {
      return token.slice(3)
    } else if (preR1Length >= 3) {
      return match[1]
    } else {
      return token
    }
  }

  return null
}

function step1 (token) {
  // Perform step 1a-c
  const step1aResult = step1a(token)
  const step1bResult = step1b(token)
  const step1cResult = step1c(token)

  // Returne the shortest result string (from 1a, 1b and 1c)
  if (step1aResult.length < step1bResult.length) {
    return (step1aResult.length < step1cResult.length) ? step1aResult : step1cResult
  } else {
    return (step1bResult.length < step1cResult.length) ? step1bResult : step1cResult
  }
}

// step 1a as defined for the porter stemmer algorithm.
function step1a (token) {
  const r1 = getR1(token)

  if (!r1) {
    return token
  }

  const r1Match = r1.match(/(a|e|ede|ande|ende|ane|ene|hetene|en|heten|ar|er|heter|as|es|edes|endes|enes|hetenes|ens|hetens|ers|ets|et|het|ast)$/)

  if (r1Match) {
    return token.replace(new RegExp(r1Match[1] + '$'), '')
  }

  return token
}

// step 1b as defined for the porter stemmer algorithm.
function step1b (token) {
  const r1 = getR1(token)

  if (!r1) {
    return token
  }

  if (token.match(/(b|c|d|f|g|h|j|l|m|n|o|p|r|t|v|y|z)s$/)) {
    return token.slice(0, -1)
  }

  if (token.match(/([^aeiouyæåø]k)s$/)) {
    return token.slice(0, -1)
  }

  return token
}

// step 1c as defined for the porter stemmer algorithm.
function step1c (token) {
  const r1 = getR1(token)

  if (!r1) {
    return token
  }

  if (r1.match(/(erte|ert)$/)) {
    return token.replace(/(erte|ert)$/, 'er')
  }

  return token
}

// step 2 as defined for the porter stemmer algorithm.
function step2 (token) {
  const r1 = getR1(token)

  if (!r1) {
    return token
  }

  if (r1.match(/(d|v)t$/)) {
    return token.slice(0, -1)
  }

  return token
}

// step 3 as defined for the porter stemmer algorithm.
function step3 (token) {
  const r1 = getR1(token)

  if (!r1) { return token }

  const r1Match = r1.match(/(leg|eleg|ig|eig|lig|elig|els|lov|elov|slov|hetslov)$/)

  if (r1Match) {
    return token.replace(new RegExp(r1Match[1] + '$'), '')
  }

  return token
}

const PorterStemmer = new Stemmer()
module.exports = PorterStemmer

// perform full stemming algorithm on a single word
PorterStemmer.stem = function (token) {
  return step3(step2(step1(token.toLowerCase()))).toString()
}

// exports for tests
PorterStemmer.getR1 = getR1
PorterStemmer.step1 = step1
PorterStemmer.step1a = step1a
PorterStemmer.step1b = step1b
PorterStemmer.step1c = step1c
PorterStemmer.step2 = step2
PorterStemmer.step3 = step3
