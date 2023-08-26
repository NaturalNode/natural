/*
file aggressive_tokenizer_hi_spec.js , located at spec\aggressive_tokenizer_hi_spec.js is licensed as follows:
- (The MIT License)
- Copyright (c) 2023 Mukesh Singh Bisht

Permission is hereby granted, free of charge, to any person or entity obtaining a copy
of  file aggressive_tokenizer_hi_spec.js and its content(the "Software"), to deal in the
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

const Tokenizer = require('../lib/natural/tokenizers/aggressive_tokenizer_hi')
const tokenizer = new Tokenizer()

describe('aggressive_tokenizer_hi', function () {
  it('should tokenize strings', function () {
    const string = 'स्वतंत्रता दिवस की हार्दिक शुभकामनाएं'
    const expectedArray = ['स्वतंत्रता', 'दिवस', 'की', 'हार्दिक', 'शुभकामनाएं']
    expect(tokenizer.tokenize(string)).toEqual(expectedArray)
  })
  it('should tokenize strings including english words', function () {
    const string = 'स्वतंत्रता दिवस की हार्दिक शुभकामनाएं congrats mukesh'
    const expectedArray = ['स्वतंत्रता', 'दिवस', 'की', 'हार्दिक', 'शुभकामनाएं', 'congrats', 'mukesh']
    expect(tokenizer.tokenize(string)).toEqual(expectedArray)
  })

  it('should swallow viram(stop) symbols', function () {
    const string = 'स्वतंत्रता दिवस की हार्दिक शुभकामनाएं । congrats mukesh'
    const expectedArray = ['स्वतंत्रता', 'दिवस', 'की', 'हार्दिक', 'शुभकामनाएं', 'congrats', 'mukesh']
    expect(tokenizer.tokenize(string)).toEqual(expectedArray)
  })
  it('should swallow dirgh viram(stop) symbols', function () {
    const string = 'राजा बाजीराव ॥ '
    const expectedArray = ['राजा', 'बाजीराव']
    expect(tokenizer.tokenize(string)).toEqual(expectedArray)
  })
  it('should swallow trailing off symbols', function () {
    const string = 'राजा बाजीराव ...'
    const expectedArray = ['राजा', 'बाजीराव']
    expect(tokenizer.tokenize(string)).toEqual(expectedArray)
  })
  it('should swallow question mark symbols', function () {
    const string = 'राजा बाजीराव ?'
    const expectedArray = ['राजा', 'बाजीराव']
    expect(tokenizer.tokenize(string)).toEqual(expectedArray)
  })
  it('should swallow comma mark symbols', function () {
    const string = 'राजा, बाजीराव'
    const expectedArray = ['राजा', 'बाजीराव']
    expect(tokenizer.tokenize(string)).toEqual(expectedArray)
  })
})
