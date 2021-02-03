/*
Copyright (c) 2018, Hugo W.L. ter Doest

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

/*
 * Spec for the Dutch Porter Stemmer can be found at:
 * http://snowball.tartarus.org/algorithms/dutch/stemmer.html
 */

'use strict'

const Stemmer = require('./stemmer_nl')

const DEBUG = false
const vowels = 'aeiouèy'

function isVowel (x) {
  return vowels.indexOf(x) > -1
}

// * Return longest matching suffixes for a token or '' if no suffix match
function endsinArr (str, suffixes) {
  let i
  let longest = ''
  for (i = 0; i < suffixes.length; i++) {
    if (endsin(str, suffixes[i]) && suffixes[i].length > longest.length) { longest = suffixes[i] }
  }

  if (DEBUG && longest !== '') {
    console.log('Matched suffix: ' + longest)
  }
  return longest
}

// Returns true if token has suffix
function endsin (str, suffix) {
  if (str.length < suffix.length) return false
  return (str.slice(-suffix.length) === suffix)
}

// Removes a suffix of len characters and returns the string
function removeSuffix (str, len) {
  return str.substr(0, str.length - len)
}

// Define undoubling the ending as removing the last letter if the word ends kk, dd or tt.
function undoubleEnding (str) {
  if (str.substr(-2) === 'kk' || str.substr(-2) === 'tt' || str.substr(-2) === 'dd') {
    return str.substr(0, str.length - 1)
  } else {
    return str
  }
}

class PorterStemmer extends Stemmer {
  replaceAccentedCharacters (word) {
    const accentedCharactersMapping = {
      ä: 'a',
      ë: 'e',
      ï: 'i',
      ö: 'o',
      ü: 'u',
      á: 'a',
      é: 'e',
      í: 'i',
      ó: 'o',
      ú: 'u'
    }
    let result = word
    for (const x in accentedCharactersMapping) {
      result = result.replace(new RegExp(x, 'g'), accentedCharactersMapping[x])
    }
    if (DEBUG) {
      console.log('replaceAccentedCharacters: ' + result)
    }
    return result
  }

  // Put initial y, y after a vowel, and i between vowels into upper case.
  handleYI (word) {
    // Initial y
    let result = word.replace(/^y/, 'Y')
    if (DEBUG) {
      console.log('handleYI: initial y: ' + result)
    }
    // y after vowel
    result = result.replace(/([aeioué])y/g, '$1Y')
    if (DEBUG) {
      console.log('handleYI: y after vowel: ' + result)
    }
    // i between vowels
    result = result.replace(/([aeioué])i([aeioué])/g, '$1I$2')
    if (DEBUG) {
      console.log('handleYI: i between vowels:' + result)
    }
    return result
  }

  // Determines R1 and R2; adapted from the French Porter Stemmer
  markRegions (token) {
    let r1, r2, len

    r1 = r2 = len = token.length

    // R1 is the region after the first non-vowel following a vowel,
    for (let i = 0; i < len - 1 && r1 === len; i++) {
      if (isVowel(token[i]) && !isVowel(token[i + 1])) {
        r1 = i + 2
      }
    }
    // Or is the null region at the end of the word if there is no such non-vowel.

    // R1 is adjusted such that the region before it contains at least 3 characters
    if (r1 !== len) {
      // R1 is not null
      if (r1 < 3) {
        // Region before does not contain at least 3 characters
        if (len > 3) {
          r1 = 3
          // Now R1 contains at least 3 characters
        } else {
          // It is not possible to make the region before long enough
          r1 = len
        }
      }
    }

    // R2 is the region after the first non-vowel following a vowel in R1
    for (let i = r1; i < len - 1 && r2 === len; i++) {
      if (isVowel(token[i]) && !isVowel(token[i + 1])) {
        r2 = i + 2
      }
    }
    // Or is the null region at the end of the word if there is no such non-vowel.

    if (DEBUG) {
      console.log('Regions r1 = ' + r1 + ' r2 = ' + r2)
    }

    this.r1 = r1
    this.r2 = r2
  }

  prelude (word) {
    let result = this.replaceAccentedCharacters(word)
    result = this.handleYI(result)
    this.markRegions(result)
    if (DEBUG) {
      console.log('Prelude: ' + result)
    }
    return result
  }

  // (1b) en   ene => delete if in R1 and preceded by a valid en-ending, and then undouble the ending
  // Define a valid en-ending as a non-vowel, and not gem.
  // Define undoubling the ending as removing the last letter if the word ends kk, dd or tt.
  step1b (word, suffixes) {
    let result = word

    const match = endsinArr(result, suffixes)
    if (match !== '') {
      const pos = result.length - match.length
      if (pos >= this.r1) {
        // check the character before the matched en/ene AND check for gem
        if (!isVowel(result[pos - 1]) && result.substr(pos - 3, 3) !== 'gem') {
          // delete
          result = removeSuffix(result, match.length)
          // Undouble the ending
          result = undoubleEnding(result)
        }
      }
    }
    if (DEBUG) {
      console.log('step 1b: ' + result)
    }
    return result
  }

