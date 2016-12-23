/*
    Predicates for the Brill tagger
    Copyright (C) 2015 Hugo W.L. ter Doest

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

var predicates = {
    // Predicates as used in the English rules in data/English/tr_from_posjs.txt
    "NEXT-TAG": next_tag_is,
    "NEXT-WORD-IS-CAP": next_word_is_cap,
    "PREV-1-OR-2-OR-3-TAG": prev_1_or_2_or_3_tag,
    "PREV-1-OR-2-TAG": prev_1_or_2_tag,
    "NEXT-WORD-IS-TAG": next_tag_is,
    "PREV-TAG": prev_tag_is,
    "CURRENT-WORD-IS-TAG": current_word_is_tag,
    "PREV-WORD-IS-CAP": prev_word_is_cap,
    "CURRENT-WORD-IS-CAP": current_word_is_cap,
    "CURRENT-WORD-IS-NUMBER": current_word_is_number,
    "CURRENT-WORD-IS-URL": current_word_is_url,
    "CURRENT-WORD-ENDS-WITH": current_word_ends_with,
    "PREV-WORD-IS": prev_word_is,
    // Predicates as used in the Dutch rules in data/Dutch/brill_CONTEXTRULES.jg
    "PREVTAG": prev_tag_is,
    "NEXT1OR2TAG": next_1_or_2_tag_is,
    "NEXTTAG": next_tag_is,
    "PREV1OR2TAG": prev_1_or_2_tag,
    "WDAND2TAGAFT": current_word_and_2_tag_after_are,
    "NEXT1OR2OR3TAG": next_1_or_2_or_3_tag,
    "CURWD": current_word_is,
    "SURROUNDTAG": surrounded_by_tags,
    "PREV1OR2OR3TAG": prev_1_or_2_or_3_tag, 
    "WDNEXTTAG": current_word_and_next_tag_are,
    "PREV1OR2WD": prev_1_or_2_word_is,
    "NEXTWD": next_word_is,
    "PREVWD": prev_word_is,
    "NEXT2TAG": next_2_tag_is,
    "WDAND2TAGBFR": current_word_and_2_tag_before_are,
    "WDAND2AFT": current_word_and_2_after_are,
    "WDPREVTAG": current_word_and_prev_tag_are,
    "RBIGRAM": right_bigram_is,
    "LBIGRAM": left_bigram_is,
    "NEXTBIGRAM": next_bigram_is,
    "PREVBIGRAM": prev_bigram_is,
    "PREV2TAG": prev_2_tag_is,
    "NEXT1OR2WD": next_1_or_2_word_is
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

function next_word_is(tagged_sentence, i, parameter) {
  if (i < tagged_sentence.length - 1) {
    return(tagged_sentence[i+1][0] === parameter);
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
};

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
};

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
};

// Indicates whether or not this string ends with the specified string.
// Adapted from the original Javascript Brill tagger
function current_word_ends_with(tagged_sentence, i, parameter) {
  var word = tagged_sentence[i][0];
  if (!parameter || (parameter.length > word.length)) {
    return false;
  }
  return(word.indexOf(parameter) === (word.length - parameter.length));
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

function next_2_tag_is(tagged_sentence, i, parameter) {
  if (i < tagged_sentence.length - 2) {
    return(tagged_sentence[i+2][1] === parameter);
  }
  else {
    return(false);
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
    prev_3 = tagged_sentence[i-2][1];
  }
  return((prev_1 === parameter) || (prev_2 === parameter) || (prev_3 === parameter));
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

function prev_tag_is(tagged_sentence, i, parameter) {
  var prev = false;
  if (i > 0) {
    prev = (tagged_sentence[i-1][1] === parameter);
  }
  return(prev);
}

function current_word_is_tag(tagged_sentence, i, parameter) {
  return(tagged_sentence[i][0] === parameter);
}

function prev_2_tag_is(tagged_sentence, i, parameter) {
  var prev_2 = false;
  if (i > 1) {
    prev_2 = (tagged_sentence[i-2][1] === parameter);
  }
  return(prev_2);
}

function default_transformation_rule (tagged_sentence, i, parameter) {
  return(false);
}

function Predicate(name, parameter1, parameter2) {
  this.name = name;
  this.parameter1 = parameter1;
  if (parameter2) {
    this.parameter2 = parameter2;
  }
  this.function = predicates[name];
  if (!this.function) {
    this.predicate = default_transformation_rule;
    console.warn('Predicate constructor: predicate not found: ' + name + '; using default');
  }
  // console.log(this.name);
  // console.log(this.function);
}

Predicate.prototype.evaluate = function(tagged_sentence, position) {
  return(this.function(tagged_sentence, position, this.parameter1, this.parameter2));
};

module.exports = Predicate;