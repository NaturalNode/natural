/*
Copyright (c) 2014, Ismaël Héry

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
 * Spec for French Porter Stemmer can be found at file:///Users/hery/projects/stemmer/docs/French%20stemming%20algorithm.html
 */

var Stemmer = require('./stemmer_fr');

var PorterStemmer = new Stemmer();
module.exports = PorterStemmer;

/*
 * Exports for test purpose
 */
PorterStemmer.prelude = prelude;
PorterStemmer.step1 = step1;
PorterStemmer.regions = regions;
PorterStemmer.stem = stem;

/**
 * Functions
 */
function stem(token) {
  token = prelude(token);

  var regs = regions(token);
  //console.log('regions:', regs)
  r1_txt = regs.r1;
  r2_txt = regs.r2;
  rv_txt = regs.rv;


  // Step 1
  var beforeStep1 = token;
  var suf, pref2, pref3, letterBefore, letter2Before;

  if ((suf = endsinArr(r2_txt, new Array('ance', 'iqUe', 'isme', 'able', 'iste', 'eux', 'ances', 'iqUes', 'ismes', 'ables', 'istes'))) != '') {
    token = token.slice(0, -suf.length); // delete
  } else if ((suf = endsinArr(token, new Array('atrice', 'ateur', 'ation', 'atrices', 'ateurs', 'ations'))) != '') {
    pref2 = token.slice(suf.length - 3, suf.length - 1);
    if ((sufr2 = endsinArr(r2_txt, new Array('atrice', 'ateur', 'ation', 'atrices', 'ateurs', 'ations'))) != '') {
      token = token.slice(0, -sufr2.length); // delete
    } else if (pref2 === 'ic') {
      token = token.slice(0, -suf.length - 2) + 'iqU'; // replace end with iqU
    }
  } else if ((suf = endsinArr(r2_txt, new Array('logie', 'logies'))) != '') {
    token = token.slice(0, -suf.length) + 'log'; // replace with log
  } else if ((suf = endsinArr(r2_txt, new Array('usion', 'ution', 'usions', 'utions'))) != '') {
    token = token.slice(0, -suf.length) + 'u'; // replace with u
  } else if ((suf = endsinArr(r2_txt, new Array('ence', 'ences'))) != '') {
    token = token.slice(0, -suf.length) + 'ent'; // replace with ent
  }
  else if ((suf = endsinArr(rv_txt, new Array('ement', 'ements'))) != '') {
    token = token.slice(0, -suf.length); // delete
  }
  /*else if ((suf = endsinArr(token, new Array('ement', 'ements'))) != '') {

    if (token === 'voluptueusement')
      console.log('rv', rv_txt);

    if ((suf = endsinArr(rv_txt, new Array('ement', 'ements'))) != '') {
      token = token.slice(0, -suf.length); // delete if in RV
    }

    pref2 = token.slice(token.length - suf.length - 3, -suf.length - 1);
    pref3 = token.slice(token.length - suf.length - 4, -suf.length - 1);

    if (token === 'voluptueusement')
      console.log('pre2', pref2, 'pref3', pref3);

    if ((suf = endsinArr(r2_txt, new Array('ement', 'ements'))) != '' && pref2 === 'iv') {
      token = token.slice(0, -suf.length); // delete
      // TODO: (and if further preceded by at, delete if in R2
    } else if ((suf = endsinArr(r2_txt, new Array('ement', 'ements'))) != '' && pref3 === 'eus') {
      token = token.slice(0, -suf.length); // delete
    } else if ((suf = endsinArr(r1_txt, new Array('ement', 'ements'))) != '' && pref3 === 'eus') {
      token = token.slice(0, -suf.length) + 'eux'; // replace by eux
    } else if ((suf = endsinArr(r2_txt, new Array('ement', 'ements'))) != '' && (pref3 === 'abl' || pref3 === 'iqU')) {
      token = token.slice(0, -suf.length); // delete
    }

    //TODO: if preceded by ièr or Ièr, replace by i if in RV
  }*/ else if ((suf = endsinArr(token, new Array('ité', 'ités'))) != '') {
    pref2 = token.slice(token.length - suf.length - 3, suf.length - 1);
    pref3 = token.slice(token.length - suf.length - 4, suf.length - 1);

    if ((suf = endsinArr(r2_txt, new Array('ité', 'ités'))) != '') {
      token = token.slice(0, -suf.length); // delete if in R2
    } else if (pref3 === 'abil') {
      token = token.slice(0, -suf.length) + 'abl'; // replace by abl
    } else if (pref2 === 'ic') {
      token = token.slice(0, -suf.length) + 'iqU'; // replace by abl
    }
  } else if ((suf = endsinArr(r2_txt, new Array('if', 'ive', 'ifs', 'ives'))) != '') {
    token = token.slice(0, -suf.length); // delete
    //TODO: if preceded by at, delete if in R2 (and if further preceded by ic, delete if in R2, else replace by iqU)
  } else if ((suf = endsinArr(token, new Array('eaux'))) != '') {
    token = token.slice(0, -suf.length) + 'eau'; // replace by eau
  } else if ((suf = endsinArr(r1_txt, new Array('aux'))) != '') {
    token = token.slice(0, -suf.length) + 'al'; // replace by al
  } else if ((suf = endsinArr(r2_txt, new Array('euse', 'euses'))) != '') {
    token = token.slice(0, -suf.length) + 'al'; // delete
  } else if ((suf = endsinArr(r1_txt, new Array('euse', 'euses'))) != '') {
    token = token.slice(0, -suf.length) + 'eux'; // replace by eux
  } else if ((suf = endsinArr(r1_txt, new Array('issement', 'issements'))) != '') {
    if (!isVowel(token[suf.length - 1])) {
      token = token.slice(0, -suf.length); // delete
    }
  } else if ((suf = endsinArr(rv_txt, new Array('amment'))) != '') {
    token = token.slice(0, -suf.length) + 'ant'; // replace by ant
  } else if ((suf = endsinArr(rv_txt, new Array('emment'))) != '') {
    token = token.slice(0, -suf.length) + 'ent'; // replace by ent
  } else if ((suf = endsinArr(rv_txt, new Array('ment', 'ments'))) != '') {
    if (isVowel(token[suf.length - 1])) {
      token = token.slice(0, -suf.length); // delete
    }
  }

  // Step 2a
  var beforeStep2a = token;
  if (beforeStep1 === token || (suf = endsinArr(beforeStep1, new Array('amment', 'emment', 'ment', 'ments'))) != '') {
    if ((suf = endsinArr(rv_txt, new Array('îmes', 'ît', 'îtes', 'i', 'ie', 'ies', 'ir', 'ira', 'irai', 'iraIent', 'irais', 'irait', 'iras', 'irent', 'irez', 'iriez', 'irions', 'irons', 'iront', 'is', 'issaIent', 'issais', 'issait', 'issant', 'issante', 'issantes', 'issants', 'isse', 'issent', 'isses', 'issez', 'issiez', 'issions', 'issons', 'it'))) != '') {
      letterBefore = token[token.length - suf.length - 1];
      if (!isVowel(letterBefore) && endsin(rv_txt, letterBefore + suf))
        token = token.slice(0, -suf.length); // delete
    }
  }

  // Step 2b
  if (token === beforeStep2a) {
    if ((suf = endsinArr(r2_txt, new Array('ions'))) != '') {
      token = token.slice(0, -suf.length); // delete
    }
    if ((suf = endsinArr(token, new Array('é', 'ée', 'ées', 'és', 'èrent', 'er', 'era', 'erai', 'eraIent', 'erais', 'erait', 'eras', 'erez', 'eriez', 'erions', 'erons', 'eront', 'ez', 'iez'))) != '') {
      token = token.slice(0, -suf.length); // delete
    }
    if ((suf = endsinArr(token, new Array('âmes', 'ât', 'âtes', 'a', 'ai', 'aIent', 'ais', 'ait', 'ant', 'ante', 'antes', 'ants', 'as', 'asse', 'assent', 'asses', 'assiez', 'assions'))) != '') {
      token = token.slice(0, -suf.length); // delete

      letterBefore = token[token.length - 1];
      if (letterBefore === 'e' && endsin(rv_txt, letterBefore + suf))
        token.slice(0, -1);
    }
  }

  // Step 3
  if (!(token === beforeStep1)) {
    if (token[token.length - 1] === 'Y')
      token = token.slice(0, -1) + 'i';
    if (token[token.length - 1] === 'ç')
      token = token.slice(0, -1) + 'c';
  } // Step 4
  else {
    letterBefore = token[token.length - 1];
    letter2Before = token[token.length - 2];

    if (letterBefore === 's' && ['a', 'i', 'o', 'u', 'è', 's'].indexOf(letter2Before) == -1)
      token = token.slice(0, -1);
    if ((suf = endsinArr(rv_txt, new Array('ion'))) != '') {
      if ((suf = endsinArr(r2_txt, new Array('ion'))) != '') {
        letterBefore = token[token.length - suf.length - 1];
        if (letterBefore === 's' || letterBefore === 't')
          token = token.slice(0, -suf.length) + 'ent'; // delete
      }
    }
    if ((suf = endsinArr(rv_txt, new Array('ier', 'ière', 'Ier', 'Ière'))) != '') {
      token = token.slice(0, -suf.length) + 'i'; // replace by i
    }
    if ((suf = endsinArr(rv_txt, 'e')) != '') {
      token = token.slice(0, -suf.length); // delete
    }
    if ((suf = endsinArr(rv_txt, 'ë')) != '') {
      if (token.slice(token.length - 3, -1) === 'gu')
        token = token.slice(0, -suf.length); // delete
    }
  }

  // Step 5
  if ((suf = endsinArr(token, new Array('enn', 'onn', 'ett', 'ell', 'eill'))) != '') {
    token = token.slice(0, -1); // delete last letter
  }

  return token.toLowerCase();

};

