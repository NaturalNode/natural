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

// @todo: refactor the array helpers into a util file to share across ngram code.
// Calculates a key (string) that can be used for a map
function arrayToKey(arr) {
    result = "(";
    arr.forEach(function(x) {
        result += x + ", ";
    });
    result = result.substr(0, result.length - 2) + ")";
    return result;
};

// Updates the statistics for the new ngram
function countNgrams(ngram) {
    nrOfNgrams++;
    var key = arrayToKey(ngram);
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
  
  console.log('words.length', words.length);
  console.log('n', n);
  console.log('k', k);
  const lastWord = startedSequence.length - 1;

  if (endSymbol !== undefined && endSymbol !== null) {
      console.log('endSymbol', endSymbol)
  }

  if (words.length < (n + k) && (endSymbol !== undefined && endSymbol !== null)) {
      console.log('endSymbol', endSymbol)

      const remainder = (n + k + 2) - words.length;
    console.log('remainder', remainder);
    startedSequence = startedSequence.concat((new Array(n - 1)).fill(endSymbol, 0, remainder));
  }

  console.log('startedSequence', startedSequence);

  for(let i = 0; i < n - 1; i++) {
      console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');
      console.log('\ti', i);
      const ithGram = startedSequence.slice(i, i + n)
      result.push(ithGram);
      console.log('\tithGram', ithGram)
      const firstGapStart = n - i - 1;
//      const lastGapStart = Math.min(lastWord - i + 1, n - (i <= 1 ? 0 : i - k));
      const lastGapStart = n;// - (i <= 1 ? 0 : i - k);

      console.log('\tfirstGapStart', firstGapStart);
      console.log('\tlastGapStart', lastGapStart);

      // from the ith character, where does it start??
      // the actual sequence starts at 
      for (let gapStart = firstGapStart; gapStart < lastGapStart; gapStart++) {

          const pre = startedSequence.slice(i, i + gapStart)
          console.log('----------------------------------------');
          console.log('\t\tgapStart', gapStart);
          console.log('\t\tpre:\t', pre);

          //const firstGap = i > 0 && gapStart > 1 ? i : 0;
          const firstGap = 1;//i - ;   //0;//i > 0 && gapStart > 1 ? i : 0;
          console.log('\t\tfirstGap', firstGap, i);

//              for (let gap = 1; gap <= k; gap++) {
          for (let gap = firstGap; gap <= k; gap++) {
              console.log('\t\t\tgap', gap);

              const postGapStart = i + gapStart + gap;
              const postSkipEnd = postGapStart + (n - gapStart);
              const postSize = i + gapStart + gap + n - gapStart;

              const postSkip = startedSequence.slice(postGapStart, postSkipEnd)
              const ngram = pre.concat(postSkip)

              if (ngram.length < n || arrayContains(result, ngram)) {
                console.log('not adding', ngram)
                continue;
              }
              result.push(ngram);
              console.log('\t\t\t--------')
              console.log('\t\t\tgapStart', gapStart)
              console.log('\t\t\tpostGapStart', postGapStart)
              console.log('\t\t\tpostSkipEnd', postSkipEnd)
              console.log('\t\t\tpostSkip', postSkip)
              console.log('\t\t\t', ngram)
          }
      }
  }

  console.log('-------')
  console.log('-------')
  console.log('-------')
  console.log('-------')
  console.log('-------')
  console.log('-------')
  console.log('result', result)
  return result;
}   

const canAdd = (ngram, n, a) =>
  ngram.length === n && !arrayContains(a, ngram);

// If stats is true, statistics will be returned
var skip_ngrams = function(sequence, n, k, startSymbol, endSymbol, stats, debug = true) {
    var result = [];
    frequencies = {};
    nrOfNgrams = 0;
    
    let words = _(sequence).isArray() ? sequence : tokenizer.tokenize(sequence);

    console.log('words', words);
    const hasStartSymbol = typeof startSymbol !== "undefined" && startSymbol !== null;
    const hasEndSymbol = typeof endSymbol !== "undefined" && endSymbol !== null;
 
    if (hasStartSymbol) {
        padded_skip_ngrams(words, n, k, startSymbol, endSymbol).forEach(ngram => {
            if (canAdd(ngram, n, result)) {
                result.push(ngram);
                if (stats) { 
                    countNgrams(ngram);
                }
            } else {
              console.log('N O T    A D D I N G', ngram)
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
              debug && console.log('default', defaultNgram)
              if (stats) { 
                  countNgrams(defaultNgram);
              }

              // all the possible starts (i.e. [ith word, [ith word, (i+t)th word],..., [ith word, (i + k + n)th word) ])
              for (let j = 1; j < n; j++ ) {

                  const pre = words.slice(i, i + j);
                  console.log('\tpre', j, pre);
                  for (let gap = 1; gap <= k; gap++) {
                      const postSize = i + j + gap + n - j;
                      if (postSize > words.length) {
                          continue;
                      }
                      const post = words.slice(i + j + gap, i + j + gap + n - j);
                      console.log('\t\tpost', post);
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
          var Nr = {};
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