  step1 (word) {
    let result = word
    // (1a) heden => replace with heid if in R1
    if (endsin(result, 'heden') && result.length - 5 >= this.r1) {
      result = removeSuffix(result, 5)
      result += 'heid'
    }
    if (DEBUG) {
      console.log('step 1a: ' + result)
    }

    result = this.step1b(result, ['en', 'ene'])

    // (1c) s   se => delete if in R1 and preceded by a valid s-ending
    // Define a valid s-ending as a non-vowel other than j.
    const match = endsinArr(result, ['se', 's'])
    if (match !== '') {
      const pos = result.length - match.length
      if (pos >= this.r1) {
        // check the character before the matched s/se
        // HtD: if there is a s before the s/se the suffix should stay
        // if (!isVowel(result[pos - 1]) && result[pos - 1] != "j") {
        if (!isVowel(result[pos - 1]) && !result.match(/[js]se?$/)) {
          result = removeSuffix(result, match.length)
        }
      }
    }
    if (DEBUG) {
      console.log('step 1c: ' + result)
    }
    return result
  }

  // Delete suffix e if in R1 and preceded by a non-vowel, and then undouble the ending
  step2 (word) {
    let result = word
    if (endsin(result, 'e') && this.r1 < result.length) {
      if (result.length > 1 && !isVowel(result[result.length - 2])) {
        // Delete
        result = removeSuffix(result, 1)
        this.suffixeRemoved = true
        // Undouble the ending
        result = undoubleEnding(result)
      }
    }

    if (DEBUG) {
      console.log('step2: ' + result)
    }
    return result
  }

  // Step 3a: heid => delete heid if in R2 and not preceded by c, and treat a preceding en as in step 1(b)
  step3a (word) {
    let result = word
    if (endsin(result, 'heid') && result.length - 4 >= this.r2 && result[result.length - 5] !== 'c') {
      // Delete
      result = removeSuffix(result, 4)
      // Treat a preceding en as in step 1b
      result = this.step1b(result, ['en'])
    }
    if (DEBUG) {
      console.log('step 3a: ' + result)
    }
    return result
  }

  // d suffixes: Search for the longest among the following suffixes, and perform the action indicated.
  step3b (word) {
    let result = word

    // end   ing => delete if in R2; if preceded by ig, delete if in R2 and not preceded by e, otherwise undouble the ending
    const suf = endsinArr(result, ['end', 'ing'])
    if (suf) {
      if ((result.length - 3) >= this.r2) {
        // Delete suffix
        result = removeSuffix(result, 3)
        // this.regions(result);
        if (endsin(result, 'ig') && (result.length - 2 >= this.r2) && result[result.length - 3] !== 'e') {
          // Delete suffix
          result = removeSuffix(result, 2)
        } else {
          result = undoubleEnding(result)
        }
      }
    }

    // ig => delete if in R2 and not preceded by e
    if (endsin(result, 'ig') && this.r2 <= result.length - 2 && result[result.length - 3] !== 'e') {
      result = removeSuffix(result, 2)
    }

    // lijk => delete if in R2, and then repeat step 2
    if (endsin(result, 'lijk') && this.r2 <= result.length - 4) {
      result = removeSuffix(result, 4)
      // repeat step 2
      result = this.step2(result)
    }

    // baar => delete if in R2
    if (endsin(result, 'baar') && this.r2 <= result.length - 4) {
      result = removeSuffix(result, 4)
    }

    // bar => delete if in R2 and if step 2 actually removed an e
    if (endsin(result, 'bar') && this.r2 <= result.length - 3 && this.suffixeRemoved) {
      result = removeSuffix(result, 3)
    }

    if (DEBUG) {
      console.log('step 3b: ' + result)
    }
    return result
  }

  // undouble vowel => If the words ends CVD, where C is a non-vowel,
  // D is a non-vowel other than I, and V is double a, e, o or u,
  // remove one of the vowels from V (for example, maan -> man, brood -> brod)
  step4 (word) {
    let result = word

    if (result.match(/[bcdfghjklmnpqrstvwxz](aa|ee|oo|uu)[bcdfghjklmnpqrstvwxz]$/)) {
      result = result.substr(0, result.length - 2) + result[result.length - 1]
    }

    if (DEBUG) {
      console.log('step4: ' + result)
    }
    return result
  }

  // Turn I and Y back into lower case.
  postlude (word) {
    return word.toLowerCase()
  }

  stem (word) {
    return this.postlude(this.step4(this.step3b(this.step3a(this.step2(this.step1(this.prelude(word)))))))
  }
}

module.exports = new PorterStemmer()
