/*
 Copyright (c) 2011, Chris Umbel, Alex Langberg

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

var Tokenizer = require('./tokenizer'),
  util = require('util'),
  CaseTokenizer = function() {
    Tokenizer.call(this);
  };

util.inherits(CaseTokenizer, Tokenizer);

CaseTokenizer.prototype.attach = function() {
  var self = this;

  String.prototype.tokenize = function(preserveApostrophe) {
    return self.tokenize(this, preserveApostrophe);
  }
};

// Idea from Seagull: http://stackoverflow.com/a/26482650
CaseTokenizer.prototype.tokenize = function(text, preserveApostrophe) {
  var whitelist = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  var lower = text.toLowerCase();
  var upper = text.toUpperCase();
  var result = '';
  var i;

  for (i = 0; i < lower.length; ++i) {
    if (lower[i] !== upper[i] || whitelist.indexOf(lower[i]) > -1 || (text[i] === '\'' && preserveApostrophe)) {
      result += text[i];
    } else {
      result += ' ';
    }
  }

  return this.trim(result.replace(/\s+/g, ' ').split(' '));
};

module.exports = CaseTokenizer;
