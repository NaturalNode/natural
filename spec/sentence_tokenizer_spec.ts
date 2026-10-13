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

import { SentenceTokenizer as Tokenizer } from 'lib/natural'

const testData = [
  {
    it: 'should tokenize strings and trim whitespace',
    input: 'This is a sentence. This is another sentence.',
    output: ['This is a sentence.', 'This is another sentence.']
  },
  {
    it: 'should include quotation marks',
    input: '"This is a sentence." This is another sentence.',
    output: ['"This is a sentence."', 'This is another sentence.']
  },
  {
    it: 'should include brackets',
    input: 'This is a sentence. [This is another sentence.]',
    output: ['This is a sentence.', '[This is another sentence.]']
  },
  {
    it: 'should handle repetitive punctuation',
    input: 'I love you!! Do you love me??',
    output: ['I love you!!', 'Do you love me??']
  },
  {
    it: 'should handle repetitive punctuation with space',
    input: 'I love you! ! Do you love me? ?',
    output: ['I love you! !', 'Do you love me? ?']
  },
  {
    it: 'should handle decimal points in numbers',
    input: 'Pi is approximately equal to 3.14.',
    output: ['Pi is approximately equal to 3.14.']
  },
  {
    it: 'should tokenize text with a number like "1)" present ',
    input: "This is a sentence that can't 1) be parsed with SentenceTokenizerNew. Here is another sentence.",
    output: [
      "This is a sentence that can't 1) be parsed with SentenceTokenizerNew.",
      'Here is another sentence.'
    ]
  },
  {
    it: 'should handle periods in email addresses',
    input: 'My email address is batman@example.com.',
    output: ['My email address is batman@example.com.']
  },
  {
    it: 'should handle periods in web addresses',
    input: 'My twitter feed can be found at https://twitter.com/user1.',
    output: ['My twitter feed can be found at https://twitter.com/user1.']
  },
  {
    it: 'should handle an ellipsis followed by punctuation',
    input: 'Is this the end for our heroes...?',
    output: ['Is this the end for our heroes...?']
  },
  {
    it: 'should handle multiple spaces separating sentences',
    input: 'Tune in tomorrow and find out!  Same Bat-Time!  Same Bat-Channel!',
    output: [
      'Tune in tomorrow and find out!',
      'Same Bat-Time!',
      'Same Bat-Channel!'
    ]
  },
  {
    it: 'should handle braces and quotes (issue #591) part 1',
    input: 'Teste. Test test. Test test: “Test.”',
    output: [
      'Teste.',
      'Test test.',
      'Test test: “Test.”'
    ]
  },
  {
    it: 'should handle braces and quotes (issue #591) part 2',
    input: 'Test Test. Test test, test test (test test) test: “Test.”',
    output: [
      'Test Test.',
      'Test test, test test (test test) test: “Test.”'
    ]
  },
  {
    it: 'should handle braces and quotes (issue #591) part 3',
    input: 'Test Test. Test test, test (test) test (test test) test: “Test.”',
    output: [
      'Test Test.',
      'Test test, test (test) test (test test) test: “Test.”'
    ]
  },
  {
    it: 'should handle braces and quotes (issue #591) part 4',
    input: 'Test: Test (test) test “Test.”',
    output: ['Test: Test (test) test “Test.”']
  },
  {
    it: 'Should handle text with the ellipsis symbol … (issue #648)',
    input: 'We’re heading for a catastrophic global temperature rise… Fires are blazing from the Amazon to the Arctic.',
    output: [
      'We’re heading for a catastrophic global temperature rise…',
      'Fires are blazing from the Amazon to the Arctic.'
    ]
  },
  {
    it: 'It should handle last sentence without punctuation (issue #648)',
    input: 'We’re heading for a catastrophic global temperature rise. Fires are blazing from the Amazon to the Arctic',
    output: [
      'We’re heading for a catastrophic global temperature rise.',
      'Fires are blazing from the Amazon to the Arctic'
    ]
  },
  {
    it: 'It should handle the example from issue #689 correctly',
    input: `This is some test content.

      We're trying to figure out variations in versions of the package.`,
    output: [
      'This is some test content.',
      'We\'re trying to figure out variations in versions of the package.'
    ]
  },
  {
    it: 'should handle abbreviations correctly 1',
    input: 'i.e.',
    output: ['i.e.']
  },
  {
    it: 'should handle abbreviations correctly 2',
    input: 'Acme, Inc. is creating exciting products. Use at your own risk.',
    output: [
      'Acme, Inc. is creating exciting products.',
      'Use at your own risk.'
    ]
  },
  {
    it: 'should handle abbreviations correctly 3',
    input: 'I need the parts A.S.A.P. please. Send them when they are ready',
    // input: 'I A.S.A.P. read',
    output: [
      'I need the parts A.S.A.P. please.',
      'Send them when they are ready'
    ]
  },
  {
    it: 'should handle abbreviations correctly 4',
    input: 'I need the parts from Inc.. Send them when they are ready!',
    output: [
      'I need the parts from Inc..',
      'Send them when they are ready!'
    ]
  },
  {
    it: 'It should handle the example from issue #750 correctly',
    input: '"A card must be of uniform thickness and made of unfolded and uncreased paper or cardstock of approximately the quality and weight of a stamped card (i.e., a card available from USPS)."',
    output: ['"A card must be of uniform thickness and made of unfolded and uncreased paper or cardstock of approximately the quality and weight of a stamped card (i.e., a card available from USPS)."']
  },
  {
    it: 'should handle a sentence that does not end with punctuation (issue #549))',
    input: 'This is a sentence. But is this also one',
    output: [
      'This is a sentence.',
      'But is this also one'
    ]
  },
  {
    it: 'should handle a sentence that contains a quoted phrase (issue #550 but with . and ’ reversed))',
    input: 'This is a sentence. And another where ‘Someone says something’.',
    output: [
      'This is a sentence.',
      'And another where ‘Someone says something’.'
    ]
  },
  {
    it: 'Should correctly parse multiple sentences with a subset of the sentences surrounded with quotes',
    input: '"All ticketed passengers should now be in the Blue Concourse sleep lounge. Make sure your validation papers are in order. Thank you." The upstairs lounge was not at all grungy.',
    output: [
      '"All ticketed passengers should now be in the Blue Concourse sleep lounge.',
      'Make sure your validation papers are in order.',
      'Thank you."',
      'The upstairs lounge was not at all grungy.'
    ]
  }
]

