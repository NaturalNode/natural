/*
 Copyright (c) 2013, Kenneth Koch

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

/**
 * The english normalizer will create a string in which all contractions are expanded to their
 * full meaning (i.e. "we'll" becomes "we will").
 *
 * It currently works off a conversion table and falls back to a set of rules.
 * Since it is applied first, the conversion table provides an "override" for the rules.
 **/
// const replacer = require('../util/utils').replacer

const conversionTable = {
  "can't": 'can not',
  "won't": 'will not',
  "couldn't've": 'could not have',
  "i'm": 'I am',
  "how'd": 'how did'
}

const rules = [
  { regex: /([azAZ]*)n'[tT]/g, output: '$1 not' },
  { regex: /([azAZ]*)'[sS]/g, output: '$1 is' },
  { regex: /([azAZ]*)'[lL][lL]/g, output: '$1 will' },
  { regex: /([azAZ]*)'[rR][eE]/g, output: '$1 are' },
  { regex: /([azAZ]*)'[vV][eE]/g, output: '$1 have' },
  { regex: /([azAZ]*)'[dD]/g, output: '$1 would' }
]

// Accepts a list of tokens to expand.
const normalizeTokens = function (tokens) {
  if (typeof tokens === 'string') {
    tokens = [tokens]
  }
  let results = []
  const ruleCount = rules.length
  const numTokens = tokens.length
  let i, token, r, rule

  for (i = 0; i < numTokens; i++) {
    token = tokens[i]
    // Check the conversion table
    if (conversionTable[token.toLowerCase()]) {
      results = results.concat(conversionTable[token.toLowerCase()].split(/\W+/))
    } else { // Apply the rules
      let matched = false
      for (r = 0; r < ruleCount; r++) {
        rule = rules[r]
        if (token.match(rule.regex)) {
          results = results.concat(token.replace(rule.regex, rule.output).split(/\W+/))
          matched = true
          break
        }
      }
      if (!matched) {
        results.push(token)
      }
    }
  }

  return results
}

// export the relevant stuff.
exports.normalizeTokens = normalizeTokens
