/*
Copyright (c) 2014, Ismaël Héry

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
 * Spec for the French Porter Stemmer can be found at:
 * http://snowball.tartarus.org/algorithms/french/stemmer.html
 */

'use strict'

const Stemmer = require('./stemmer_fr')

const PorterStemmer = new Stemmer()
module.exports = PorterStemmer

// Export
PorterStemmer.stem = stem

// Exports for test purpose
PorterStemmer.prelude = prelude
PorterStemmer.regions = regions
PorterStemmer.endsinArr = endsinArr

/**
 * Stem a word thanks to Porter Stemmer rules
 * @param  {String} token Word to be stemmed
 * @return {String}       Stemmed word
 */
function stem (token) {
  token = prelude(token.toLowerCase())

  if (token.length === 1) { return token }

  const regs = regions(token)

  let r1txt, r2txt, rvtxt
  r1txt = token.substring(regs.r1)
  r2txt = token.substring(regs.r2)
  rvtxt = token.substring(regs.rv)

  // Step 1
  const beforeStep1 = token
  let suf, letterBefore, letter2Before, i
  let doStep2a = false

  if ((suf = endsinArr(r2txt, ['ance', 'iqUe', 'isme', 'able', 'iste', 'eux', 'ances', 'iqUes', 'ismes', 'ables', 'istes'])) !== '') {
    token = token.slice(0, -suf.length) // delete
  } else if ((suf = endsinArr(token, ['icatrice', 'icateur', 'ication', 'icatrices', 'icateurs', 'ications'])) !== '') {
    if (endsinArr(r2txt, ['icatrice', 'icateur', 'ication', 'icatrices', 'icateurs', 'ications']) !== '') {
      token = token.slice(0, -suf.length) // delete
    } else {
      token = token.slice(0, -suf.length) + 'iqU' // replace by iqU
    }
  } else if ((suf = endsinArr(r2txt, ['atrice', 'ateur', 'ation', 'atrices', 'ateurs', 'ations'])) !== '') {
    token = token.slice(0, -suf.length) // delete
  } else if ((suf = endsinArr(r2txt, ['logie', 'logies'])) !== '') {
    token = token.slice(0, -suf.length) + 'log' // replace with log
  } else if ((suf = endsinArr(r2txt, ['usion', 'ution', 'usions', 'utions'])) !== '') {
    token = token.slice(0, -suf.length) + 'u' // replace with u
  } else if ((suf = endsinArr(r2txt, ['ence', 'ences'])) !== '') {
    token = token.slice(0, -suf.length) + 'ent' // replace with ent
  } else if ((suf = endsinArr(r1txt, ['issement', 'issements'])) !== '') {
    if (!isVowel(token[token.length - suf.length - 1])) {
      token = token.slice(0, -suf.length) // delete
      r1txt = token.substring(regs.r1)
      r2txt = token.substring(regs.r2)
      rvtxt = token.substring(regs.rv)
    }
  } else if ((suf = endsinArr(r2txt, ['ativement', 'ativements'])) !== '') {
    token = token.slice(0, -suf.length) // delete
  } else if ((suf = endsinArr(r2txt, ['ivement', 'ivements'])) !== '') {
    token = token.slice(0, -suf.length) // delete
  } else if ((suf = endsinArr(token, ['eusement', 'eusements'])) !== '') {
    if ((suf = endsinArr(r2txt, ['eusement', 'eusements'])) !== '') {
      token = token.slice(0, -suf.length)
    } else if ((suf = endsinArr(r1txt, ['eusement', 'eusements'])) !== '') {
      token = token.slice(0, -suf.length) + 'eux'
    } else if ((suf = endsinArr(rvtxt, ['ement', 'ements'])) !== '') {
      token = token.slice(0, -suf.length)
    } // delete
  } else if ((suf = endsinArr(r2txt, ['ablement', 'ablements', 'iqUement', 'iqUements'])) !== '') {
    token = token.slice(0, -suf.length) // delete
  } else if ((suf = endsinArr(rvtxt, ['ièrement', 'ièrements', 'Ièrement', 'Ièrements'])) !== '') {
    token = token.slice(0, -suf.length) + 'i' // replace by i
  } else if ((suf = endsinArr(rvtxt, ['ement', 'ements'])) !== '') {
    token = token.slice(0, -suf.length) // delete
  } else if ((suf = endsinArr(token, ['icité', 'icités'])) !== '') {
    if (endsinArr(r2txt, ['icité', 'icités']) !== '') {
      token = token.slice(0, -suf.length)
    } else {
      token = token.slice(0, -suf.length) + 'iqU'
    }
  } else if ((suf = endsinArr(token, ['abilité', 'abilités'])) !== '') {
    if (endsinArr(r2txt, ['abilité', 'abilités']) !== '') {
      token = token.slice(0, -suf.length)
    } else {
      token = token.slice(0, -suf.length) + 'abl'
    }
  } else if ((suf = endsinArr(r2txt, ['ité', 'ités'])) !== '') {
    token = token.slice(0, -suf.length) // delete if in R2
  } else if ((suf = endsinArr(token, ['icatif', 'icative', 'icatifs', 'icatives'])) !== '') {
    if ((suf = endsinArr(r2txt, ['icatif', 'icative', 'icatifs', 'icatives'])) !== '') {
      token = token.slice(0, -suf.length) // delete
      r2txt = token.substring(regs.r2)
      rvtxt = token.substring(regs.rv)
    }
    if ((suf = endsinArr(r2txt, ['atif', 'ative', 'atifs', 'atives'])) !== '') {
      token = token.slice(0, -suf.length - 2) + 'iqU' // replace with iqU
      r2txt = token.substring(regs.r2)
      rvtxt = token.substring(regs.rv)
    }
  } else if ((suf = endsinArr(r2txt, ['atif', 'ative', 'atifs', 'atives'])) !== '') {
    token = token.slice(0, -suf.length) // delete
  } else if ((suf = endsinArr(r2txt, ['if', 'ive', 'ifs', 'ives'])) !== '') {
    token = token.slice(0, -suf.length) // delete
  } else if ((suf = endsinArr(token, ['eaux'])) !== '') {
    token = token.slice(0, -suf.length) + 'eau' // replace by eau
  } else if ((suf = endsinArr(r1txt, ['aux'])) !== '') {
    token = token.slice(0, -suf.length) + 'al' // replace by al
  } else if ((suf = endsinArr(r2txt, ['euse', 'euses'])) !== '') {
    token = token.slice(0, -suf.length) // delete
  } else if ((suf = endsinArr(r1txt, ['euse', 'euses'])) !== '') {
    token = token.slice(0, -suf.length) + 'eux' // replace by eux
  } else if ((suf = endsinArr(rvtxt, ['amment'])) !== '') {
    token = token.slice(0, -suf.length) + 'ant' // replace by ant
    doStep2a = true
  } else if ((suf = endsinArr(rvtxt, ['emment'])) !== '') {
    token = token.slice(0, -suf.length) + 'ent' // replace by ent
    doStep2a = true
  } else if ((suf = endsinArr(rvtxt, ['ment', 'ments'])) !== '') {
    // letter before must be a vowel in RV
    letterBefore = token[token.length - suf.length - 1]
    if (isVowel(letterBefore) && endsin(rvtxt, letterBefore + suf)) {
      token = token.slice(0, -suf.length) // delete
      doStep2a = true
    }
  }

  // re compute regions
  r1txt = token.substring(regs.r1)
  r2txt = token.substring(regs.r2)
  rvtxt = token.substring(regs.rv)

  // Step 2a
  const beforeStep2a = token
  let step2aDone = false
  if (beforeStep1 === token || doStep2a) {
    step2aDone = true
    if ((suf = endsinArr(rvtxt, ['îmes', 'ît', 'îtes', 'i', 'ie', 'Ie', 'ies', 'ir', 'ira', 'irai', 'iraIent', 'irais', 'irait', 'iras', 'irent', 'irez', 'iriez', 'irions', 'irons', 'iront', 'is', 'issaIent', 'issais', 'issait', 'issant', 'issante', 'issantes', 'issants', 'isse', 'issent', 'isses', 'issez', 'issiez', 'issions', 'issons', 'it'])) !== '') {
      letterBefore = token[token.length - suf.length - 1]
      if (!isVowel(letterBefore) && endsin(rvtxt, letterBefore + suf)) { token = token.slice(0, -suf.length) } // delete
    }
  }

  // Step 2b
  if (step2aDone && token === beforeStep2a) {
    if ((suf = endsinArr(rvtxt, ['é', 'ée', 'ées', 'és', 'èrent', 'er', 'era', 'erai', 'eraIent', 'erais', 'erait', 'eras', 'erez', 'eriez', 'erions', 'erons', 'eront', 'ez', 'iez', 'Iez'])) !== '') {
      token = token.slice(0, -suf.length) // delete
      r2txt = token.substring(regs.r2)
      rvtxt = token.substring(regs.rv)
    } else if ((suf = endsinArr(rvtxt, ['ions'])) !== '' && endsinArr(r2txt, ['ions'])) {
      token = token.slice(0, -suf.length) // delete
      r2txt = token.substring(regs.r2)
      rvtxt = token.substring(regs.rv)
    } else if ((suf = endsinArr(rvtxt, ['âmes', 'ât', 'âtes', 'a', 'ai', 'aIent', 'ais', 'ait', 'ant', 'ante', 'antes', 'ants', 'as', 'asse', 'assent', 'asses', 'assiez', 'assions'])) !== '') {
      token = token.slice(0, -suf.length) // delete

      letterBefore = token[token.length - 1]
      if (letterBefore === 'e' && endsin(rvtxt, 'e' + suf)) { token = token.slice(0, -1) }

      r2txt = token.substring(regs.r2)
      rvtxt = token.substring(regs.rv)
    }
  }

  // Step 3
  if (!(token === beforeStep1)) {
    if (token[token.length - 1] === 'Y') { token = token.slice(0, -1) + 'i' }
    if (token[token.length - 1] === 'ç') { token = token.slice(0, -1) + 'c' }
  } else {
    // Step 4
    letterBefore = token[token.length - 1]
    letter2Before = token[token.length - 2]

    if (letterBefore === 's' && ['a', 'i', 'o', 'u', 'è', 's'].indexOf(letter2Before) === -1) {
      token = token.slice(0, -1)
      r1txt = token.substring(regs.r1)
      r2txt = token.substring(regs.r2)
      rvtxt = token.substring(regs.rv)
    }

    if ((suf = endsinArr(r2txt, ['ion'])) !== '') {
      letterBefore = token[token.length - suf.length - 1]
      if (letterBefore === 's' || letterBefore === 't') {
        token = token.slice(0, -suf.length) // delete
        r1txt = token.substring(regs.r1)
        r2txt = token.substring(regs.r2)
        rvtxt = token.substring(regs.rv)
      }
    }

    if ((suf = endsinArr(rvtxt, ['ier', 'ière', 'Ier', 'Ière'])) !== '') {
      token = token.slice(0, -suf.length) + 'i' // replace by i
      r1txt = token.substring(regs.r1)
      r2txt = token.substring(regs.r2)
      rvtxt = token.substring(regs.rv)
    }
    if ((suf = endsinArr(rvtxt, 'e')) !== '') {
      token = token.slice(0, -suf.length) // delete
      r1txt = token.substring(regs.r1)
      r2txt = token.substring(regs.r2)
      rvtxt = token.substring(regs.rv)
    }
    if ((suf = endsinArr(rvtxt, 'ë')) !== '') {
      if (token.slice(token.length - 3, -1) === 'gu') { token = token.slice(0, -suf.length) } // delete
    }
  }

  // Step 5
  if ((suf = endsinArr(token, ['enn', 'onn', 'ett', 'ell', 'eill'])) !== '') {
    token = token.slice(0, -1) // delete last letter
  }

  // Step 6
  i = token.length - 1
  while (i > 0) {
    if (!isVowel(token[i])) {
      i--
    } else if (i !== token.length - 1 && (token[i] === 'é' || token[i] === 'è')) {
      token = token.substring(0, i) + 'e' + token.substring(i + 1, token.length)
      break
    } else {
      break
    }
  }

  return token.toLowerCase()
};

