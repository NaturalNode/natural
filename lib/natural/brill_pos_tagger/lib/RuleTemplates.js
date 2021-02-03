/*
  Rule templates that provide metadata for generating transformation rules
  Copyright (C) 2017 Hugo W.L. ter Doest

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict'

const ruleTemplates = {
  // Predicates as used in the English rules in data/English/tr_from_posjs.txt
  'NEXT-TAG': {
    // maps to the predicate function
    function: nextTagIs,
    // Minimum required space before or after current position to be a relevant predicate
    window: [0, 1],
    // The number of parameters the predicate takes
    nrParameters: 1,
    // Function that returns relevant values for parameter 1
    parameter1Values: nextTagParameterValues
  },
  'NEXT-WORD-IS-CAP': {
    function: nextWordIsCap,
    window: [0, 1],
    nrParameters: 0
  },
  'PREV-1-OR-2-OR-3-TAG': {
    function: prev1Or2Or3Tag,
    window: [-1, 0],
    nrParameters: 1,
    parameter1Values: prev1Or2Or3TagParameterValues
  },
  'PREV-1-OR-2-TAG': {
    function: prev1Or2Tag,
    window: [-1, 0],
    nrParameters: 1,
    parameter1Values: prev1Or2TagParameterValues
  },
  'NEXT-WORD-IS-TAG': {
    function: nextTagIs,
    window: [0, 1],
    nrParameters: 1,
    parameter1Values: nextTagParameterValues
  },
  'PREV-TAG': {
    function: prevTagIs,
    window: [-1, 0],
    nrParameters: 1,
    parameter1Values: prevTagParameterValues
  },
  /*
 "CURRENT-WORD-IS-TAG": {
   "function": current_word_is_tag,
   "window": [0],
   "nrParameter": 1,
   "parameter1Values": currentTagParameterValues
   },
  */
  'PREV-WORD-IS-CAP': {
    function: prevWordIsCap,
    window: [-1, 0],
    nrParameters: 0
  },
  'CURRENT-WORD-IS-CAP': {
    function: currentWordIsCap,
    window: [0, 0],
    nrParameters: 0
  },
  'CURRENT-WORD-IS-NUMBER': {
    function: currentWordIsNumber,
    window: [0, 0],
    nrParameters: 0
  },
  'CURRENT-WORD-IS-URL': {
    function: currentWordIsURL,
    window: [0, 0],
    nrParameters: 0
  },
  'CURRENT-WORD-ENDS-WITH': {
    function: currentWordEndsWith,
    window: [0, 0],
    nrParameters: 1,
    parameter1Values: currentWordEndsWithParameterValues
  },
  'PREV-WORD-IS': {
    function: prevWordIs,
    window: [-1, 0],
    nrParameters: 1,
    parameter1Values: prevWordParameterValues
  },

  // Predicates as used in the Dutch rules in data/Dutch/brill_CONTEXTRULES.jg
  PREVTAG: {
    function: prevTagIs,
    window: [-1, 0],
    nrParameters: 1,
    parameter1Values: prevTagParameterValues
  },
  NEXT1OR2TAG: {
    function: next1Or2TagIs,
    window: [0, 1],
    nrParameters: 1,
    parameter1Values: next1Or2TagIsParameterValues
  },
  NEXTTAG: {
    function: nextTagIs,
    window: [0, 1],
    nrParameters: 1,
    parameter1Values: nextTagParameterValues
  },
  PREV1OR2TAG: {
    function: prev1Or2Tag,
    window: [-1, 0],
    nrParameters: 1,
    parameter1Values: prev1Or2TagParameterValues
  },
  WDAND2TAGAFT: {
    function: currentWordAnd2TagAfterAre,
    window: [0, 2],
    nrParameters: 2,
    parameter1Values: currentWordParameterValues,
    parameter2Values: twoTagAfterParameterValues
  },
  NEXT1OR2OR3TAG: {
    function: next1Or2Or3Tag,
    // Minimum required window to apply this template is one tag to the right
    window: [0, 1],
    nrParameters: 1,
    parameter1Values: next1Or2Or3TagParameterValues
  },
  CURWD: {
    function: currentWordIs,
    window: [0, 0],
    nrParameters: 1,
    parameter1Values: currentWordParameterValues
  },
  SURROUNDTAG: {
    function: surroundedByTags,
    window: [-1, 1],
    nrParameters: 2,
    parameter1Values: prevTagParameterValues,
    parameter2Values: nextTagParameterValues
  },
  PREV1OR2OR3TAG: {
    function: prev1Or2Or3Tag,
    // Minimum required window to apply this template is one tag to the left
    window: [-1, 0],
    nrParameters: 1,
    parameter1Values: prev1Or2Or3TagParameterValues
  },
  WDNEXTTAG: {
    function: currentWordAndNextTagAre,
    window: [0, 1],
    nrParameters: 2,
    parameter1Values: currentWordParameterValues,
    parameter2Values: nextTagParameterValues
  },
  PREV1OR2WD: {
    function: prev1Or2WordIs,
    window: [-1, 0],
    nrParameters: 1,
    parameter1Values: prev1Or2WordParameterValues
  },
  NEXTWD: {
    function: nextWordIs,
    window: [0, 1],
    nrParameters: 1,
    parameter1Values: nextWordParameterValues
  },
  PREVWD: {
    function: prevWordIs,
    window: [-1, 0],
    nrParameters: 1,
    parameter1Values: prevWordParameterValues
  },
  NEXT2TAG: {
    function: next2TagIs,
    window: [0, 2],
    nrParameters: 1,
    parameter1Values: next2TagParameterValues
  },
  WDAND2TAGBFR: {
    function: currentWordAnd2TagBeforeAre,
    window: [-2, 0],
    nrParameters: 2,
    parameter1Values: currentWordParameterValues,
    parameter2Values: twoTagBeforeParameterValues
  },
  WDAND2AFT: {
    function: currentWordAnd2AfterAre,
    window: [0, 2],
    nrParameters: 2,
    parameter1Values: currentWordParameterValues,
    parameter2Values: twoTagAfterParameterValues
  },
  WDPREVTAG: {
    function: currentWordAndPrevTagAre,
    window: [-1, 0],
    nrParameters: 2,
    parameter1Values: currentWordParameterValues,
    parameter2Values: prevTagParameterValues
  },
  RBIGRAM: {
    function: rightBigramIs,
    window: [0, 1],
    nrParameters: 2,
    parameter1Values: currentWordParameterValues,
    parameter2Values: nextWordParameterValues
  },
  LBIGRAM: {
    function: leftBigramIs,
    window: [-1, 0],
    nrParameters: 2,
    parameter1Values: prevWordParameterValues,
    parameter2Values: currentWordParameterValues
  },
  NEXTBIGRAM: {
    function: nextBigramIs,
    window: [0, 2],
    nrParameters: 2,
    parameter1Values: nextWordParameterValues,
    parameter2Values: twoWordAfterParameterValues
  },
  PREVBIGRAM: {
    function: prevBigramIs,
    window: [-2, 0],
    nrParameters: 2,
    parameter1Values: twoWordBeforeParameterValues,
    parameter2Values: prevWordParameterValues
  },
  PREV2TAG: {
    function: prev2TagIs,
    window: [-2, 0],
    nrParameters: 2,
    parameter1Values: twoTagBeforeParameterValues,
    parameter2Values: prevTagParameterValues
  },
  NEXT1OR2WD: {
    function: next1Or2WordIs,
    window: [0, 1],
    nrParameters: 1,
    parameter1Values: next1Or2WordParameterValues
  },
  DEFAULT: {
    function: defaultPredicate,
    window: [0, 0],
    nrParameters: 0
  }
}

