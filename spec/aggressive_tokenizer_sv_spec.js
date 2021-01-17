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

var Tokenizer = require('../lib/natural/tokenizers/aggressive_tokenizer_sv'),
    tokenizer = new Tokenizer();

describe('aggressive_tokenizer_sv', function() {
  it('should tokenize strings', function() {
    expect(tokenizer.tokenize('Ett tu tre')).toEqual(['Ett', 'tu', 'tre']);
  });

  /*
  it('should tokenize strings via attached string method', function() {
    tokenizer.attach();
    expect('Ett tu tre'.tokenize()).toEqual(['Ett', 'tu', 'tre']);
  });
  */

  it('should swallow punctuation', function() {
    expect(tokenizer.tokenize('Ett, tu, tre')).toEqual(['Ett', 'tu', 'tre']);
  });

  it('should swallow final punctuation', function() {
    expect(tokenizer.tokenize('Ett, tu, tre?')).toEqual(['Ett', 'tu', 'tre']);
  });

  it('should swallow initial punctuation', function() {
    expect(tokenizer.tokenize('.Ett, tu, tre')).toEqual(['Ett', 'tu', 'tre']);
  });

  it('should swallow duplicate punctuation', function() {
    expect(tokenizer.tokenize('Ett, tu... tre')).toEqual(['Ett', 'tu', 'tre']);
  });

  it('should not split on hyphen or Swedish letters', function() {
    expect(tokenizer.tokenize('It-bolaget ägs av en 30-åring')).toEqual(['It-bolaget', 'ägs', 'av', 'en', '30-åring']);
  })
});
