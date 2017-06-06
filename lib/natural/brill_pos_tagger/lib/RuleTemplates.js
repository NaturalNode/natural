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

var ruleTemplates = {
  // Predicates as used in the English rules in data/English/tr_from_posjs.txt
  "NEXT-TAG": {
    // maps to the predicate function
    "function": next_tag_is,
    // Minimum required space before or after current position to be a relevant predicate
    "window": [0, 1],
    // The number of parameters the predicate takes
    "nrParameters": 1,
    // Function that returns relevant values for parameter 1
    "parameter1Values": nextTagParameterValues
  },
  "NEXT-WORD-IS-CAP": {
    "function": next_word_is_cap,
    "window": [0, 1],
    "nrParameters" : 0
  },
  "PREV-1-OR-2-OR-3-TAG": {
    "function": prev_1_or_2_or_3_tag,
    "window" : [-1, 0],
    "nrParameters" : 1,
    "parameter1Values": prev1Or2Or3TagParameterValues
  },
  "PREV-1-OR-2-TAG": {
    "function": prev_1_or_2_tag,
    "window": [-1, 0],
    "nrParameters": 1,
    "parameter1Values": prev1Or2TagParameterValues
  },
  "NEXT-WORD-IS-TAG": {
    "function": next_tag_is,
    "window": [0, 1],
    "nrParameters": 1,
    "parameter1Values": nextTagParameterValues
  },
  "PREV-TAG": {
    "function": prev_tag_is,
    "window": [-1, 0],
    "nrParameters": 1,
    "parameter1Values": prevTagParameterValues
  },
  /*
 "CURRENT-WORD-IS-TAG": {
   "function": current_word_is_tag,
   "window": [0],
   "nrParameter": 1,
   "parameter1Values": currentTagParameterValues
   },
  */
  "PREV-WORD-IS-CAP": {
    "function": prev_word_is_cap,
    "window": [-1, 0],
    "nrParameters": 0
  },
  "CURRENT-WORD-IS-CAP": {
    "function": current_word_is_cap,
    "window": [0, 0],
    "nrParameters": 0
  },
  "CURRENT-WORD-IS-NUMBER": {
    "function": current_word_is_number,
    "window": [0, 0],
    "nrParameters": 0
  },
  "CURRENT-WORD-IS-URL": {
    "function": current_word_is_url,
    "window": [0, 0],
    "nrParameters": 0
  },
  "CURRENT-WORD-ENDS-WITH": {
    "function": current_word_ends_with,
    "window": [0, 0],
    "nrParameters": 1,
    "parameter1Values": currentWordEndsWithParameterValues
  },
  "PREV-WORD-IS": {
    "function": prev_word_is,
    "window": [-1, 0],
    "nrParameters": 1,
    "parameter1Values": prevWordParameterValues
  },

  // Predicates as used in the Dutch rules in data/Dutch/brill_CONTEXTRULES.jg
  "PREVTAG": {
    "function": prev_tag_is,
    "window": [-1, 0],
    "nrParameters": 1,
    "parameter1Values": prevTagParameterValues
  },
  "NEXT1OR2TAG": {
    "function": next_1_or_2_tag_is,
    "window": [0, 1],
    "nrParameters": 1,
    "parameter1Values": next1Or2TagIsParameterValues
  },
  "NEXTTAG": {
    "function": next_tag_is,
    "window": [0, 1],
    "nrParameters": 1,
    "parameter1Values": nextTagParameterValues
  },
  "PREV1OR2TAG": {
    "function": prev_1_or_2_tag,
    "window": [-1, 0],
    "nrParameters": 1,
    "parameter1Values": prev1Or2TagParameterValues
  },
  "WDAND2TAGAFT": {
    "function": current_word_and_2_tag_after_are,
    "window": [0, 2],
    "nrParameters": 2,
    "parameter1Values": currentWordParameterValues,
    "parameter2Values": twoTagAfterParameterValues
  },
  "NEXT1OR2OR3TAG": {
    "function": next_1_or_2_or_3_tag,
    // Minimum required window to apply this template is one tag to the right
    "window": [0, 1],
    "nrParameters": 1,
    "parameter1Values": next1Or2Or3TagParameterValues
  },
  "CURWD": {
    "function": current_word_is,
    "window": [0, 0],
    "nrParameters": 1,
    "parameter1Values": currentWordParameterValues
  },
  "SURROUNDTAG": {
    "function": surrounded_by_tags,
    "window": [-1, 1],
    "nrParameters": 2,
    "parameter1Values": prevTagParameterValues,
    "parameter2Values": nextTagParameterValues
  },
  "PREV1OR2OR3TAG": {
    "function": prev_1_or_2_or_3_tag,
    // Minimum required window to apply this template is one tag to the left
    "window": [-1, 0],
    "nrParameters": 1,
    "parameter1Values": prev1Or2Or3TagParameterValues
  },
  "WDNEXTTAG": {
    "function": current_word_and_next_tag_are,
    "window": [0, 1],
    "nrParameters": 2,
    "parameter1Values": currentWordParameterValues,
    "parameter2Values": nextTagParameterValues
  },
  "PREV1OR2WD": {
    "function": prev_1_or_2_word_is,
    "window": [-1, 0],
    "nrParameters": 1,
    "parameter1Values": prev1Or2WordParameterValues
  },
  "NEXTWD": {
    "function": next_word_is,
    "window": [0, 1],
    "nrParameters": 1,
    "parameter1Values": nextWordParameterValues
  },
  "PREVWD": {
    "function": prev_word_is,
    "window": [-1, 0],
    "nrParameters": 1,
    "parameter1Values": prevWordParameterValues
  },
  "NEXT2TAG": {
    "function": next_2_tag_is,
    "window": [0, 2],
    "nrParameters": 1,
    "parameter1Values": next2TagParameterValues
  },
  "WDAND2TAGBFR": {
    "function": current_word_and_2_tag_before_are,
    "window": [-2, 0],
    "nrParameters": 2,
    "parameter1Values": currentWordParameterValues,
    "parameter2Values": twoTagBeforeParameterValues
  },
  "WDAND2AFT": {
    "function": current_word_and_2_after_are,
    "window": [0, 2],
    "nrParameters": 2,
    "parameter1Values": currentWordParameterValues,
    "parameter2Values": twoTagAfterParameterValues
  },
  "WDPREVTAG": {
    "function": current_word_and_prev_tag_are,
    "window": [-1, 0],
    "nrParameters": 2,
    "parameter1Values": currentWordParameterValues,
    "parameter2Values": prevTagParameterValues
  },
  "RBIGRAM": {
    "function": right_bigram_is,
    "window": [0, 1],
    "nrParameters": 2,
    "parameter1Values": currentWordParameterValues,
    "parameter2Values": nextWordParameterValues
  },
  "LBIGRAM": {
    "function": left_bigram_is,
    "window": [-1, 0],
    "nrParameters": 2,
    "parameter1Values": prevWordParameterValues,
    "parameter2Values": currentWordParameterValues
  },
  "NEXTBIGRAM": {
    "function": next_bigram_is,
    "window": [0, 2],
    "nrParameters": 2,
    "parameter1Values": nextWordParameterValues,
    "parameter2Values": twoWordAfterParameterValues
  },
  "PREVBIGRAM": {
    "function": prev_bigram_is,
    "window": [-2, 0],
    "nrParameters": 2,
    "parameter1Values": twoWordBeforeParameterValues,
    "parameter2Values": prevWordParameterValues
  },
  "PREV2TAG": {
    "function": prev_2_tag_is,
    "window": [-2, 0],
    "nrParameters": 2,
    "parameter1Values": twoTagBeforeParameterValues,
    "parameter2Values": prevTagParameterValues
  },
  "NEXT1OR2WD": {
    "function": next_1_or_2_word_is,
    "window": [0, 1],
    "nrParameters": 1,
    "parameter1Values": next1Or2WordParameterValues
  },
  "DEFAULT": {
    "function": default_predicate,
    "window": [0, 0],
    "nrParameters": 0
  }
};


