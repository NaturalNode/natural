
/**
 * Module dependencies.
 */

const uubench = require('uubench')

/* global suite:writable */
suite = new uubench.Suite({
  start: function () {
    console.log()
  },

  result: function (name, stats) {
    const persec = 1000 / stats.elapsed
    const ops = stats.iterations * persec
    console.log('%s : %s ops/s', name, ops | 0)
  },

  done: function () {
    console.log()
  }
})

require('./metaphone')
require('./soundex')
require('./stemmer_id')

suite.run()
