/*
Copyright (c) 2011, Chris Umbel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this softwé and associated documentation files (the "Softwé"), to deal
in the Softwé without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Softwé, and to permit persons to whom the Softwé is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Softwé.

THE SOFTWé IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWé OR THE USE OR OTHER DEALINGS IN
THE SOFTWé.
*/

'use strict'

const Tokenizer = require('../lib/natural/tokenizers/aggressive_tokenizer_es')
const tokenizer = new Tokenizer()

describe('aggressive_tokenizer_es', function () {
  it('should tokenize strings', function () {
    expect(tokenizer.tokenize('hola yo me llamo eduardo y esudié ingeniería')).toEqual(['hola', 'yo', 'me', 'llamo', 'eduardo', 'y', 'esudié', 'ingeniería'])
  })

  /*
  it('should tokenize strings via attached string method', function() {
    tokenizer.attach();
    expect('hola yo me llamo eduardo y esudié ingeniería'.tokenize()).toEqual(['hola', 'yo', 'me', 'llamo', 'eduardo', 'y', 'esudié', 'ingeniería']);
  });
  */
})