// ==================================
// Predicates that start with words
// ==================================
function next_word_is_cap(tagged_sentence, i, parameter) {
  if (i < tagged_sentence.length - 1) {
    var next_word = tagged_sentence[i+1][0];
    return(next_word[0] === next_word[0].toUpperCase());
  }
  else {
    return(false);
  }
}

/*
function next_word_is_cap(sentence, i, parameter) {
  if (i < sentence.length - 1) {
    var next_word = tagged_sentence[i+1].token;
    return(next_word[0] === next_word[0].toUpperCase());
  }
  else {
    return(false);
  }
}
*/

function next_word_is(tagged_sentence, i, parameter) {
  if (i < tagged_sentence.length - 1) {
    return(tagged_sentence[i + 1][0] === parameter);
  }
}

function nextWordParameterValues(sentence, i) {
  if (i < sentence.length - 1) {
    return [sentence[i + 1].token];
  }
  else {
    return [];
  }
}

function prev_word_is_cap(tagged_sentence, i, parameter) {
  var prev_word = null;
  if (i > 0) {
    prev_word = tagged_sentence[i-1][0];
    return(prev_word[0] === prev_word[0].toUpperCase());
  }
  return(false);
}

function current_word_is_cap(tagged_sentence, i, parameter) {
  var current_word = tagged_sentence[i][0];
  return(current_word[0] === current_word[0].toUpperCase());
}

