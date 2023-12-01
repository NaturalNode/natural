/*
file aggressive_tokenizer_hi.js , located at lib\natural\tokenizers\aggressive_tokenizer_hi.js is licensed as follows:
- (The MIT License)
- Copyright (c) 2023 Mukesh Singh Bisht

Permission is hereby granted, free of charge, to any person or entity obtaining a copy
of file aggressive_tokenizer_hi.js and its content(the "Software"), to deal in the
Software without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the following
conditions:

1. The above copyright notice and this permission notice shall be included in all copies
   or substantial portions of the Software.

2. Proper credit must be given to the original author Mukesh Singh Bisht, along with the
   date of authorship specified as July 23, 2023, in any usage, distribution, or
   modification of the Software.

THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR
OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/

'use strict'

const Tokenizer = require('./tokenizer')

/*
To know more on hindi
Important links:
1.https://viahindi.in/hindi-vyakaran/%E0%A4%B8%E0%A4%AE%E0%A4%BE%E0%A4%B8-samas-in-hindi
2.https://hindigrammar.in/
3.https://www.unicode.org/charts/PDF/U0900.pdf
*/

class AggressiveTokenizer extends Tokenizer {
  tokenize (text) {
    const response = this.trim(text.replace(/[\u0964\u0965...?,]/g, '').split(/\s+|(?![\u0900-\u097F\u0020-\u007F])./u)).filter(Boolean)
    return response
  }
}

module.exports = AggressiveTokenizer
