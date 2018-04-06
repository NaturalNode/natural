/*
Copyright (c) 2018, Hugo W.L. ter Doest

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
 * Spec for the Dutch Porter Stemmer can be found at:
 * http://snowball.tartarus.org/algorithms/dutch/stemmer.html
 */

const DEBUG = true;
const vowels = "aeiouè";

function isVowel(x) {
    return vowels.indexOf(x) > -1;
}

// * Return longest matching suffixes for a token or '' if no suffix match
function endsinArr(token, suffixes) {
  var i, longest = '';
  for (i = 0; i < suffixes.length; i++) {
    if (endsin(token, suffixes[i]) && suffixes[i].length > longest.length)
      longest = suffixes[i];
  }

  if (DEBUG && longest != "") {
    console.log("Matched suffix: " + longest);
  }
  return longest;
}

// Returns true if token has suffix
function endsin(token, suffix) {
  if (token.length < suffix.length) return false;
  return (token.slice(-suffix.length) == suffix);
}

// Removes a suffix of len characters and returns the string
function removeSuffix(token, len) {
  return token.substr(0, token.length - len);
}

// Define undoubling the ending as removing the last letter if the word ends kk, dd or tt.
function undoubleEnding(token) {
  if (token.substr(-2) == "kk" || token.substr(-2) == "tt" || token.substr(-2) == "dd") {
      return token.substr(0, token.length - 1);
  }
  else {
    return token;
  }
}