/**
 * Compute r1, r2, rv regions as required by french porter stemmer algorithm
 * @param  {String} token Word to compute regions on
 * @return {Object}       Regions r1, r2, rv as offsets from the begining of the word
 */
function regions (token) {
  let r1, r2, rv, len
  // var i

  r1 = r2 = rv = len = token.length

  // R1 is the region after the first non-vowel following a vowel,
  for (let i = 0; i < len - 1 && r1 === len; i++) {
    if (isVowel(token[i]) && !isVowel(token[i + 1])) {
      r1 = i + 2
    }
  }
  // Or is the null region at the end of the word if there is no such non-vowel.

  // R2 is the region after the first non-vowel following a vowel in R1
  for (let i = r1; i < len - 1 && r2 === len; i++) {
    if (isVowel(token[i]) && !isVowel(token[i + 1])) {
      r2 = i + 2
    }
  }
  // Or is the null region at the end of the word if there is no such non-vowel.

  // RV region
  const three = token.slice(0, 3)
  if (isVowel(token[0]) && isVowel(token[1])) {
    rv = 3
  }
  if (three === 'par' || three === 'col' || three === 'tap') {
    rv = 3
  } else {
  // the region after the first vowel not at the beginning of the word or null
    for (let i = 1; i < len - 1 && rv === len; i++) {
      if (isVowel(token[i])) {
        rv = i + 1
      }
    }
  }

  return {
    r1: r1,
    r2: r2,
    rv: rv
  }
};

