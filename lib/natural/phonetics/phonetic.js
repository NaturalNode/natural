/*
Copyright (c) 2011, Chris Umbel

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

var stopwords = require('../util/stopwords');
var Tokenizer = require('../tokenizers/aggressive_tokenizer'),
    tokenizer = new Tokenizer();

module.exports = function() {
    this.compare = function(stringA, stringB) {
        return this.process(stringA) == this.process(stringB);
    };

    this.attach = function() {
	var phonetic = this;

        String.prototype.soundsLike = function(compareTo) {
            return phonetic.compare(this, compareTo);
        }
        
        String.prototype.phonetics = function() {
            return phonetic.process(this);
        }
	
        String.prototype.tokenizeAndPhoneticize = function(keepStops) {
            var phoneticizedTokens = [];
            
            tokenizer.tokenize(this).forEach(function(token) {
                if(keepStops || stopwords.words.indexOf(token) < 0)
                    phoneticizedTokens.push(token.phonetics());
            });
            
            return phoneticizedTokens;
        }
    };
};
