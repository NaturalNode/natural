/*
Copyright (c) 2024, Hugo W.L. ter Doest

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

const Tokenizer = require('./tokenizer')

// Strings that will be used to create placeholders
const NUM = 'NUMBER'
const DELIM = 'DELIM'
const URI = 'URI'
const ABBREV = 'ABBREV'

const DEBUG = false

function generateUniqueCode (base, index) {
  // Surround the placeholder with {{}} to prevent shorter numbers to be recognized
  // in larger numbers
  return `{{${base}_${index}}}`
}

function escapeRegExp (string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

class SentenceTokenizer extends Tokenizer {
  constructor (abbreviations) {
    super()
    if (abbreviations) {
      this.abbreviations = abbreviations
    } else {
      this.abbreviations = []
    }
    this.replacementMap = null
    this.replacementCounter = 0
  }

  replaceUrisWithPlaceholders (text) {
    const urlPattern = /(https?:\/\/\S+|www\.\S+|ftp:\/\/\S+|(mailto:)?[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|file:\/\/\S+)/gi

    const modifiedText = text.replace(urlPattern, (match) => {
      const placeholder = generateUniqueCode(URI, this.replacementCounter++)
      this.replacementMap.set(placeholder, match)
      return placeholder
    })

    return modifiedText
  }

  replaceAbbreviations (text) {
    if (this.abbreviations.length === 0) {
      return text
    }
    const pattern = new RegExp(`(${this.abbreviations.map(abbrev => escapeRegExp(abbrev)).join('|')})`, 'gi')
    const replacedText = text.replace(pattern, match => {
      const code = generateUniqueCode(ABBREV, this.replacementCounter++)
      this.replacementMap.set(code, match)
      return code
    })

    return replacedText
  }

  replaceDelimitersWithPlaceholders (text) {
    // Regular expression for sentence delimiters optionally followed by a bracket or quote
    // Multiple delimiters with spaces in between are allowed
    // The expression makes sure that the sentence delimiter group ends with a sentence delimiter
    const delimiterPattern = /([.?!… ]*)([.?!…])(["'”’)}\]]?)/g
    const modifiedText = text.replace(delimiterPattern, (match, p1, p2, p3) => {
      const placeholder = generateUniqueCode(DELIM, this.replacementCounter++)
      this.delimiterMap.set(placeholder, p1 + p2 + p3)
      return placeholder
    })

    return modifiedText
  }

  splitOnPlaceholders (text, placeholders) {
    if (this.delimiterMap.size === 0) {
      return [text]
    }

    const keys = Array.from(this.delimiterMap.keys())
    const pattern = new RegExp(`(${keys.map(escapeRegExp).join('|')})`)
    const parts = text.split(pattern)

    const sentences = []
    for (let i = 0; i < parts.length; i += 2) {
      const sentence = parts[i]
      const placeholder = parts[i + 1] || ''
      sentences.push(sentence + placeholder)
    }

    return sentences
  }

  replaceNumbersWithCode (text) {
    // Regular expression to match numbers, including decimal points and commas
    const numberPattern = /\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\b/g

    const replacedText = text.replace(numberPattern, match => {
      const code = generateUniqueCode(NUM, this.replacementCounter++)
      this.replacementMap.set(code, match)
      return code
    })

    return replacedText
  }

  revertReplacements (text) {
    let originalText = text
    for (const [placeholder, replacement] of this.replacementMap.entries()) {
      const pattern = new RegExp(escapeRegExp(placeholder), 'g')
      originalText = originalText.replace(pattern, replacement)
    }

    return originalText
  }

  revertDelimiters (text) {
    let originalText = text
    for (const [placeholder, replacement] of this.delimiterMap.entries()) {
      const pattern = new RegExp(escapeRegExp(placeholder), 'g')
      originalText = originalText.replace(pattern, replacement)
    }

    return originalText
  }

  tokenize (text) {
    this.replacementCounter = 0
    this.replacementMap = new Map()
    this.delimiterMap = new Map()

    DEBUG && console.log('---Start of sentence tokenization-----------------------')
    DEBUG && console.log('Original input: >>>' + text + '<<<')
    // Replace abbreviations
    const result1 = this.replaceAbbreviations(text)
    DEBUG && console.log('Phase 1: replacing abbreviations: ' + JSON.stringify(result1))

    // Replace URIs
    const result2 = this.replaceUrisWithPlaceholders(result1)
    DEBUG && console.log('Phase 2: replacing URIs: ' + JSON.stringify(result2))

    // Replace delimiters followed by optional quotes, brackets, and braces
    const result3 = this.replaceNumbersWithCode(result2)
    DEBUG && console.log('Phase 3: replacing numbers with placeholders: ' + JSON.stringify(result3))

    // Replace delimiters followed by optional quotes, brackets, and braces
    const result4 = this.replaceDelimitersWithPlaceholders(result3)
    DEBUG && console.log('Phase 4: replacing delimiters with placeholders: ' + JSON.stringify(result4))

    // Split on placeholders for sentence delimiters
    const sentences = this.splitOnPlaceholders(result4)
    DEBUG && console.log('Phase 5: splitting into sentences on placeholders: ' + JSON.stringify(sentences))

    // Replace back all abbreviations, URIs, and delimiters
    const newSentences = sentences.map(s => {
      const s1 = this.revertReplacements(s)
      return this.revertDelimiters(s1)
    })
    DEBUG && console.log('Phase 6: replacing back abbreviations, URIs, numbers and delimiters: ' + JSON.stringify(newSentences))

    const trimmedSentences = this.trim(newSentences)
    DEBUG && console.log('Phase 7: trimming array of empty sentences: ' + JSON.stringify(trimmedSentences))

    const trimmedSentences2 = trimmedSentences.map(sent => sent.trim())
    DEBUG && console.log('Phase 8: trimming sentences from surrounding whitespace: ' + JSON.stringify(trimmedSentences2))
    DEBUG && console.log('---End of sentence tokenization--------------------------')
    DEBUG && console.log('---Replacement map---------------------------------------')
    DEBUG && console.log([...this.replacementMap.entries()])
    DEBUG && console.log('---Delimiter map-----------------------------------------')
    DEBUG && console.log([...this.delimiterMap.entries()])
    DEBUG && console.log('---------------------------------------------------------')

    return trimmedSentences2
  }
}

module.exports = SentenceTokenizer
