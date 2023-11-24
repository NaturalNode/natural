'use strict'

const stopwords = require('../util/stopwords_uk')
const Tokenizer = require('../tokenizers/aggressive_tokenizer_uk')

module.exports = function () {
  const stemmer = this

  stemmer.stem = function (token) {
    return token
  }

  stemmer.tokenizeAndStem = function (text, keepStops) {
    const stemmedTokens = []

    new Tokenizer().tokenize(text).forEach(function (token) {
      if (keepStops || stopwords.words.indexOf(token) === -1) {
        let resultToken = token.toLowerCase()
        if (resultToken.match(/[а-яґєії0-9]+/gi)) {
          resultToken = stemmer.stem(resultToken)
        }
        stemmedTokens.push(resultToken)
      }
    })

    return stemmedTokens
  }
}
