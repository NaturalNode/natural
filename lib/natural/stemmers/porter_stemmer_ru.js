/*
Copyright (c) 2012, Polyakov Vladimir, Chris Umbel

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

const Stemmer = require('./stemmer_ru')

const PorterStemmer = new Stemmer()
module.exports = PorterStemmer

function attemptReplacePatterns (token, patterns) {
  let replacement = null
  let i = 0; let isReplaced = false
  while ((i < patterns.length) && !isReplaced) {
    if (patterns[i][0].test(token)) {
      replacement = token.replace(patterns[i][0], patterns[i][1])
      isReplaced = true
    }
    i++
  }
  return replacement
}

function perfectiveGerund (token) {
  const result = attemptReplacePatterns(token, [
    [/[ая]в(ши|шись)$/g, ''],
    [/(ив|ивши|ившись|ывши|ывшись|ыв)$/g, '']
  ])
  return result
}

function adjectival (token) {
  let result = adjective(token)
  if (result != null) {
    const pariticipleResult = participle(result)
    result = pariticipleResult || result
  }
  return result
}

function adjective (token) {
  const result = attemptReplacePatterns(token, [
    [/(ее|ие|ые|ое|ими|ыми|ей|ий|ый|ой|ем|им|ым|ом|его|ого|ему|ому|их|ых|ую|юю|ая|яя|ою|ею)$/g, '']
  ])
  return result
}

function participle (token) {
  const result = attemptReplacePatterns(token, [
    [/([ая])(ем|нн|вш|ющ|щ)$/g, '$1'],
    [/(ивш|ывш|ующ)$/g, '']
  ])
  return result
}

function reflexive (token) {
  const result = attemptReplacePatterns(token, [
    [/(ся|сь)$/g, '']
  ])
  return result
}

function verb (token) {
  const result = attemptReplacePatterns(token, [
    [/([ая])(ла|на|ете|йте|ли|й|л|ем|н|ло|но|ет|ют|ны|ть|ешь|нно)$/g, '$1'],
    [/(ила|ыла|ена|ейте|уйте|ите|или|ыли|ей|уй|ил|ыл|им|ым|ен|ило|ыло|ено|ят|ует|ит|ыт|ены|ить|ыть|ишь|ую|ю)$/g, '']
  ])
  return result
}

function noun (token) {
  const result = attemptReplacePatterns(token, [
    [/(а|ев|ов|ие|ье|е|иями|ями|ами|еи|ии|и|ией|ей|ой|ий|й|иям|ям|ием|ем|ам|ом|о|у|ах|иях|ях|ы|ь|ию|ью|ю|ия|ья|я)$/g, '']
  ])
  return result
}

function superlative (token) {
  const result = attemptReplacePatterns(token, [
    [/(ейш|ейше)$/g, '']
  ])
  return result
}

function derivational (token) {
  const result = attemptReplacePatterns(token, [
    [/(ост|ость)$/g, '']
  ])
  return result
}

// perform full stemming algorithm on a single word
PorterStemmer.stem = function (token) {
  token = token.toLowerCase().replace(/ё/g, 'е')
  const volwesRegexp = /^(.*?[аеиоюяуыиэ])(.*)$/g
  let RV = volwesRegexp.exec(token)
  if (!RV || RV.length < 3) {
    return token
  }
  const head = RV[1]
  RV = RV[2]
  volwesRegexp.lastIndex = 0
  const R2 = volwesRegexp.exec(RV)
  let result = perfectiveGerund(RV)
  if (result === null) {
    const resultReflexive = reflexive(RV) || RV
    result = adjectival(resultReflexive)
    if (result === null) {
      result = verb(resultReflexive)
      if (result === null) {
        result = noun(resultReflexive)
        if (result === null) {
          result = resultReflexive
        }
      }
    }
  }
  result = result.replace(/и$/g, '')
  let derivationalResult = result
  if (R2 && R2[2]) {
    derivationalResult = derivational(R2[2])
    if (derivationalResult != null) {
      derivationalResult = derivational(result)
    } else {
      derivationalResult = result
    }
  }

  let superlativeResult = superlative(derivationalResult) || derivationalResult

  superlativeResult = superlativeResult.replace(/(н)н/g, '$1')
  superlativeResult = superlativeResult.replace(/ь$/g, '')
  return head + superlativeResult
}
