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

'use strict'

const Tokenizer = require('./tokenizer')

const DEBUG = false

class SentenceTokenizer extends Tokenizer {
  tokenize (text) {
    // Break string up in to sentences based on punctation and quotation marks
    // See https://gist.github.com/Hugo-ter-Doest/4ed21fb7eb5077814d998fa61a726566
    // for a breakdown of the regular expression
    let tokens = text.match(/(?<=\s+|^)["'‘“'"[({⟨]?(.*?[.?!…]|.+)(\s[.?!…])*["'’”'"\])}⟩]?(?=\s+|$)/g)

    DEBUG && console.log('SentenceTokenizer.tokenize: ' + tokens)

    if (!tokens) {
      return [text]
    }

    // remove unecessary white space
    tokens = tokens.map(Function.prototype.call, String.prototype.trim)

    DEBUG && console.log('SentenceTokenizer.tokenize: tokens after removing whitespace ' + tokens)

    return this.trim(tokens)
  }
}

module.exports = SentenceTokenizer
