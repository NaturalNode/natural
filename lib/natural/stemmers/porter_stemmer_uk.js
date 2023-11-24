'use strict'

const Stemmer = require('./stemmer_uk')

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
    [/(ив|ивши|ившись)$/g, '']
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
    [/(ими|ій|ий|а|е|ова|ове|ів|є|їй|єє|еє|я|ім|ем|им|ім|их|іх|ою|йми|іми|у|ю|ого|ому|ої)$/g, '']
  ])
  return result
}

function participle (token) { // edit
  const result = attemptReplacePatterns(token, [
    [/(ий|ого|ому|им|ім|а|ій|у|ою|ій|і|их|йми|их)$/g, '']
  ])
  return result
}

function reflexive (token) {
  const result = attemptReplacePatterns(token, [
    [/(с[яьи])$/g, '']
  ])
  return result
}

function verb (token) {
  const result = attemptReplacePatterns(token, [
    [/(сь|ся|ив|ать|ять|у|ю|ав|али|учи|ячи|вши|ши|е|ме|ати|яти|є)$/g, '']
  ])
  return result
}

function noun (token) {
  const result = attemptReplacePatterns(token, [
    [/(а|ев|ов|е|ями|ами|еи|и|ей|ой|ий|й|иям|ям|ием|ем|ам|ом|о|у|ах|иях|ях|ы|ь|ию|ью|ю|ия|ья|я|і|ові|ї|ею|єю|ою|є|еві|ем|єм|ів|їв|ю)$/g, '']
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
    [/[^аеиоуюяіїє][аеиоуюяіїє]+[^аеиоуюяіїє]+[аеиоуюяіїє].*(?<=о)сть?$/g, '']
  ])
  return result
}

// perform full stemming algorithm on a single word
PorterStemmer.stem = function (token) {
  token = token.toLowerCase()
  const volwesRegexp = /^(.*?[аеиоуюяіїє])(.*)$/g
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
