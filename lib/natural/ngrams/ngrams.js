/*
Copyright (c) 2011, Rob Ellis, Chris Umbel

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

var _ = require("underscore")._,
    Tokenizer = require('../tokenizers/regexp_tokenizer').WordTokenizer,
    tokenizer = new Tokenizer();

exports.ngrams = function(sequence, n) {
    return ngrams(sequence, n);
}

exports.bigrams = function(sequence) {
    return ngrams(sequence, 2);
}

exports.trigrams = function(sequence) {
    return ngrams(sequence, 3);
}

var ngrams = function(sequence, n) {
    var result = [];
    
    if (!_(sequence).isArray()) {
        sequence = tokenizer.tokenize(sequence);
    }

    var count = _.max([0, sequence.length - n + 1]);
    
    for (var i = 0; i < count; i++) {
        result.push(sequence.slice(i, i + n));
    }
    
    return result;
}

