
const vowels = "aeiouè";

function isVowel(x) {
    return vowels.indexOf(x) > -1;
}

class PorterStemmer extends Stemmer {
  constructor() {
    this.debug = true;
  }


  replaceAccentedCharacters(word) {
    var accentedCharactersMapping = {
      "ä": "a",
      "ë": "e",
      "ï": "i",
      "ö": "o",
      "ü": "u",
      "á": "a",
      "é": "e",
      "í": "i",
      "ó": "o",
      "ú": "u"
    }
    var result = word;
    for (var x in accentedCharactersMapping) {
        result = result.replace(new RegExp(x, 'g'), accentedCharactersMapping[x]);
    }
    if (this.debug) {
      console.log("replaceAccentedCharacters: " + result);
    }
    return result;
  }


  //Put initial y, y after a vowel, and i between vowels into upper case.
  handleYI(word) {
    // Initial y
    var result = word.replace(/^y/, "Y");
    if (this.debug) {
      console.log("handleYI: initial y: " + result);
    }
    // y after vowel
   result = result.replace(/[aeioué]y/g, "Y");
    if (this.debug) {
      console.log("handleYI: y after vowel: " + result);
    }
    // i between vowels
    var result = result.replace(/[aeioué]i[aeioué]/g, "I");
    if (this.debug) {
      console.log("handleYI: i between vowels:" + result);
    }
    return result;
  }


  // Determines R1 and R2; adapted from the French Porter Stemmer
  regions(token) {
    var r1, r2, len;
    var i;

    r1 = r2 = len = token.length;

    // R1 is the region after the first non-vowel following a vowel,
    for (var i = 0; i < len - 1 && r1 == len; i++) {
      if (isVowel(token[i]) && !isVowel(token[i + 1])) {
        r1 = i + 2;
      }
    }
    // Or is the null region at the end of the word if there is no such non-vowel.

    // R1 is adjusted such that the region before it contains at least 3 characters
    if (r1 != len) {
      // R1 is not null
      if (r1 < 3) {
        // Region before does not contain at least 3 characters
        if (len > 3) {
          r1 = 3;
          // Now R1 contains at least 3 characters
        }
        else {
          // It is not possible to make the region before long enough
          r1 = len;
        }
      }
    }

    // R2 is the region after the first non-vowel following a vowel in R1
    for (i = r1; i < len - 1 && r2 == len; i++) {
      if (isVowel(token[i]) && !isVowel(token[i + 1])) {
        r2 = i + 2;
      }
    }
    // Or is the null region at the end of the word if there is no such non-vowel.

    if (this.debug) {
      console.log("Regions r1 = " + this.r1 + "\nr2 = " + this.r2);
    }

    this.r1 = r1;
    this.r2 = r2;
  }


  prelude(word) {
    var result = replaceAccentedCharacters(word);
    result = handleYI(result);
    this.regions(result);
    if (this.debug) {
      console.log("prelude": + result);
    }
    return result;
  }


  step1(word) {
    var result = word;
    // (a) heden => replace with heid if in R1
    if (word.indexOf("heden") > this.r1) {
      result = word.replace("heden", "heid");
    }
    if (this.debug) {
      console.log("step 1a: " + result);
    }

    // (b) en   ene => delete if in R1 and preceded by a valid en-ending, and then undouble the ending
    // Define a valid en-ending as a non-vowel, and not gem.
    // Define undoubling the ending as removing the last letter if the word ends kk, dd or tt.
    this.regions(result);
    var pos = result.indexOf("ene");
    var len = 3;
    if (pos == -1) {
      // try en
      var pos = result.indexOf("en");
      len = 2;
    }
    if (pos > -1 && pos >= this.r1) {
      // en or ene is in R1
      if (pos > 0 && !isVowel(result[pos - 1])) {
        if (pos > 2) {
          // check for gem
          if (result.substr(pos - 3, 3) !== "gem") {
            // delete
            result = result.substring(0, pos - 1) + result.substr(pos + len);
          }
        }
        else {
          // delete
          result = result.substring(0, pos - 1) + result.substr(pos + len);
        }
      }
    }
    // Undouble the ending
    if (result.substr(-2) == "kk" || result.substr(-2) == "tt" || result.substr(-2) == "dd") {
      result = result.substr(0, result.length - 1));
    }
    if (this.debug) {
      console.log("step 1b: " + result);
    }

