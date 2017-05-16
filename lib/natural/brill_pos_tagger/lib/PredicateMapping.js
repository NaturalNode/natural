/**
 * Created by hugo on 14-5-17.
 */

var PredicateMetadata = {
  // Predicates as used in the English rules in data/English/tr_from_posjs.txt
  "NEXT-TAG": {
    // maps to the predicate function
    "function": next_tag_is,
    // Minimum required space before or after current position to be a relevant predicate
    "window": [0, 1],
    // The number of parameters the predicate takes
    "nrParameters": 1,
    // Type of parameter 1
    "typeParameter1": "TAG"
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
    "typeParameter1": "TAG"
  },
  "PREV-1-OR-2-TAG": {
    "function": prev_1_or_2_tag,
    "window": [-1, 0],
    "nrParameters": 1,
    "typeParameter1": "TAG"
  },
  "NEXT-WORD-IS-TAG": {
    "function": next_tag_is,
    "window": [0, 1],
    "nrParameters": 1,
    "typeParameter1": "TAG"
  },
  "PREV-TAG": {
    "function": prev_tag_is,
    "window": [-1, 0],
    "nrParameters": 1,
    "typeParameter1": "TAG"
  },
  /*
   "CURRENT-WORD-IS-TAG": {
   "function": current_word_is_tag,
   "window": [0],
   "nrParameter": 1,
   },
   */
  "PREV-WORD-IS-CAP": {
    "function": prev_word_is_cap,
    "window": [-1, 0],
    "nrParameters": 0
  },
  "CURRENT-WORD-IS-CAP": {
    "function": current_word_is_cap,
    "window": [0],
    "nrParameters": 0
  },
  "CURRENT-WORD-IS-NUMBER": {
    "function": current_word_is_number,
    "window": [0],
    "nrParamaters": 0
  },
  "CURRENT-WORD-IS-URL": {
    "function": current_word_is_url,
    "window": [0],
    "nrParameters": 0
  },
  "CURRENT-WORD-ENDS-WITH": {
    "function": current_word_ends_with,
    "window": [0],
    "nrParameters": 1,
    "typeParameter1": "STRING"
  },
  "PREV-WORD-IS": {
    "function": prev_word_is,
    "window": [-1, 0],
    "nrParameters": 1,
    "typeParameter1": "STRING"
  },

  // Predicates as used in the Dutch rules in data/Dutch/brill_CONTEXTRULES.jg
  "PREVTAG": {
    "function": prev_tag_is,
    "window": [-1, 0],
    "nrParameters": 1,
    "typeParameter1": "TAG"
  },
  "NEXT1OR2TAG": {
    "function": next_1_or_2_tag_is,
    "window": [0, 1],
    "nrParameters": 1,
    "typeParameter1": "TAG"
  },
  "NEXTTAG": {
    "function": next_tag_is,
    "window": [0, 1],
    "nrParameters": 1,
    "typeParameter1": "TAG"
  },
  "PREV1OR2TAG": {
    "function": prev_1_or_2_tag,
    "window": [-1, 0],
    "nrParameters": 1,
    "typeParameter1": "TAG"
  },
  "WDAND2TAGAFT": {
    "function": current_word_and_2_tag_after_are,
    "window": [0, 2],
    "nrParameters": 2,
    "typeParameter1": "STRING",
    "typeParameter2": "TAG"
  },
  "NEXT1OR2OR3TAG": {
    "function": next_1_or_2_or_3_tag,
    "window": [0, 1],
    "nrParameters": 1,
    "typeParameter1": "TAG"
  },
  "CURWD": {
    "function": current_word_is,
    "window": [0],
    "nrParameters": 1,
    "typeParameter1": "STRING"
  },
  "SURROUNDTAG": {
    "function": surrounded_by_tags,
    "window": [-1, 1],
    "nrParameters": 2,
    "typeParameter1": "TAG",
    "typeParameter2": "TAG"
  },
  "PREV1OR2OR3TAG": {
    "function": prev_1_or_2_or_3_tag,
    "window": [-1, 0],
    "nrParameters": 1,
    "typeParameter1": "TAG"
  },
  "WDNEXTTAG": {
    "function": current_word_and_next_tag_are,
    "window": [0, 1],
    "nrParameters": 2,
    "typeParameter1": "STRING",
    "typeParameter2": "TAG"
  },
  "PREV1OR2WD": {
    "function": prev_1_or_2_word_is,
    "window": [-1, 0],
    "nrParameters": 1,
    "typeParameter1": "STRING"
  },
  "NEXTWD": {
    "function": next_word_is,
    "window": [0, 1],
    "nrParameters": 1,
    "typeParameter1": "STRING"
  },
  "PREVWD": {
    "function": prev_word_is,
    "window": [-1, 0],
    "nrParameters": 1,
    "typeParameter1": "STRING"
  },
  "NEXT2TAG": {
    "function": next_2_tag_is,
    "window": [0, 2],
    "nrParameters": 1,
    "typeParameter1": "TAG"
  },
  "WDAND2TAGBFR": {
    "function": current_word_and_2_tag_before_are,
    "window": [-2, 0],
    "nrParameters": 2,
    "typeParameter1": "STRING",
    "typeParameter2": "TAG"
  },
  "WDAND2AFT": {
    "function": current_word_and_2_after_are,
    "window": [0, 2],
    "nrParameters": 2,
    "typeParameter1": "STRING",
    "typeParameter2": "STRING"
  },
  "WDPREVTAG": {
    "function": current_word_and_prev_tag_are,
    "window": [-1, 0],
    "nrParameters": 2,
    "typeParameter1": "STRING",
    "typeParameter2": "TAG"
  },
  "RBIGRAM": {
    "function": right_bigram_is,
    "window": [0, 1],
    "nrParameters": 2,
    "typeParameter1": "STRING",
    "typeParameter2": "STRING"
  },
  "LBIGRAM": {
    "function": left_bigram_is,
    "window": [-1, 0],
    "nrParameters": 2,
    "typeParameter1": "STRING",
    "typeParameter2": "STRING"
  },
  "NEXTBIGRAM": {
    "function": next_bigram_is,
    "window": [0, 2],
    "nrParameters": 2,
    "typeParameter1": "STRING",
    "typeParameter2": "STRING"
  },
  "PREVBIGRAM": {
    "function": prev_bigram_is,
    "window": [-2, 0],
    "nrParameters": 2,
    "typeParameter1": "STRING",
    "typeParameter2": "STRING"
  },
  "PREV2TAG": {
    "function": prev_2_tag_is,
    "window": [-2, 0],
    "nrParameters": 2,
    "typeParameter1": "TAG",
    "typeParameter2": "TAG"
  },
  "NEXT1OR2WD": {
    "function": next_1_or_2_word_is,
    "window": [0, 1],
    "nrParameters": 1,
    "typeParameter1": "STRING"
  },
  "DEFAULT": {
    "function": default_predicate,
    "window": [0],
    "nrParameters": 1,
    "typeParameter1": "STRING"
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

/*
 function current_word_is_tag(tagged_sentence, i, parameter) {
 return(tagged_sentence[i][0] === parameter);
 }
 */

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

module.exports = PredicateMetadata;