// ==================================
// Predicates that start with words
// ==================================
function nextWordIsCap (sentence, i, parameter) {
  if (i < sentence.taggedWords.length - 1) {
    const nextWord = sentence.taggedWords[i + 1].token
    return (nextWord[0] === nextWord[0].toUpperCase())
  }
  return (false)
}

function nextWordIs (sentence, i, parameter) {
  if (i < sentence.taggedWords.length - 1) {
    return (sentence.taggedWords[i + 1].token === parameter)
  }
}

function nextWordParameterValues (sentence, i) {
  if (i < sentence.taggedWords.length - 1) {
    return [sentence.taggedWords[i + 1].token]
  } else {
    return []
  }
}

function prevWordIsCap (sentence, i, parameter) {
  let prevWord = null
  if (i > 0) {
    prevWord = sentence.taggedWords[i - 1].token
    return (prevWord[0] === prevWord[0].toUpperCase())
  }
  return (false)
}

function currentWordIsCap (sentence, i, parameter) {
  const currentWord = sentence.taggedWords[i].token
  return (currentWord[0] === currentWord[0].toUpperCase())
}

function currentWordParameterValues (sentence, i) {
  return [sentence[i].token]
}

function currentWordIs (sentence, i, parameter) {
  return (sentence.taggedWords[i].token === parameter)
}