class PorterStemmer /*extends Stemmer*/ {
  constructor() {

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
      result = result.replace(new RegExp(x, "g"), accentedCharactersMapping[x]);
    }
    if (DEBUG) {
      console.log("replaceAccentedCharacters: " + result);
    }
    return result;
  }


  //Put initial y, y after a vowel, and i between vowels into upper case.
  handleYI(word) {
    // Initial y
    var result = word.replace(/^y/, "Y");
    if (DEBUG) {
      console.log("handleYI: initial y: " + result);
    }
    // y after vowel
   result = result.replace(/[aeioué]y/g, "Y");
    if (DEBUG) {
      console.log("handleYI: y after vowel: " + result);
    }
    // i between vowels
    var result = result.replace(/[aeioué]i[aeioué]/g, "I");
    if (DEBUG) {
      console.log("handleYI: i between vowels:" + result);
    }
    return result;
  }


  // Determines R1 and R2; adapted from the French Porter Stemmer
  regions(token) {
    var r1, r2, len;

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

    if (DEBUG) {
      console.log("Regions r1 = " + r1 + " r2 = " + r2);
    }

    this.r1 = r1;
    this.r2 = r2;
  }


  prelude(word) {
    var result = this.replaceAccentedCharacters(word);
    result = this.handleYI(result);
    this.regions(result);
    if (DEBUG) {
      console.log("Prelude: " + result);
    }
    return result;
  }

  // (b) en   ene => delete if in R1 and preceded by a valid en-ending, and then undouble the ending
  // Define a valid en-ending as a non-vowel, and not gem.
  // Define undoubling the ending as removing the last letter if the word ends kk, dd or tt.
  step1b(word, suffixes) {
    var result = word;
    
    this.regions(result);
    var match = endsinArr(result, suffixes);
    if (match != "") {
      var pos = result.length - match.length;
      if (pos >= this.r1) {
        // check the character before the matched en/ene AND check for gem
        if (!isVowel(result[pos - 1]) /*&& result.substr(pos - 3, 3) !== "gem"*/) {
          // delete
          result = removeSuffix(result, match.length);
        }
        // Undouble the ending
        result = undoubleEnding(result);
      }
    }
    if (DEBUG) {
      console.log("step 1b: " + result);
    }
    return result;
  }

  
  step1(word) {
    var result = word;
    // (a) heden => replace with heid if in R1
    if (word.indexOf("heden") > this.r1) {
      result = word.replace("heden", "heid");
    }
    if (DEBUG) {
      console.log("step 1a: " + result);
    }

    result = this.step1b(result, ["en", "ene"]);

    // (c) s   se => delete if in R1 and preceded by a valid s-ending
    // Define a valid s-ending as a non-vowel other than j.
    this.regions(result);
    var match = endsinArr(result, ["s", "se"]);
    if (match != "") {
      var pos = result.length - 1 - match.length;
      if (pos >= this.r1) {
        // check the character before the matched s/se
        if (!isVowel(result[pos - 1]) && result[pos - 1] != "j") {
          result = removeSuffix(result, match.len);
        }
      }  
    }
    if (DEBUG) {
      console.log("step 1c: " + result);
    }
    return result;
  }


  // Delete suffix e if in R1 and preceded by a non-vowel, and then undouble the ending
  step2(word) {
    var result = word;
    this.regions(result);
    if (endsin(result, "e") && this.r1 <= result.length) {
      if (result.length > 1 && !isVowel(result[result.length - 2])) {
        // Delete
        result = removeSuffix(result, 1);
        this.suffixeRemoved = true;
      }
    }

    // Undouble the ending
    result = undoubleEnding(result);

    if (DEBUG) {
      console.log("step2: " + result);
    }
    return result;
  }


  // Step 3a: heid => delete heid if in R2 and not preceded by c, and treat a preceding en as in step 1(b)
  step3a(word) {
    var result = word;
    this.regions(result);
    if (endsin(result, "heid") && result.length - 4 > this.r2 && result[result.length - 5] != "c") {
      // Delete
      result = removeSuffix(result, 4);
      // Treat a preceding en as in step 1b
      result = this.step1b(result, ["en"]);
    }
    if (DEBUG) {
      console.log("step 3a: " + result);
    }
    return result;
  }

  // d suffixes: Search for the longest among the following suffixes, and perform the action indicated.
  step3b(word) {
    var result = word;

    // end   ing => delete if in R2; if preceded by ig, delete if in R2 and not preceded by e, otherwise undouble the ending
    this.regions(result);
    var suf = "";
    if (suf = endsinArr(result, ["end", "ing", "igend", "iging"])) {
      if ((result.length - suf.length) >= this.r2) {
        // delete suffix
        if (suf.length == 5) {
          // igend or iging => check for e
          if (result[result.length - 6] != "e") {
              result = removeSuffix(result, 5);
          }
        }
        else {
          // end or ing
          result = removeSuffix(result, 3);
          if (result.substr(-2) == "kk" || result.substr(-2) == "tt" || result.substr(-2) == "dd") {
            result = removeSuffix(result, 1);
          }
        }
      }
    }
      
    // ig => delete if in R2 and not preceded by e
    this.regions(result);
    if (endsin(result, "ig") && this.r2 <= result.length - 2 && result[result.length - 3] != "e") {
      result = removeSuffix(result, 2);
    }
        
    // lijk => delete if in R2, and then repeat step 2
    this.regions(result);
    if (endsin(result, "lijk") && this.r2 <= result.length - 4) {
      result = removeSuffix(result, 4);
      // repeat step 2
      result = this.step2(result);
    }

    // baar => delete if in R2
    this.regions(result);
    if (endsin(result, "baar") && this.r2 <= result.length - 4) {
      result = removeSuffix(result, 4);
    }    

    // bar => delete if in R2 and if step 2 actually removed an e
    this.regions(result);
    if (endsin(result, "bar") && this.r2 <= result.length - 3 && this.suffixeRemoved) {
      result = removeSuffix(result, 3);
    }    
    
    if (DEBUG) {
      console.log("step 3b: " + result);
    }
    return result;
  }

  // undouble vowel => If the words ends CVD, where C is a non-vowel,
  // D is a non-vowel other than I, and V is double a, e, o or u,
  // remove one of the vowels from V (for example, maan -> man, brood -> brod)
  step4(word) {
    var result = word;
    
    if (result.match(/[bcdfghjklmnpqrstvwxz][aeou]{2}[bcdfghjklmnpqrstvwxz]$/)) {
      result = result.substr(0, result.length - 2) + result[result.length - 1];
    }
    
    if (DEBUG) {
      console.log("step4: " + result);
    }
    return result;
  }

  // Turn I and Y back into lower case.
  postlude(word) {
    return word.toLowerCase();
  }

  stem(word) {
    return this.postlude(this.step4(this.step3b(this.step3a(this.step2(this.step1(this.prelude(word)))))));
  }
}

module.exports = new PorterStemmer();