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

const natural = require('natural')
const phonetic = natural.DoubleMetaphone

const sentence = 'phonetic modules contain algorithms'
const stdin = process.openStdin()
stdin.setEncoding('ascii')
// phonetic.attach()
process.stdout.write('enter a word that sounds like one of these, "' + sentence + '": ')

const words = phonetic.tokenizeAndPhoneticize(sentence, phonetic)
console.log(words)

function findMatch (input) {
  const inputSounds = phonetic.process(input)
  console.log(inputSounds)

  for (let i = 0; i < words.length; i++) {
    const wordSounds = words[i]

    if (wordSounds[0] === inputSounds[0] &&
        wordSounds[1] === inputSounds[1]) {
      process.stdout.write('match found!\n')
      return
    }
  }

  process.stdout.write('no match found.\n')
}

stdin.on('data', function (input) {
  findMatch(input)
  process.exit()
})