function isNumeric (num) {
  return (!isNaN(num))
}

function currentWordIsNumber (sentence, i, parameter) {
  let isNumber = isNumeric(sentence.taggedWords[i].token)
  // Attempt to parse it as a float
  if (!isNumber) {
    isNumber = parseFloat(sentence.taggedWords[i].token)
  }
  return ((parameter === 'YES') ? isNumber : !isNumber)
}

// Checks if the current word is a url
// Adapted from the original Javascript Brill tagger
function currentWordIsURL (sentence, i, parameter) {
  let isURL = false
  if (sentence.taggedWords[i].token.indexOf('.') > -1) {
    // url if there are two contiguous alpha characters
    if (/[a-zA-Z]{2}/.test(sentence.taggedWords[i].token)) {
      isURL = true
    }
  }
  return ((parameter === 'YES') ? isURL : !isURL)
}

function currentWordAnd2TagAfterAre (sentence, i, parameter1, parameter2) {
  if (i < sentence.taggedWords.length - 2) {
    if (sentence.taggedWords[i + 2][1] === parameter2) {
      return (sentence.taggedWords[i].token === parameter1)
    } else {
      return (false)
    }
  } else {
    return (false)
  }
}

function twoTagAfterParameterValues (sentence, i) {
  if (i < sentence.taggedWords.length - 2) {
    return [sentence.taggedWords[i + 2].tag]
  } else {
    return []
  }
}

function currentWordAndNextTagAre (sentence, i, parameter1, parameter2) {
  let nextTag = false
  // check current word
  const currentWord = (sentence.taggedWords[i].token === parameter1)
  // check next tag
  if (i < sentence.taggedWords.length - 1) {
    nextTag = (sentence.taggedWords[i + 1].tag === parameter2)
  }
  return (currentWord && nextTag)
}

function currentWordAndPrevTagAre (sentence, i, parameter1, parameter2) {
  let prevTag = false
  // check current word
  const currentWord = (sentence.taggedWords[i].token === parameter2)
  // check prev tag
  if (i > 0) {
    prevTag = (sentence.taggedWords[i - 1].tag === parameter1)
  }
  return (currentWord && prevTag)
}

function currentWordAnd2TagBeforeAre (sentence, i, parameter1, parameter2) {
  let twoTagsBefore = false
  // check current word
  const currentWord = (sentence.taggedWords[i].token === parameter2)
  if (i > 1) {
    // check two tags before
    twoTagsBefore = (sentence.taggedWords[i - 2].tag === parameter1)
  }
  return (currentWord && twoTagsBefore)
}

function twoTagBeforeParameterValues (sentence, i) {
  if (i > 1) {
    return [sentence.taggedWords[i - 2].tag]
  } else {
    return []
  }
}

function currentWordAnd2AfterAre (sentence, i, parameter1, parameter2) {
  let twoWordsAfter = false
  // check current word
  const currentWord = (sentence.taggedWords[i].token === parameter1)
  if (i < sentence.taggedWords.length - 2) {
    twoWordsAfter = (sentence.taggedWords[i + 2].token === parameter2)
  }
  return (currentWord && twoWordsAfter)
}

function prevWordIs (sentence, i, parameter) {
  if (i > 0) {
    return (sentence.taggedWords[i - 1].token.toLowerCase() === parameter.toLowerCase())
  } else {
    return (false)
  }
}

