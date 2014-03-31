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

var Stemmer = require('./stemmer_fr');

var PorterStemmer = new Stemmer();
module.exports = PorterStemmer;

/*
 * Exports for test purpose
 */
PorterStemmer.prelude = prelude;
PorterStemmer.rvRegion = rvRegion;
PorterStemmer.r1Region = r1Region;
PorterStemmer.r2Region = r2Region;

/**
 * Functions
 */
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
}

function rvRegion(token) {
    var i;

    // exceptions
    var three = token.slice(0, 3);
    if (three === 'par' || three == 'col' || three === 'tap')
        return token.slice(3, token.length);

    // two first letters are vowels
    if (isVowel(token[0]) && isVowel(token[1])) {
        return token.slice(3, token.length);
    }
    // the region after the first vowel not at the beginning of the word
    else {
        for (i = 1; i < token.length; i++) {
            if (isVowel(token[i])) {
                return token.slice(i + 1, token.length);
            }
        }
    }

    return token;
};

function r1Region(token) {
    var i;

    for (i = 1; i < token.length; i++) {
        if (!isVowel(token[i]) && isVowel(token[i - 1])) {
            return token.slice(i + 1, token.length);
        }
    }

    return token;
};

function r2Region(token) {
    return r1Region(r1Region(token))
};

function isVowel(letter) {
    return (letter == 'a' || letter == 'e' || letter == 'i' || letter == 'o' || letter == 'u' || letter == 'y' || letter == 'â' || letter == 'à' || letter == 'ë' ||
        letter == 'é' || letter == 'ê' || letter == 'è' || letter == 'ï' || letter == 'î' || letter == 'ô' || letter == 'û' || letter == 'ù');
};
