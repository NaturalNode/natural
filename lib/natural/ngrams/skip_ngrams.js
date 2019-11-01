/*
Copyright (c) 2011, 2018, 2019, Ian Read, Rob Ellis, Chris Umbel, Hugo W.L. ter Doest

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

const _ = require("underscore")._,
    Tokenizer = require('../tokenizers/regexp_tokenizer').WordTokenizer;
let tokenizer = new Tokenizer();
let frequencies = {};
let nrOfNgrams = 0;

exports.setTokenizer = function(t) {
    if(!_.isFunction(t.tokenize))
        throw new Error('Expected a valid Tokenizer');
    tokenizer = t;
};

exports.skip_ngrams = function(sequence, n, k, startSymbol, endSymbol, stats) {
    return skip_ngrams(sequence, n, k, startSymbol, endSymbol, stats);
};

exports.skip_bigrams = function(sequence, k, startSymbol, endSymbol, stats) {
    return skip_ngrams(sequence, 2, k, startSymbol, endSymbol, stats);
};

exports.skip_trigrams = function(sequence, k, startSymbol, endSymbol, stats) {
    return skip_ngrams(sequence, 3, k, startSymbol, endSymbol, stats);
};

exports.skip_multrigrams = function(sequence, n, k, startSymbol, endSymbol, stats) {
    return skip_ngrams(sequence, n, k, startSymbol, endSymbol, stats);
};

// helper as _ doesn't handle array of arrays correctly
function arrayContains(a, value) {
    for(let i = 0; i < a.length; i++) {
        if (_.isEqual(a[i], value)) {
            return true;
        }
    }
    return false;
}

// Calculates a key (string) that can be used for a map
function arrayToKey(arr) {
    result = "(";
    arr.forEach(function(x) {
        result += x + ", ";
    });
    return result.substr(0, result.length - 2) + ")";
};

// Updates the statistics for the new ngram
function countNgrams(ngram) {
    nrOfNgrams++;
    const key = arrayToKey(ngram);
    if (!frequencies[key]) {
        frequencies[key] = 0;
    }
    frequencies[key]++;
}

// produce the skip ngrams with a start/end symbol
const padded_skip_ngrams = function(words, n, k, symbol, endSymbol, reverse) {

    const result = [];
    const numberOfSymbols = n - 1;
    let startedSequence = reverse ?
        words.slice(0, n + k).concat((new Array(n - 1)).fill(symbol, 0, numberOfSymbols)).reverse() :
        (new Array(n - 1)).fill(symbol, 0, numberOfSymbols).concat(words.slice(0, n + k));

    if (words.length < (n + k) && (endSymbol !== undefined && endSymbol !== null)) {
        const remainder = (n + k + 2) - words.length;
        startedSequence = startedSequence.concat((new Array(n - 1)).fill(endSymbol, 0, remainder));
    }

    for(let i = 0; i < n - 1; i++) {
        const ithGram = startedSequence.slice(i, i + n)
        result.push(ithGram);
        const firstGapStart = n - i - 1;
        const lastGapStart = n;

        // from the ith character, where does it start??
        for (let gapStart = firstGapStart; gapStart < lastGapStart; gapStart++) {

            const pre = startedSequence.slice(i, i + gapStart)
            for (let gap = 1; gap <= k; gap++) {
                const postGapStart = i + gapStart + gap;
                const postSkipEnd = postGapStart + (n - gapStart);
                const postSkip = startedSequence.slice(postGapStart, postSkipEnd)
                const ngram = pre.concat(postSkip)

                if (ngram.length < n || arrayContains(result, ngram)) {
                    continue;
                }
                result.push(ngram);
            }
        }
    }
    return result;
}   

const canAdd = (ngram, n, a) => ngram.length === n && !arrayContains(a, ngram);

// If stats is true, statistics will be returned
const skip_ngrams = function(sequence, n, k, startSymbol, endSymbol, stats, debug = true) {
    const result = [];
    frequencies = {};
    nrOfNgrams = 0;
    let words = _(sequence).isArray() ? sequence : tokenizer.tokenize(sequence);
    const hasStartSymbol = typeof startSymbol !== "undefined" && startSymbol !== null;
    const hasEndSymbol = typeof endSymbol !== "undefined" && endSymbol !== null;
    if (hasStartSymbol) {
        padded_skip_ngrams(words, n, k, startSymbol, endSymbol).forEach(ngram => {
            if (canAdd(ngram, n, result)) {
                result.push(ngram);
                if (stats) { 
                    countNgrams(ngram);
                }
            }
        });
        result.sort();
    }

    // main sequence
    if (words.length >= n) {
        for(let i = 0; i < words.length - n + 1; i++) {

              // add the default n-gram
              const defaultNgram = words.slice(i, i + n);
              result.push(defaultNgram);
              if (stats) { 
                  countNgrams(defaultNgram);
              }

              // all the possible starts (i.e. [ith word, [ith word, (i+t)th word],..., [ith word, (i + k + n)th word) ])
              for (let j = 1; j < n; j++ ) {

                  const pre = words.slice(i, i + j);
                  for (let gap = 1; gap <= k; gap++) {
                      const postSize = i + j + gap + n - j;
                      if (postSize > words.length) {
                          continue;
                      }
                      const post = words.slice(i + j + gap, i + j + gap + n - j);
                      const ngram = pre.concat(post);
            
                      // thus check shold be removeable
                      result.push(ngram);
                      if (stats) { 
                          countNgrams(ngram);
                      }
                  }
              }
          }
      }

      if (hasEndSymbol) {
          padded_skip_ngrams(words, n, k, endSymbol, undefined, true).reverse().forEach(ngram => {
              // @todo: make padding function more efficient to avoid this look up 
              if (canAdd(ngram, n, result)) {
                  result.push(ngram.reverse());
                  if (stats) { 
                      countNgrams(ngram.reverse());
                  }
              }              
          });
      }

      if (stats) {
        
          // Count frequencies
          const Nr = {};
          Object.keys(frequencies).forEach(function(key) {
              if (!Nr[frequencies[key]]) {
                  Nr[frequencies[key]] = 0;
              }
              Nr[frequencies[key]]++;
          });
          
          // Return the ngrams AND statistics
          return {
              "ngrams": result,
              "frequencies": frequencies,
              "Nr": Nr,
              "numberOfNgrams": nrOfNgrams
          };
        } else { // Do not break existing API of this module 
            return result;
        }
    }