// Returns the right value for parameter 1 of prevWordIs
function prevWordParameterValues (sentence, i) {
  if (i > 0) {
    return [sentence.taggedWords[i - 1].token]
  } else {
    return []
  }
}

function prev1Or2WordIs (sentence, i, parameter) {
  let prev1 = false
  let prev2 = false
  if (i > 0) {
    prev1 = (sentence.taggedWords[i - 1].token.toLowerCase() === parameter.toLowerCase())
  }
  if (i > 1) {
    prev2 = (sentence.taggedWords[i - 2].token.toLowerCase() === parameter.toLowerCase())
  }
  return (prev1 || prev2)
}

function prev1Or2WordParameterValues (sentence, i) {
  const values = []
  if (i > 0) {
    values.push(sentence[i - 1].token)
  }
  if (i > 1) {
    values.push(sentence[i - 2].token)
  }
  return values
}

// Indicates whether or not this string ends with the specified string.
// Adapted from the original Javascript Brill tagger
function currentWordEndsWith (sentence, i, parameter) {
  const word = sentence.taggedWords[i].token
  if (!parameter || (parameter.length > word.length)) {
    return false
  }
  return (word.indexOf(parameter) === (word.length - parameter.length))
}

// sentence is an array of token records
function currentWordEndsWithParameterValues (sentence, i) {
  const values = ['ing']

  return values
}

function rightBigramIs (sentence, i, parameter1, parameter2) {
  const word1 = (sentence.taggedWords[i].token === parameter1)
  let word2 = false
  if (i < sentence.taggedWords.length - 1) {
    word2 = (sentence.taggedWords[i + 1].token === parameter2)
  }
  return (word1 && word2)
}

function leftBigramIs (sentence, i, parameter1, parameter2) {
  let word1 = false
  const word2 = (sentence.taggedWords[i].token === parameter2)
  if (i > 0) {
    word1 = (sentence.taggedWords[i - 1].token === parameter1)
  }
  return (word1 && word2)
}

function nextBigramIs (sentence, i, parameter1, parameter2) {
  let word1 = false
  let word2 = false
  if (i < sentence.taggedWords.length - 1) {
    word1 = (sentence.taggedWords[i + 1].token === parameter1)
  }
  if (i < sentence.taggedWords.length - 2) {
    word2 = (sentence.taggedWords[i + 2].token === parameter2)
  }
  return (word1 && word2)
}

function twoWordAfterParameterValues (sentence, i) {
  if (i < sentence.taggedWords.length - 2) {
    return [sentence.taggedWords[i + 2].token]
  } else {
    return []
  }
}

function prevBigramIs (sentence, i, parameter1, parameter2) {
  let word1 = false
  let word2 = false
  if (i > 1) {
    word1 = (sentence.taggedWords[i - 2].token === parameter1)
  }
  if (i > 0) {
    word2 = (sentence.taggedWords[i - 1].token === parameter2)
  }
  return (word1 && word2)
}

function twoWordBeforeParameterValues (sentence, i) {
  if (i > 1) {
    return [sentence.taggedWords[i - 2].token]
  } else {
    return []
  }
}

function next1Or2WordIs (sentence, i, parameter1, parameter2) {
  let next1 = false
  let next2 = false
  if (i < sentence.taggedWords.length - 1) {
    next1 = (sentence.taggedWords[i + 1].token === parameter1)
  }
  if (i < sentence.taggedWords.length - 2) {
    next2 = (sentence.taggedWords[i + 2].token === parameter2)
  }
  return (next1 || next2)
}

function next1Or2WordParameterValues (sentence, i) {
  const values = []
  if (i < sentence.taggedWords.length - 1) {
    values.push(sentence.taggedWords[i + 1].token)
  }
  if (i < sentence.taggedWords.length - 2) {
    values.push(sentence.taggedWords[i + 2].token)
  }
  return values
}

// ==================================
// Predicates about tags
// ==================================
function nextTagIs (sentence, i, parameter) {
  if (i < sentence.taggedWords.length - 1) {
    return (sentence.taggedWords[i + 1].tag === parameter)
  } else {
    return (false)
  }
}

function nextTagParameterValues (sentence, i) {
  if (i < sentence.taggedWords.length - 1) {
    return [sentence.taggedWords[i + 1].tag]
  } else {
    return []
  }
}