/**
 * Pre-process/prepare words as required by french porter stemmer algorithm
 * @param  {String} token Word to be prepared
 * @return {String}       Prepared word
 */
function prelude (token) {
  token = token.toLowerCase()

  let result = ''
  let i = 0

  // special case for i = 0 to avoid '-1' index
  if (token[i] === 'y' && isVowel(token[i + 1])) {
    result += token[i].toUpperCase()
  } else {
    result += token[i]
  }

  for (i = 1; i < token.length; i++) {
    if ((token[i] === 'u' || token[i] === 'i') && isVowel(token[i - 1]) && isVowel(token[i + 1])) {
      result += token[i].toUpperCase()
    } else if (token[i] === 'y' && (isVowel(token[i - 1]) || isVowel(token[i + 1]))) {
      result += token[i].toUpperCase()
    } else if (token[i] === 'u' && token[i - 1] === 'q') {
      result += token[i].toUpperCase()
    } else {
      result += token[i]
    }
  }

  return result
};

/**
 * Return longest matching suffixes for a token or '' if no suffix match
 * @param  {String} token    Word to find matching suffix
 * @param  {Array} suffixes  Array of suffixes to test matching
 * @return {String}          Longest found matching suffix or ''
 */
function endsinArr (token, suffixes) {
  let i; let longest = ''
  for (i = 0; i < suffixes.length; i++) {
    if (endsin(token, suffixes[i]) && suffixes[i].length > longest.length) { longest = suffixes[i] }
  }

  return longest
};

function isVowel (letter) {
  return (letter === 'a' || letter === 'e' || letter === 'i' || letter === 'o' || letter === 'u' || letter === 'y' || letter === 'â' || letter === 'à' || letter === 'ë' ||
    letter === 'é' || letter === 'ê' || letter === 'è' || letter === 'ï' || letter === 'î' || letter === 'ô' || letter === 'û' || letter === 'ù')
};

function endsin (token, suffix) {
  if (token.length < suffix.length) return false
  return (token.slice(-suffix.length) === suffix)
};