function currentWordParameterValues(sentence, i) {
  return [sentence[i].token];
}

function current_word_is(tagged_sentence, i, parameter) {
  return(tagged_sentence[i][0] === parameter);
}

function isNumeric(num) {
  return (!isNaN(num));
}

function current_word_is_number(tagged_sentence, i, parameter) {
  var is_number = isNumeric(tagged_sentence[i][0]);
  // Attempt to parse it as a float
  if (!is_number) {
    is_number = parseFloat(tagged_sentence[i][0]);
  }
  return((parameter === "YES") ? is_number : !is_number);
}

// Checks if the current word is a url
// Adapted from the original Javascript Brill tagger
function current_word_is_url(tagged_sentence, i, parameter) {
  var is_url = false;
  if (tagged_sentence[i][0].indexOf(".") > -1) {
    // url if there are two contiguous alpha characters
    if (/[a-zA-Z]{2}/.test(tagged_sentence[i][0])) {
      is_url = true;
    }
  }
  return((parameter === "YES") ? is_url : !is_url);
}

function current_word_and_2_tag_after_are(tagged_sentence, i, parameter1, parameter2) {
  if (i < tagged_sentence.length - 2) {
    if (tagged_sentence[i+2][1] === parameter2) {
      return(tagged_sentence[i][0] === parameter1);
    }
    else {
      return(false);
    }
  }
  else {
    return(false);
  }
}

function twoTagAfterParameterValues(sentence, i) {
  if (i < sentence.length - 2) {
    return [sentence[i + 2].tag];
  }
  else {
    return [];
  }
}

function current_word_and_next_tag_are(tagged_sentence, i, parameter1, parameter2) {
  var next_tag = false;
  // check current word
  var current_word = (tagged_sentence[i][0] === parameter1);
  // check next tag
  if (i < tagged_sentence.length - 1) {
    next_tag = (tagged_sentence[i+1][1] === parameter2);
  }
  return(current_word && next_tag);
}

function current_word_and_prev_tag_are(tagged_sentence, i, parameter1, parameter2) {
  var prev_tag = false;
  // check current word
  var current_word = (tagged_sentence[i][0] === parameter2);
  // check prev tag
  if (i > 0) {
    prev_tag = (tagged_sentence[i-1][1] === parameter1);
  }
  return(current_word && prev_tag);
}

function current_word_and_2_tag_before_are(tagged_sentence, i, parameter1, parameter2) {
  var two_tags_before = false;
  // check current word
  var current_word = (tagged_sentence[i][0] === parameter2);
  if (i > 1) {
    // check two tags before
    two_tags_before = (tagged_sentence[i-2][1] === parameter1);
  }
  return(current_word && two_tags_before);
}

function twoTagBeforeParameterValues(sentence, i) {
  if (i > 1) {
    return [sentence[i - 2].tag];
  }
  else {
    return [];
  }
}

function current_word_and_2_after_are(tagged_sentence, i, parameter1, parameter2) {
  var two_words_after = false;
  // check current word
  var current_word = (tagged_sentence[i][0] === parameter1);
  if (i < tagged_sentence - 2) {
    two_words_after = (tagged_sentence[i+2][0] === parameter2);
  }
  return(current_word && two_words_after);
}

function prev_word_is(tagged_sentence, i, parameter) {
  if (i > 0) {
    return(tagged_sentence[i-1][0].toLowerCase() === parameter.toLowerCase());
  }
  else {
    return(false);
  }
}

// Returns the right value for parameter 1 of prev_word_is
function prevWordParameterValues(sentence, i) {
  if (i > 0) {
    return [sentence[i - 1].token];
  }
  else {
    return [];
  }
}

