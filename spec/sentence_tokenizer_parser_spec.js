/*
Copyright (c) 2011, 2020 Chris Umbel, Hugo W.L. ter Doest

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

const Tokenizer = require('../lib/natural/tokenizers/sentence_tokenizer_parser')
const tokenizer = new Tokenizer()

describe('sentence_tokenizer', function () {
  it('should tokenize strings and trim whitespace', function () {
    expect(
      tokenizer.tokenize('This is a sentence. This is another sentence.')
    )
      .toEqual([
        'This is a sentence.',
        'This is another sentence.'
      ])
  })

  /*
  it('should tokenize strings via attached string method', function() {
    tokenizer.attach();
    expect(
        'This is a sentence. This is another sentence.'.tokenize()
    ).toEqual([
        'This is a sentence.',
        'This is another sentence.'
    ]);
  });

  it('should tokenize strings via attached string method', function() {
    tokenizer.attach();
    expect(
        'This is a sentence. This is another sentence.'.tokenize()
    ).toEqual([
        'This is a sentence.',
        'This is another sentence.'
    ]);
  });
  */

  it('should include quotation marks', function () {
    expect(
      tokenizer.tokenize('"This is a sentence." This is another sentence.')
    ).toEqual([
      '"This is a sentence."',
      'This is another sentence.'
    ])
  })

  it('should include brackets', function () {
    expect(
      tokenizer.tokenize('This is a sentence. [This is another sentence.]')
    ).toEqual([
      'This is a sentence.',
      '[This is another sentence.]'
    ])
  })

  it('should handle repetitive punctuation', function () {
    expect(
      tokenizer.tokenize('I love you!! Do you love me??')
    ).toEqual(['I love you!!', 'Do you love me??'
    ])
  })

  it('should handle repetitive punctuation with space', function () {
    expect(
      tokenizer.tokenize('I love you! ! Do you love me? ?')
    ).toEqual(['I love you! !', 'Do you love me? ?'
    ])
  })

  it('should handle decimal numbers in sentences', function () {
    expect(
      tokenizer.tokenize('Pi is approximately equal to 3.14.')
    ).toEqual([
      'Pi is approximately equal to 3.14.'
    ])
  })

  it('should tokenize text with a number like "1)" present ', function () {
    expect(
      tokenizer.tokenize("This is a sentence that can't 1) be parsed with SentenceTokenizerNew. Here is another sentence.")
    ).toEqual([
      "This is a sentence that can't 1) be parsed with SentenceTokenizerNew.",
      'Here is another sentence.'
    ])
  })

  it('should handle periods in email addresses', function () {
    expect(
      tokenizer.tokenize('My email address is batman@example.com.')
    ).toEqual([
      'My email address is batman@example.com.'
    ])
  })

  it('should handle periods in web addresses', function () {
    expect(
      tokenizer.tokenize('My twitter feed can be found at https://twitter.com/user1.')
    ).toEqual([
      'My twitter feed can be found at https://twitter.com/user1.'
    ])
  })

  it('should handle an ellipsis followed by punctuation', function () {
    expect(
      tokenizer.tokenize('Is this the end for our heroes...?')
    ).toEqual([
      'Is this the end for our heroes...?'
    ])
  })

  it('should handle multiple spaces separating sentences', function () {
    expect(
      tokenizer.tokenize('Tune in tomorrow and find out!  Same Bat-Time!  Same Bat-Channel!')
    ).toEqual([
      'Tune in tomorrow and find out!',
      'Same Bat-Time!',
      'Same Bat-Channel!'
    ])
  })

  it('should handle a sentence that does not end with punctuation (issue #549))', function () {
    expect(
      tokenizer.tokenize('This is a sentence. But is this also one')
    ).toEqual([
      'This is a sentence.',
      'But is this also one'
    ])
  })

  it('should handle a sentence that contains a quoted phrase (issue #550 but with . and ’ reversed))', function () {
    expect(
      tokenizer.tokenize('This is a sentence. And another where ‘Someone says something’.')
    ).toEqual([
      'This is a sentence.',
      'And another where ‘Someone says something’.'
    ])
  })

  it('should handle sentences with an abbreviation', function () {
    expect(
      tokenizer.tokenize('Acme, Inc. is creating exciting products. Use at your own risk.')
    ).toEqual([
      'Acme, Inc. is creating exciting products.',
      'Use at your own risk.'
    ])
    expect(
      tokenizer.tokenize('I need the parts A.S.A.P. please. Send them when they are ready')
    ).toEqual(
      [
        'I need the parts A.S.A.P. please.',
        'Send them when they are ready'
      ]
    )
    expect(
      tokenizer.tokenize('I need the parts from Inc.. Send them when they are ready!')
    ).toEqual(
      [
        'I need the parts from Inc..',
        'Send them when they are ready!'
      ]
    )
  })
  it('Should correctly parse multiple sentences with a subset of the sentences surrounded with quotes', function() {
    expect(
      tokenizer.tokenize('\"All ticketed passengers should now be in the Blue Concourse sleep lounge. Make sure your validation papers are in order. Thank you." The upstairs lounge was not at all grungy.')
    ).toEqual(
      [
        '"',
        'All ticketed passengers should now be in the Blue Concourse sleep lounge.',
        'Make sure your validation papers are in order.',
        'Thank you.',
        '"',
        'The upstairs lounge was not at all grungy.'
      ]
    )
  })
})