    // (c) s   se => delete if in R1 and preceded by a valid s-ending
    // Define a valid s-ending as a non-vowel other than j.
    this.regions(result);
    var pos = result.indexOf("se");
    var len = 2;
    if (pos == -1) {
      // try en
      var pos = result.indexOf("s");
      len = 1;
    }
    if (pos > -1 && pos >= this.r1) {
      // in R1
      if (pos > 0 && !isVowel(result[pos - 1] && result[pos - 1] != "j") {
          // valid s-ending => delete
          result = result.substring(0, pos - 1) + result.substr(pos + len);
      }
    }

    if (this.debug) {
      console.log("step 1c: " + result);
    }
    return result;
  }


  // Delete suffix e if in R1 and preceded by a non-vowel, and then undouble the ending
  step2(word) {
    var result = word;
    this.regions(result);
    if (result[result.length - 1] == "e" && this.r1 < result.len) {
      if (result.length > 1 && !isVowel(result[result-length - 2])) {
        // Delete
        result = result.substr(0, result.length - 1);
        this.suffixeRemoved = true;
      }
    }

    // Undouble the ending
    if (result.substr(-2) == "kk" || result.substr(-2) == "tt" || result.substr(-2) == "dd") {
      result = result.substr(0, result.length - 1));
    }

    if (this.debug) {
      console.log("step2: " + result);
    }
    return result;
  }


  // Step 3a: heid => delete heid if in R2 and not preceded by c, and treat a preceding en as in step 1(b)
  step3a(word) {
    var result = word;
    this.regions(result);
    var pos = result.indexOf("heid");
    if (pos > -1 && pos >= this.r2) {
      // is in R2
      if (pos > 0 && result[pos - 1] != "c") {
        // Delete
        result = result.substring(0, pos - 1) + result.substr(pos + 4);
      }
    }
    if (this.debug) {
      console.log("step 3a phase 1: " + result);
    }

    // treat a preceding en as in step 1b
    this.regions(result);
    var pos = result.indexOf("en");
    var len = 2;
    if (pos > -1 && pos >= this.r1) {
      // en or ene is in R1
      if (pos > 0 && !isVowel(result[pos - 1])) {
        if (pos > 2) {
          // check for gem
          if (result.substr(pos - 3, 3) !== "gem") {
            // delete
            result = result.substring(0, pos - 1) + result.substr(pos + len);
          }
        }
        else {
          // delete
          result = result.substring(0, pos - 1) + result.substr(pos + len);
        }
      }
    }
    // Undouble the ending
    if (result.substr(-2) == "kk" || result.substr(-2) == "tt" || result.substr(-2) == "dd") {
      result = result.substr(0, result.length - 1));
    }

    if (this.debug) {
      console.log("step 3a phase 2: " + result);
    }
    return result;
  }

  // d suffixes: Search for the longest among the following suffixes, and perform the action indicated.
  step3b(word) {
    var result = word;

    // end   ing => delete if in R2; if preceded by ig, delete if in R2 and not preceded by e, otherwise undouble the ending
    this.regions(result);
    if ((result.substr(-3) == "end" || result.substr(-3) == "ing")
          && result.length - 3 >= this.r2) {
      // Check for ig
      if ((result.substr(-5) == "igend" || result.substr(-5) == "iging")
            && result.length - 5 >= this.r2 && result[result.length - 6] != "e") {
        // Delete igend
        result = result.substr(0, result.length - 5);
      }
      else {
        // Delete end
        result = result.substr(0, result.length - 3);
        // Undouble the ending
        if (result.substr(-2) == "kk" || result.substr(-2) == "tt" || result.substr(-2) == "dd") {
          result = result.substr(0, result.length - 1));
        }
      }
    }

    // ig => delete if in R2 and not preceded by e
    this.regions();

    // lijk => delete if in R2, and then repeat step 2

    // baar => delete if in R2

    // bar => delete if in R2 and if step 2 actually removed an e

    if (this.debug) {
      console.log("step 3b: " + result);
    }
    return result;
  }

  // undouble vowel => If the words ends CVD, where C is a non-vowel,
  // D is a non-vowel other than I, and V is double a, e, o or u,
  // remove one of the vowels from V (for example, maan -> man, brood -> brod)
  step4(word) {

    if (this.debug) {
      console.log(result);
    }
    return result;
  }

  postlude(word) {

  }

  stem(word) {
    return postlude(step4(step3b(step3a(step2(step1(prelude(word))))));
  }
}