function prev_1_or_2_word_is(tagged_sentence, i, parameter) {
  var prev_1 = false;
  var prev_2 = false;
  if (i > 0) {
    prev_1 = (tagged_sentence[i-1][0].toLowerCase() === parameter.toLowerCase());
  }
  if (i > 1) {
    prev_2 = (tagged_sentence[i-2][0].toLowerCase() === parameter.toLowerCase());
  }
  return(prev_1 || prev_2);
}

function prev1Or2WordParameterValues(sentence, i) {
  var values = [];
  if (i > 0) {
    values.push(sentence[i - 1].token);
  }
  if (i > 1) {
    values.push(sentence[i - 2].token);
  }
  return values;
}

// Indicates whether or not this string ends with the specified string.
// Adapted from the original Javascript Brill tagger
function current_word_ends_with(tagged_sentence, i, parameter) {
  var word = tagged_sentence[i][0];
  if (!parameter || (parameter.length > word.length)) {
    return false;
  }
  return(word.indexOf(parameter) === (word.length - parameter.length));
}

// sentence is an array of token records
function currentWordEndsWithParameterValues(sentence, i) {
  var values = ["ing"];

  return values;
}

function right_bigram_is(tagged_sentence, i, parameter1, parameter2) {
  var word_1 = (tagged_sentence[i][0] === parameter1);
  var word_2 = false;
  if (i < tagged_sentence.length - 1) {
    word_2 = (tagged_sentence[i+1][0] === parameter2);
  }
  return(word_1 && word_2);
}

function left_bigram_is(tagged_sentence, i, parameter1, parameter2) {
  var word_1 = false;
  var word_2 = (tagged_sentence[i][0] === parameter2);
  if (i > 0) {
    word_1 = (tagged_sentence[i-1][0] === parameter1);
  }
  return(word_1 && word_2);
}

function next_bigram_is(tagged_sentence, i, parameter1, parameter2) {
  var word_1 = false;
  var word_2 = false;
  if (i < tagged_sentence.length - 1) {
    word_1 = (tagged_sentence[i+1][0] === parameter1);
  }
  if (i < tagged_sentence.length - 2) {
    word_2 = (tagged_sentence[i+2][0] === parameter2);
  }
  return(word_1 && word_2);
}

function twoWordAfterParameterValues(sentence, i) {
  if (i < sentence.length - 2) {
    return [sentence[i + 2].token];
  }
  else {
    return [];
  }
}

function prev_bigram_is(tagged_sentence, i, parameter1, parameter2) {
  var word_1 = false;
  var word_2 = false;
  if (i >  1) {
    word_1 = (tagged_sentence[i-2][0] === parameter1);
  }
  if (i > 0) {
    word_2 = (tagged_sentence[i-1][0] === parameter2);
  }
  return(word_1 && word_2);
}

function twoWordBeforeParameterValues(sentence, i) {
  if (i >  1) {
    return [sentence[i - 2].token];
  }
  else {
    return [];
  }
}

function next_1_or_2_word_is(tagged_sentence, i, parameter1, parameter2) {
  next_1 = false;
  next_2 = false;
  if (i < tagged_sentence.length - 1) {
    next_1 = (tagged_sentence[i+1][0] === parameter1);
  }
  if (i < tagged_sentence.length - 2) {
    next_2 = (tagged_sentence[i+2][0] === parameter2);
  }
  return(next_1 || next_2);
}

function next1Or2WordParameterValues(sentence, i) {
  var values = [];
  if (i < sentence.length - 1) {
    values.push(sentence[i + 1].token);
  }
  if (i < sentence.length - 2) {
    values.push(sentence[i + 2].token);
  }
  return values;
}

// ==================================
// Predicates about tags
// ==================================
function next_tag_is(tagged_sentence, i, parameter) {
  if (i < tagged_sentence.length - 1) {
    return(tagged_sentence[i+1][1] === parameter);
  }
  else {
    return(false);
  }
}

function nextTagParameterValues(sentence, i) {
  if (i < sentence.length - 1) {
    return [sentence[i + 1].tag];
  }
  else {
    return [];
  }
}

function next_2_tag_is(tagged_sentence, i, parameter) {
  if (i < tagged_sentence.length - 2) {
    return(tagged_sentence[i+2][1] === parameter);
  }
  else {
    return(false);
  }
}

function next2TagParameterValues(sentence, i) {
  if (i < sentence.length - 2) {
    return [sentence[i+2].tag];
  }
  else {
    return [];
  }
}