function next2TagIs (sentence, i, parameter) {
  if (i < sentence.taggedWords.length - 2) {
    return (sentence.taggedWords[i + 2].tag === parameter)
  } else {
    return (false)
  }
}

function next2TagParameterValues (sentence, i) {
  if (i < sentence.taggedWords.length - 2) {
    return [sentence.taggedWords[i + 2].tag]
  } else {
    return []
  }
}

function next1Or2TagIs (sentence, i, parameter) {
  let next1 = false
  let next2 = false
  if (i < sentence.taggedWords.length - 1) {
    next1 = (sentence.taggedWords[i + 1].tag === parameter)
  }
  if (i < sentence.taggedWords.length - 2) {
    next2 = (sentence.taggedWords[i + 2].tag === parameter)
  }
  return (next1 || next2)
}

function next1Or2TagIsParameterValues (sentence, i) {
  const values = []
  if (i < sentence.taggedWords.length - 1) {
    values.push(sentence.taggedWords[i + 1].tag)
  }
  if (i < sentence.taggedWords.length - 2) {
    values.push(sentence.taggedWords[i + 2].tag)
  }
  return values
}

function next1Or2Or3Tag (sentence, i, parameter) {
  let next3 = false
  if (i < sentence.taggedWords.length - 3) {
    next3 = (sentence.taggedWords[i + 3].tag === parameter)
  }
  return (next1Or2TagIs(sentence, i, parameter) || next3)
}

function next1Or2Or3TagParameterValues (sentence, i) {
  const values = next1Or2TagIsParameterValues(sentence, i)
  if (i < sentence.taggedWords.length - 3) {
    values.push(sentence.taggedWords[i + 3].tag)
  }
  return values
}

function surroundedByTags (sentence, i, parameter1, parameter2) {
  if (i < sentence.taggedWords.length - 1) {
    // check next tag
    if (sentence.taggedWords[i + 1].tag === parameter2) {
      // check previous tag
      if (i > 0) {
        return (sentence.taggedWords[i - 1].tag === parameter1)
      } else {
        return (false)
      }
    } else {
      return (false)
    }
  } else {
    return (false)
  }
}

function prev1Or2Or3Tag (sentence, i, parameter) {
  let prev3 = null
  if (i > 2) {
    prev3 = sentence.taggedWords[i - 3].tag
  }
  return (prev1Or2Tag(sentence, i, parameter) || (prev3 === parameter))
}

function prev1Or2Or3TagParameterValues (sentence, i) {
  const values = prev1Or2TagParameterValues(sentence, i)
  if (i > 2) {
    values.push(sentence.taggedWords[i - 3].tag)
  }
  return values
}

function prev1Or2Tag (sentence, i, parameter) {
  let prev1 = null
  if (i > 0) {
    prev1 = sentence.taggedWords[i - 1].tag
  }
  let prev2 = null
  if (i > 1) {
    prev2 = sentence.taggedWords[i - 2].tag
  }
  return ((prev1 === parameter) || (prev2 === parameter))
}

function prev1Or2TagParameterValues (sentence, i) {
  const values = []
  if (i > 0) {
    values.push(sentence.taggedWords[i - 1].tag)
  }
  if (i > 1) {
    values.push(sentence.taggedWords[i - 2].tag)
  }
  return values
}

function prevTagIs (sentence, i, parameter) {
  let prev = false
  if (i > 0) {
    prev = (sentence.taggedWords[i - 1].tag === parameter)
  }
  return (prev)
}

function prevTagParameterValues (sentence, i) {
  if (i > 0) {
    return [sentence.taggedWords[i - 1].tag]
  } else {
    return []
  }
}

// Looks like a useless predicate because transformation already take the
// current tag into account
/*
function currentWordIsTag (sentence, i, parameter) {
  return (sentence.taggedWords[i].tag === parameter)
}
*/

function prev2TagIs (sentence, i, parameter) {
  let prev2 = false
  if (i > 1) {
    prev2 = (sentence.taggedWords[i - 2].tag === parameter)
  }
  return (prev2)
}

function defaultPredicate (sentence, i, parameter) {
  return (false)
}

module.exports = ruleTemplates
