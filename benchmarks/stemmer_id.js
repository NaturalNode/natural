const fs = require('fs')
const natural = require('../')
const stemmerId = natural.StemmerId

/* global suite */

const words = fs.readFileSync('benchmarks/sample-id.txt', 'utf8').split(/\W+/)
suite.bench('stemmerId() sample text', function (next) {
  for (let i = 0, len = words.length; i < len; ++i) {
    stemmerId.stem(words[i])
  }
  next()
})