function next_1_or_2_tag_is(tagged_sentence, i, parameter) {
  var next_1 = false;
  var next_2 = false;
  if (i < tagged_sentence.length - 1) {
    next_1 = (tagged_sentence[i+1][1] === parameter);
  }
  if (i < tagged_sentence.length - 2) {
    next_2 = (tagged_sentence[i+2][1] === parameter);
  }
  return(next_1 || next_2);
}

function next1Or2TagIsParameterValues(sentence, i) {
  var values = [];
  if (i < sentence.length - 1) {
    values.push(sentence[i + 1].tag);
  }
  if (i < sentence.length - 2) {
    values.push(sentence[i + 2].tag);
  }
  return values;
}

function next_1_or_2_or_3_tag(tagged_sentence, i, parameter) {
  var next_1 = false;
  var next_2 = false;
  var next_3 = false;
  if (i < tagged_sentence.length - 1) {
    next_1 = (tagged_sentence[i+1][1] === parameter);
  }
  if (i < tagged_sentence.length - 2) {
    next_2 = (tagged_sentence[i+2][1] === parameter);
  }
  if (i < tagged_sentence.length - 3) {
    next_3 = (tagged_sentence[i+3][1] === parameter);
  }
  return(next_1 || next_2 || next_3);
}

function next1Or2Or3TagParameterValues(sentence, i) {
  var values = [];
  if (i < sentence.length - 1) {
    values.push(sentence[i + 1].tag);
  }
  if (i < sentence.length - 2) {
    values.push(sentence[i + 2].tag);
  }
  if (i < sentence.length - 3) {
    values.push(sentence[i + 3].tag);
  }
  return values;
}

function surrounded_by_tags(tagged_sentence, i, parameter1, parameter2) {
  if (i < tagged_sentence.length - 1) {
    // check next tag
    if (tagged_sentence[i+1][1] === parameter2) {
      // check previous tag
      if (i > 0) {
        return(tagged_sentence[i-1][1] === parameter1)
      }
      else {
        return(false);
      }
    }
    else {
      return(false);
    }
  }
  else {
    return(false);
  }
}

function prev_1_or_2_or_3_tag(tagged_sentence, i, parameter) {
  var prev_1 = null;
  if (i > 0) {
    prev_1 = tagged_sentence[i-1][1];
  }
  var prev_2 = null;
  if (i > 1) {
    prev_2 = tagged_sentence[i-2][1];
  }
  var prev_3 = null;
  if (i > 2) {
    prev_3 = tagged_sentence[i-3][1];
  }
  return((prev_1 === parameter) || (prev_2 === parameter) || (prev_3 === parameter));
}

function prev1Or2Or3TagParameterValues(sentence, i) {
  var values = [];
  if (i > 0) {
    values.push(sentence[i - 1].tag);
  }
  if (i > 1) {
    values.push(sentence[i - 2].tag);
  }
  if (i > 2) {
    values.push(sentence[i - 3].tag);
  }
  return values;
}

function prev_1_or_2_tag(tagged_sentence, i, parameter) {
  var prev_1 = null;
  if (i > 0) {
    prev_1 = tagged_sentence[i-1][1];
  }
  var prev_2 = null;
  if (i > 1) {
    prev_2 = tagged_sentence[i-2][1];
  }
  return((prev_1 === parameter) || (prev_2 === parameter));
}

function prev1Or2TagParameterValues(sentence, i) {
  values = [];
  if (i > 0) {
    values.push(sentence[i - 1].tag);
  }
  if (i > 1) {
    values.push(sentence[i - 2].tag);
  }
  return values;
}

function prev_tag_is(tagged_sentence, i, parameter) {
  var prev = false;
  if (i > 0) {
    prev = (tagged_sentence[i-1][1] === parameter);
  }
  return(prev);
}

function prevTagParameterValues(sentence, i) {
  if (i > 0) {
    return [sentence[i - 1].tag];
  }
  else {
    return [];
  }
}

// Looks like a useless predicate because transformation already take the
// current tag into account
function current_word_is_tag(tagged_sentence, i, parameter) {
  return(tagged_sentence[i][1] === parameter);
}

function prev_2_tag_is(tagged_sentence, i, parameter) {
  var prev_2 = false;
  if (i > 1) {
    prev_2 = (tagged_sentence[i-2][1] === parameter);
  }
  return(prev_2);
}

function default_predicate(tagged_sentence, i, parameter) {
  return(false);
}

module.exports = ruleTemplates;
