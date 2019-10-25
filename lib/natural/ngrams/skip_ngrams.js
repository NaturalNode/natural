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

const padded_skip_ngrams = function(words, n, k, symbol, endSymbol, stat, reverse) {

  const result = [];
  const numberOfSymbols = n - 1;
  let startedSequence;  
  if (reverse) {
      startedSequence = words.slice(0, n + k).concat((new Array(n - 1)).fill(symbol, 0, numberOfSymbols)).reverse();
  } else {
      startedSequence = (new Array(n - 1)).fill(symbol, 0, numberOfSymbols).concat(words.slice(0, n + k));
  }
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

  for(let i = 0; i < n; i++) {
      console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');
      console.log('\ti', i);
      const ithGram = startedSequence.slice(i, i + n)
      result.push(ithGram);
      console.log('\tithGram', ithGram)
      const firstGapStart = n - i - 1;
//      const lastGapStart = Math.min(lastWord - i + 1, n - (i <= 1 ? 0 : i - k));
      const lastGapStart = n - (i <= 1 ? 0 : i - k);

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

              if (postGapStart > lastWord) {//slastWordtartedSequence.length) {
                continue;
              }

              const postSkip = startedSequence.slice(postGapStart, postSkipEnd)
              const ngram = pre.concat(postSkip)

              if (ngram.length < n) {
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

  return result;
}   

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
        padded_skip_ngrams(words, n, k, startSymbol, endSymbol, stats).forEach(ngram => {
            result.push(ngram);
            if (stats) { 
                countNgrams(ngram);
            }
        });
        result.sort();
    }


    // main sequence
    if (words.length > n) {
      console.log('here');
      process.exit();

      for(let i = 0; i < words.length - n + 1; i++) {

            // add the default n-gram
            const defaultNgram = words.slice(i, i + n);
            result.push(defaultNgram);
            console.log('default', defaultNgram)
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
                    result.push(ngram);
                    if (stats) { 
                        countNgrams(ngram);
                    }
                }
            }
        }
      }

 //     const endResults = [];
      if (hasEndSymbol) {
          padded_skip_ngrams(words, n, k, endSymbol, undefined, stats, true).reverse().forEach(ngram => {
              result.push(ngram.reverse());
              if (stats) { 
                  countNgrams(ngram.reverse());
              }
          });
      }

/*

        const endSequence = words.slice(0, n + k).concat((new Array(n - 1)).fill(endSymbol, 0, n - 1)).reverse();
        console.log('n', n);
        console.log('k', k);
        console.log('endSequence', endSequence);

      for(let i = 0; i < n - 1; i++) {

        const initialSkipPosition = n - 1 - i;//) ? (n - 1) : 1;
       // const initialSkipPosition = i <= (n - 1 - i;//) ? (n - 1) : 1;

        console.log('i', i);
          for (let gapStart = initialSkipPosition; gapStart <= n - 1; gapStart++) {

              console.log('\tgapStart', gapStart);

              const firstSkip = i > 0 && gapStart > 1 ? i : 0;
              for (let skip = firstSkip; skip <= k; skip++) {
             // for (let skip = firstSkip; skip < n; skip++) {
                console.log('\t\tskip', skip);

                  const postGapStart = i + gapStart + skip
                  const postSkipEnd = postGapStart + (n - gapStart)

                  const preSkip = endSequence.slice(i, i + gapStart)
                  const postSkip = endSequence.slice(postGapStart, postSkipEnd)
                  const ngram = preSkip.concat(postSkip).reverse()

                  endResults.push(ngram);
                  console.log('\t\t\ti', i)
                  console.log('\t\t\tgapStart', gapStart)
                  console.log('\t\t\tpostGapStart', postGapStart)
                  console.log('\t\t\tpostSkipEnd', postSkipEnd)
                  console.log('\t\t\tpreSkip', preSkip)
                  console.log('\t\t\tpostSkip', postSkip)
                  console.log('\t\t\t', ngram)
                  if (stats) { 
                      countNgrams(ngram);
                  }
              }
          }
      }}   */



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
        
      }
      else { // Do not break existing API of this module 
        return result;
      }
    }