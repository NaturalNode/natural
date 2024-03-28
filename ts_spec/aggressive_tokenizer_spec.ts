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

import { AggressiveTokenizer } from 'lib/natural'
const tokenizer = new AggressiveTokenizer()

describe('aggressive_tokenizer', function () {
  it('should tokenize strings', function () {
    expect(tokenizer.tokenize('these are things')).toEqual(['these', 'are', 'things'])
  })

  it('should swallow punctuation', function () {
    expect(tokenizer.tokenize('these are things, no')).toEqual(['these', 'are', 'things', 'no'])
  })

  it('should swallow final punctuation', function () {
    expect(tokenizer.tokenize('these are things, no?')).toEqual(['these', 'are', 'things', 'no'])
  })

  it('should swallow initial punctuation', function () {
    expect(tokenizer.tokenize('.these are things, no')).toEqual(['these', 'are', 'things', 'no'])
  })

  it('should swallow duplicate punctuation', function () {
    expect(tokenizer.tokenize('i shal... pause')).toEqual(['i', 'shal', 'pause'])
  })

  it('should remove underscores', function () {
    expect(tokenizer.tokenize('_ hi_this_is_a_test_case_ for__removing___underscores_')).toEqual(['hi', 'this', 'is', 'a', 'test', 'case', 'for', 'removing', 'underscores'])
  })

  it('should handle the use of hyphen inside words (issue #656)', function () {
    expect(tokenizer.tokenize('links text-based opposed image-based links/CTA\'s')).toEqual(
      ['links', 'text-based', 'opposed', 'image-based', 'links/CTA\'s'])
  })
})
