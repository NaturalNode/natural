/*
Copyright (c) 2012, Adam Phillabaum, Chris Umbel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

Unless otherwise stated by a specific section of code

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

'use strict'

// Computes the Jaro distance between two string -- intrepreted from:
// http://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance
// s1 is the first string to compare
// s2 is the second string to compare
function distance (s1, s2) {
  if (typeof (s1) !== 'string' || typeof (s2) !== 'string') {
    return 0
  }

  if (s1.length === 0 || s2.length === 0) {
    return 0
  }

  const matchWindow = (Math.floor(Math.max(s1.length, s2.length) / 2.0)) - 1
  const matches1 = new Array(s1.length)
  const matches2 = new Array(s2.length)
  let m = 0 // number of matches
  let t = 0 // number of transpositions
  let i = 0 // index for string 1
  let k = 0 // index for string 2

  // debug helpers
  // console.log("s1: " + s1 + "; s2: " + s2);
  // console.log(" - matchWindow: " + matchWindow);

  for (i = 0; i < s1.length; i++) { // loop to find matched characters
    const start = Math.max(0, (i - matchWindow)) // use the higher of the window diff
    const end = Math.min((i + matchWindow + 1), s2.length) // use the min of the window and string 2 length

    for (k = start; k < end; k++) { // iterate second string index
      if (matches2[k]) { // if second string character already matched
        continue
      }
      if (s1[i] !== s2[k]) { // characters don't match
        continue
      }

      // assume match if the above 2 checks don't continue
      matches1[i] = true
      matches2[k] = true
      m++
      break
    }
  }

  // nothing matched
  if (m === 0) {
    return 0.0
  }

  k = 0 // reset string 2 index
  for (i = 0; i < s1.length; i++) { // loop to find transpositions
    if (!matches1[i]) { // non-matching character
      continue
    }
    while (!matches2[k]) { // move k index to the next match
      k++
    }
    if (s1[i] !== s2[k]) { // if the characters don't match, increase transposition
      // HtD: t is always less than the number of matches m, because transpositions are a subset of matches
      t++
    }
    k++ // iterate k index normally
  }

  // transpositions divided by 2
  t = t / 2.0

  return ((m / s1.length) + (m / s2.length) + ((m - t) / m)) / 3.0 // HtD: therefore, m - t > 0, and m - t < m
  // HtD: => return value is between 0 and 1
}

// Computes the Winkler distance between two string -- intrepreted from:
// http://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance
// s1 is the first string to compare
// s2 is the second string to compare
// dj is the Jaro Distance (if you've already computed it), leave blank and the method handles it
// ignoreCase: if true strings are first converted to lower case before comparison
function JaroWinklerDistance (s1, s2, options = {}) {
  if (s1 === s2) {
    return 1
  } else {
    if (options.ignoreCase) {
      s1 = s1.toLowerCase()
      s2 = s2.toLowerCase()
    }

    // Use the  Jaro distance provided by the client if present
    const jaro = (options.dj === undefined) ? distance(s1, s2) : options.dj
    const p = 0.1 // default scaling factor
    let l = 0 // length of the matching prefix
    while (s1[l] === s2[l] && l < 4) {
      l++
    }

    // HtD: 1 - jaro >= 0
    return jaro + l * p * (1 - jaro)
  }
}

module.exports = JaroWinklerDistance