describe('sentence_tokenizer', function () {
  let tokenizer: Tokenizer

  beforeAll(function () {
    tokenizer = new Tokenizer(['i.e.', 'etc.', 'vs.', 'Inc.', 'A.S.A.P.'],
      ['.', '!', '?', '\n', '\r', '...', '…'])
  })

  testData.forEach(({ it: description, input, output }) => {
    it(description, function () {
      expect(tokenizer.tokenize(input)).toEqual(output)
    })
  })
})

describe('sentence_tokenizer abbreviations that end other words', function () {
  let tokenizer: Tokenizer

  beforeAll(function () {
    tokenizer = new Tokenizer(['Mr.', 'Dr.', 'St.', 'e.g.', 'Inc.'])
  })

  const testData = [
    {
      it: 'should not treat the end of "best." as the abbreviation "St."',
      input: 'This is the best. Next one starts here.',
      output: ['This is the best.', 'Next one starts here.']
    },
    {
      it: 'should not treat the end of "zinc." as the abbreviation "Inc."',
      input: 'We love zinc. It is a metal.',
      output: ['We love zinc.', 'It is a metal.']
    },
    {
      it: 'should not treat the end of "list." as the abbreviation "St."',
      input: 'See the list. Then go.',
      output: ['See the list.', 'Then go.']
    },
    {
      it: 'should not treat the end of a word with a non-ASCII letter as an abbreviation',
      input: 'Hon har en fin röst. Han sjunger.',
      output: ['Hon har en fin röst.', 'Han sjunger.']
    },
    {
      it: 'should still treat "Mr." as an abbreviation',
      input: 'Mr. Smith went to Washington. He liked it.',
      output: ['Mr. Smith went to Washington.', 'He liked it.']
    },
    {
      it: 'should still treat "Dr." as an abbreviation',
      input: 'We met Dr. Who. He was nice.',
      output: ['We met Dr. Who.', 'He was nice.']
    },
    {
      it: 'should still treat an abbreviation as such regardless of case',
      input: 'MR. SMITH came. He left.',
      output: ['MR. SMITH came.', 'He left.']
    },
    {
      it: 'should still treat "e.g." as an abbreviation after a comma or an opening bracket',
      input: 'Use fruit, e.g. apples (e.g. pears). They are tasty.',
      output: ['Use fruit, e.g. apples (e.g. pears).', 'They are tasty.']
    },
    {
      it: 'should still treat a standalone "St." as an abbreviation',
      input: 'He lives on Main St. Nobody knows it.',
      output: ['He lives on Main St. Nobody knows it.']
    }
  ]

  testData.forEach(({ it: description, input, output }) => {
    it(description, function () {
      expect(tokenizer.tokenize(input)).toEqual(output)
    })
  })
})

// describe('sentence_tokenizer with trimSentences set to false', function () {
//   let tokenizer: Tokenizer

//   beforeAll(function () {
//     tokenizer = new Tokenizer(['i.e.', 'etc.', 'vs.', 'Inc.', 'A.S.A.P.'],
//       ['.', '!', '?', '\n', '\r', '...', '…'], false)
//   })

//   it('should tokenize strings but not trim whitespace if trimSentences is false', function () {
//     expect(tokenizer.tokenize('This is a sentence. This is another sentence.')).toEqual(['This is a sentence. ', 'This is another sentence.'])
//   })
// })
