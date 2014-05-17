/*
Copyright (c) 2014, Kristoffer Brabrand

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

var Stemmer = require('./stemmer_no');

// denote groups of consecutive consonants with a C and consecutive vowels
// with a V.
function categorizeGroups(token) {
    return token.replace(/[^vowels]+/g, 'C').replace(/[aeiouyæåø]+/g, 'V');
}

// denote single consonants with a C and single vowels with a V
function categorizeChars(token) {
    return token.replace(/[^aeiouyæåø]/g, 'C').replace(/[aeiouyæåø]/g, 'V');
}

// calculate the "measure" M of a word. M is the count of VC sequences dropping
// an initial C if it exists and a trailing V if it exists.
function measure(token) {
    if(!token)
    return -1;

    return categorizeGroups(token).replace(/^C/, '').replace(/V$/, '').length / 2;
}

// determine if a token end with a double consonant i.e. happ
function endsWithDoublCons(token) {
    return token.match(/([^aeiouyæåø])\1$/);
}

// step 1a as defined for the porter stemmer algorithm.
function step1a(token) {
    if(token.match(/(a|e|ede|ande|ende|ane|ene|hetene|en|heten|ar|er|heter|as|es|edes|endes|enes|hetenes|ens|hetens|ers|ets|et|het|ast)$/))
        return token.replace(/(a|e|ede|ande|ende|ane|ene|hetene|en|heten|ar|er|heter|as|es|edes|endes|enes|hetenes|ens|hetens|ers|ets|et|het|ast)$/, '');

    return token;
}

// step 1b as defined for the porter stemmer algorithm.
function step1b(token) {
    if(token.match(/([bcdfghjklmnoprtvyz])s$/))
        return token.replace(/([bcdfghjklmnoprtvyz])s$/, '$1');

    return token;
}

// step 1c as defined for the porter stemmer algorithm.
function step1c(token) {
    if(token.match(/erte$/))
        return token.replace(/erte$/, 'ert');

    return token;
}

// step 2 as defined for the porter stemmer algorithm.
function step2(token) {
    if(token.match(/(d|v)t$/))
        return token.replace(/(d|v)t$/, '$1');

    return token;
}

// step 3 as defined for the porter stemmer algorithm.
function step3(token) {
    if(token.match(/(leg|eleg|ig|eig|lig|elig|els|lov|elov|slov|hetslov)$/))
        return token.replace(/(leg|eleg|ig|eig|lig|elig|els|lov|elov|slov|hetslov)$/, '');

    return token;
}

var PorterStemmer = new Stemmer();
module.exports = PorterStemmer;

// perform full stemming algorithm on a single word
PorterStemmer.stem = function(token) {
    return step3(step2(step1c(step1b(step1a(token.toLowerCase()))))).toString();
};

//exports for tests
PorterStemmer.step1a = step1a;
PorterStemmer.step1b = step1b;
PorterStemmer.step1c = step1c;
PorterStemmer.step2 = step2;
PorterStemmer.step3 = step3;
