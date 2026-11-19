/*
Copyright (c) 2012, Leonardo Fenu, Chris Umbel

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

const Stemmer = require('./stemmer_it')

const PorterStemmer = new Stemmer()
module.exports = PorterStemmer

function isVowel (letter) {
  return (letter === 'a' || letter === 'e' || letter === 'i' || letter === 'o' || letter === 'u' || letter === 'à' ||
    letter === 'è' || letter === 'ì' || letter === 'ò' || letter === 'ù')
}

function getNextVowelPos (token, start) {
  start = start + 1
  const length = token.length
  for (let i = start; i < length; i++) {
    if (isVowel(token[i])) {
      return i
    }
  }
  return length
}

function getNextConsonantPos (token, start) {
  const length = token.length
  for (let i = start; i < length; i++) { if (!isVowel(token[i])) return i }
  return length
}

function endsin (token, suffix) {
  if (token.length < suffix.length) return false
  return (token.slice(-suffix.length) === suffix)
}

function endsinArr (token, suffixes) {
  for (let i = 0; i < suffixes.length; i++) {
    if (endsin(token, suffixes[i])) return suffixes[i]
  }
  return ''
}

function replaceAcute (token) {
  let str = token.replace(/á/gi, 'à')
  str = str.replace(/é/gi, 'è')
  str = str.replace(/í/gi, 'ì')
  str = str.replace(/ó/gi, 'ò')
  str = str.replace(/ú/gi, 'ù')
  return str
}

function vowelMarking (token) {
  function replacer (match, p1, p2) {
    return p1 + p2.toUpperCase()
  }
  // Lookahead so the closing vowel can open the next match ("aiaia" -> "aIaIa")
  const str = token.replace(/([aeiouàèìòù])(i|u)(?=[aeiouàèìòù])/g, replacer)
  return str
}

const step1Groups = {
  r2: ['anza', 'anze', 'ico', 'ici', 'ica', 'ice', 'iche', 'ichi', 'ismo', 'ismi', 'abile', 'abili', 'ibile', 'ibili', 'ista', 'iste', 'isti', 'istà', 'istè', 'istì', 'oso', 'osi', 'osa', 'ose', 'mente', 'atrice', 'atrici', 'ante', 'anti'],
  azione: ['azione', 'azioni', 'atore', 'atori'],
  logia: ['logia', 'logie'],
  uzione: ['uzione', 'uzioni', 'usione', 'usioni'],
  enza: ['enza', 'enze'],
  amento: ['amento', 'amenti', 'imento', 'imenti'],
  amente: ['amente'],
  ità: ['ità'],
  ivo: ['ivo', 'ivi', 'iva', 'ive']
}
const step1Suffixes = {}
Object.keys(step1Groups).forEach(group => {
  step1Groups[group].forEach(suffix => { step1Suffixes[suffix] = group })
})
const step1SuffixList = Object.keys(step1Suffixes).sort((a, b) => b.length - a.length)

// Deletes suffix from token if it ends in it and the suffix starts at or after pos
function deleteIn (token, suffix, pos) {
  if (endsin(token, suffix) && token.length - suffix.length >= pos) {
    return token.slice(0, -suffix.length)
  }
  return token
}

function standardSuffix (token, r1, r2, rv) {
  const suf = endsinArr(token, step1SuffixList)
  if (suf === '') return token
  const start = token.length - suf.length
  const base = token.slice(0, start)
  let next
  switch (step1Suffixes[suf]) {
    case 'r2':
      return start >= r2 ? base : token
    case 'azione':
      return start >= r2 ? deleteIn(base, 'ic', r2) : token
    case 'logia':
      return start >= r2 ? base + 'log' : token
    case 'uzione':
      return start >= r2 ? base + 'u' : token
    case 'enza':
      return start >= r2 ? base + 'ente' : token
    case 'amento':
      return start >= rv ? base : token
    case 'amente':
      if (start < r1) return token
      next = endsinArr(base, ['abil', 'iv', 'os', 'ic'])
      if (next === '' || base.length - next.length < r2) return base
      if (next === 'iv') return deleteIn(base.slice(0, -2), 'at', r2)
      return base.slice(0, -next.length)
    case 'ità':
      if (start < r2) return token
      next = endsinArr(base, ['abil', 'ic', 'iv'])
      return next === '' ? base : deleteIn(base, next, r2)
    case 'ivo':
      if (start < r2) return token
      next = deleteIn(base, 'at', r2)
      return next === base ? base : deleteIn(next, 'ic', r2)
  }
  return token
}

// perform full stemming algorithm on a single word
PorterStemmer.stem = function (token) {
  token = token.toLowerCase()
  token = replaceAcute(token)
  token = token.replace(/qu/g, 'qU')
  token = vowelMarking(token)

  if (token.length < 3) {
    return token.toLowerCase()
  }

  let r1 = token.length
  let r2 = token.length
  let rv = token.length
  const len = token.length
  // R1 is the region after the first non-vowel following a vowel,
  for (let i = 0; i < token.length - 1 && r1 === len; i++) {
    if (isVowel(token[i]) && !isVowel(token[i + 1])) {
      r1 = i + 2
    }
  }
  // Or is the null region at the end of the word if there is no such non-vowel.

  // R2 is the region after the first non-vowel following a vowel in R1
  for (let i = r1; i < token.length - 1 && r2 === len; i++) {
    if (isVowel(token[i]) && !isVowel(token[i + 1])) {
      r2 = i + 2
    }
  }

  // Or is the null region at the end of the word if there is no such non-vowel.

  // If the second letter is a consonant, RV is the region after the next following vowel,

  // RV as follow

  if (len > 3) {
    if (!isVowel(token[1])) {
      // If the second letter is a consonant, RV is the region after the next following vowel
      rv = getNextVowelPos(token, 1) + 1
    } else if (isVowel(token[0]) && isVowel(token[1])) {
      // or if the first two letters are vowels, RV is the region after the next consonant
      rv = getNextConsonantPos(token, 2) + 1
    } else {
      // otherwise (consonant-vowel case) RV is the region after the third letter. But RV is the end of the word if these positions cannot be found.
      rv = 3
    }
  }

  let rvtxt = token.substring(rv)

  const tokenOrig = token

  // Step 0: Attached pronoun

  const pronounSuf = ['glieli', 'glielo', 'gliene', 'gliela', 'gliele', 'sene', 'tene', 'cela', 'cele', 'celi', 'celo', 'cene', 'vela', 'vele', 'veli', 'velo', 'vene', 'mela', 'mele', 'meli', 'melo', 'mene', 'tela', 'tele', 'teli', 'telo', 'gli', 'ci', 'la', 'le', 'li', 'lo', 'mi', 'ne', 'si', 'ti', 'vi']
  const pronounSufPre1 = ['ando', 'endo']
  const pronounSufPre2 = ['ar', 'er', 'ir']
  let suf = endsinArr(token, pronounSuf)

  if (suf !== '') {
    const preSuff1 = endsinArr(rvtxt.slice(0, -suf.length), pronounSufPre1)
    const preSuff2 = endsinArr(rvtxt.slice(0, -suf.length), pronounSufPre2)

    if (preSuff1 !== '') {
      token = token.slice(0, -suf.length)
    }
    if (preSuff2 !== '') {
      token = token.slice(0, -suf.length) + 'e'
    }
  }

  if (token !== tokenOrig) {
    rvtxt = token.substring(rv)
  }

  const tokenAfter0 = token

  // Step 1:  Standard suffix removal
  // Like Snowball, take the longest suffix of the word first and only then
  // test its region. A shorter suffix must not be tried when the longest one
  // is outside its region (giocatrici must not lose "ici").
  token = standardSuffix(token, r1, r2, rv)

  if (token !== tokenAfter0) {
    rvtxt = token.substring(rv)
  }

  const tokenAfter1 = token

  // Step 2:  Verb suffixes

  if (tokenAfter0 === tokenAfter1) {
    if ((suf = endsinArr(rvtxt, ['erebbero', 'irebbero', 'assero', 'assimo', 'eranno', 'erebbe', 'eremmo', 'ereste', 'eresti', 'essero', 'iranno', 'irebbe', 'iremmo', 'ireste', 'iresti', 'iscano', 'iscono', 'issero', 'arono', 'avamo', 'avano', 'avate', 'eremo', 'erete', 'erono', 'evamo', 'evano', 'evate', 'iremo', 'irete', 'irono', 'ivamo', 'ivano', 'ivate', 'ammo', 'ando', 'asse', 'assi', 'emmo', 'enda', 'ende', 'endi', 'endo', 'erai', 'Yamo', 'iamo', 'immo', 'irai', 'irei', 'isca', 'isce', 'isci', 'isco', 'erei', 'uti', 'uto', 'ita', 'ite', 'iti', 'ito', 'iva', 'ivi', 'ivo', 'ono', 'uta', 'ute', 'ano', 'are', 'ata', 'ate', 'ati', 'ato', 'ava', 'avi', 'avo', 'erà', 'ere', 'erò', 'ete', 'eva', 'evi', 'evo', 'irà', 'ire', 'irò', 'ar', 'ir'])) !== '') {
      token = token.slice(0, -suf.length)
    }
  }

  rvtxt = token.substring(rv)

  // Always do step 3.

  if ((suf = endsinArr(rvtxt, ['ia', 'ie', 'ii', 'io', 'ià', 'iè', 'iì', 'iò', 'a', 'e', 'i', 'o', 'à', 'è', 'ì', 'ò'])) !== '') {
    token = token.slice(0, -suf.length)
  }

  rvtxt = token.substring(rv)

  if ((suf = endsinArr(rvtxt, ['ch'])) !== '') {
    token = token.slice(0, -suf.length) + 'c' // replace with c
  } else if ((suf = endsinArr(rvtxt, ['gh'])) !== '') {
    token = token.slice(0, -suf.length) + 'g' // replace with g
  }

  rvtxt = token.substring(rv)

  return token.toLowerCase()
}