function regions(token) {
  var r1 = r2 = len = token.length;
  var rv = '';
  var i;

  token = token.toLowerCase();

  // R1 is the region after the first non-vowel following a vowel,
  for (var i = 0; i < len - 1 && r1 == len; i++) {
    if (isVowel(token[i]) && !isVowel(token[i + 1])) {
      r1 = i + 2;
    }
  }
  // Or is the null region at the end of the word if there is no such non-vowel.

  // R2 is the region after the first non-vowel following a vowel in R1
  for (i = r1; i < len - 1 && r2 == len; i++) {
    if (isVowel(token[i]) && !isVowel(token[i + 1])) {
      r2 = i + 2;
    }
  }
  // Or is the null region at the end of the word if there is no such non-vowel.

  // RV region
  var three = token.slice(0, 3);
  if (three === 'par' || three == 'col' || three === 'tap')
    rv = token.slice(3, len);
  else {
    // two first letters are vowels
    if (isVowel(token[0]) && isVowel(token[1])) {
      rv = token.slice(3, len);
    }
    // the region after the first vowel not at the beginning of the word or null
    else {
      rv = '';
      for (i = 1; i < len && rv === ''; i++) {
        if (isVowel(token[i])) {
          rv = token.slice(i + 1, len);
        }
      }
    }
  }

  return {
    r1: token.substring(r1),
    r2: token.substring(r2),
    rv: rv
  };
};

