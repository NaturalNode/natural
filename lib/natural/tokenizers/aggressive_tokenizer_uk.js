'use strict'

const Tokenizer = require('./tokenizer')
const util = require('util')

const AggressiveTokenizer = function () {
  Tokenizer.call(this)
}

util.inherits(AggressiveTokenizer, Tokenizer)

module.exports = AggressiveTokenizer

AggressiveTokenizer.prototype.withoutEmpty = function (array) {
  return array.filter(function (a) { return a })
}

AggressiveTokenizer.prototype.clearText = function (text) {
  return text.replace(/[^a-zа-яґєії0-9]/gi, ' ').replace(/[\s\n]+/g, ' ').trim()
}

AggressiveTokenizer.prototype.tokenize = function (text) {
  // break a string up into an array of tokens by anything non-word
  return this.withoutEmpty(this.clearText(text).split(' '))
}
