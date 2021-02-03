const fs = require('fs')
const natural = require('../')
const soundex = natural.SoundEx.process

/* global suite */

// single word

suite.bench('soundex() word', function (next) {
  soundex('stephen')
  next()
})

// small body of text

const words = fs.readFileSync('lib/natural/index.js', 'utf8').split(/\W+/)
suite.bench('soundex() small', function (next) {
  for (let i = 0, len = words.length; i < len; ++i) {
    soundex(words[i])
  }
  next()
})

// medium body of text

const words2 = fs.readFileSync('README.md', 'utf8').split(/\W+/)
suite.bench('soundex() medium', function (next) {
  for (let i = 0, len = words2.length; i < len; ++i) {
    soundex(words2[i])
  }
  next()
})
