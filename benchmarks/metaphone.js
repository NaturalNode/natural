
const fs = require('fs')
const natural = require('../')
const metaphone = natural.Metaphone.process

/* global suite */

// single word

suite.bench('metaphone() word', function (next) {
  metaphone('stephen')
  next()
})

// small body of text

const words = fs.readFileSync('lib/natural/index.js', 'utf8').split(/\W+/)
suite.bench('metaphone() small', function (next) {
  for (let i = 0, len = words.length; i < len; ++i) {
    metaphone(words[i])
  }
  next()
})

// medium body of text

const words2 = fs.readFileSync('README.md', 'utf8').split(/\W+/)
suite.bench('metaphone() medium', function (next) {
  for (let i = 0, len = words2.length; i < len; ++i) {
    metaphone(words2[i])
  }
  next()
})