function prelude(token) {
  token = token.toLowerCase();

  var result = '';
  var i = 0;

  // special case for i = 0 to avoid '-1' index
  if (token[i] === 'y' && isVowel(token[i + 1])) {
    result += token[i].toUpperCase();
  } else {
    result += token[i];
  }

  for (i = 1; i < token.length; i++) {
    if ((token[i] === 'u' || token[i] === 'i') && isVowel(token[i - 1]) && isVowel(token[i + 1])) {
      result += token[i].toUpperCase();
    } else if (token[i] === 'y' && (isVowel(token[i - 1]) || isVowel(token[i + 1]))) {
      result += token[i].toUpperCase();
    } else if (token[i] === 'u' && token[i - 1] === 'q') {
      result += token[i].toUpperCase();
    } else {
      result += token[i];
    }
  }

  return result;
};

function step1(token) {
  return token;
};

function isVowel(letter) {
  return (letter == 'a' || letter == 'e' || letter == 'i' || letter == 'o' || letter == 'u' || letter == 'y' || letter == 'â' || letter == 'à' || letter == 'ë' ||
    letter == 'é' || letter == 'ê' || letter == 'è' || letter == 'ï' || letter == 'î' || letter == 'ô' || letter == 'û' || letter == 'ù');
};

function endsin(token, suffix) {
  if (token.length < suffix.length) return false;
  return (token.slice(-suffix.length) == suffix);
};

function endsinArr(token, suffixes) {
  for (var i = 0; i < suffixes.length; i++) {
    if (endsin(token, suffixes[i])) return suffixes[i];
  }
  return '';
};
