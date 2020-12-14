/*
Copyright (c) 2011, 2018 Rob Ellis, Chris Umbel, Hugo W.L. ter Doest

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

var _ = require("underscore"),
    Tokenizer = require('../tokenizers/regexp_tokenizer').WordTokenizer,
    tokenizer = new Tokenizer(),
    frequencies = {},
    nrOfNgrams = 0;

exports.setTokenizer = function(t) {
    if(!_.isFunction(t.tokenize))
        throw new Error('Expected a valid Tokenizer');
    tokenizer = t;
};

exports.ngrams = function(sequence, n, startSymbol, endSymbol, stats) {
    return ngrams(sequence, n, startSymbol, endSymbol, stats);
};

exports.bigrams = function(sequence, startSymbol, endSymbol, stats) {
    return ngrams(sequence, 2, startSymbol, endSymbol, stats);
};

exports.trigrams = function(sequence, startSymbol, endSymbol, stats) {
    return ngrams(sequence, 3, startSymbol, endSymbol, stats);
};

exports.multrigrams = function(sequence, n, startSymbol, endSymbol, stats) {
    return ngrams(sequence, n, startSymbol, endSymbol, stats);
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

// If stats is true, statistics will be returned
var ngrams = function(sequence, n, startSymbol, endSymbol, stats) {
    var result = [];
    frequencies = {};
    nrOfNgrams = 0;
    
    if (!_.isArray(sequence)) {
        sequence = tokenizer.tokenize(sequence);
    }

    var count = _.max([0, sequence.length - n + 1]);

    // Check for left padding    
    if(typeof startSymbol !== "undefined" && startSymbol !== null) {
        // Create an array of (n) start symbols
        var blanks = [];
        for(var i = 0 ; i < n ; i++) {
            blanks.push(startSymbol);
        }

        // Create the left padding
        for(var p = n - 1 ; p > 0 ; p--) {
            // Create a tuple of (p) start symbols and (n - p) words
          var ngram = blanks.slice(0, p).concat(sequence.slice(0, n - p));
          result.push(ngram);
          if (stats) {
            countNgrams(ngram);
          }
        }
    }

    // Build the complete ngrams
    for (var i = 0; i < count; i++) {
        var ngram = sequence.slice(i, i + n);
        result.push(ngram);
        if (stats) { 
          countNgrams(ngram);
        }
    }

    // Check for right padding
    if(typeof endSymbol !== "undefined" && endSymbol !== null) {
        // Create an array of (n) end symbols
        var blanks = [];
        for(var i = 0 ; i < n ; i++) {
            blanks.push(endSymbol);
        }

        // create the right padding
        for(var p = n - 1 ; p > 0 ; p--) {
            // Create a tuple of (p) start symbols and (n - p) words
          var ngram = sequence.slice(sequence.length - p, sequence.length).concat(blanks.slice(0, n - p));
          result.push(ngram);
          if (stats) {
            countNgrams(ngram);
          }
        }
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
      
    }
    else { // Do not break existing API of this module 
      return result;
    }
};
