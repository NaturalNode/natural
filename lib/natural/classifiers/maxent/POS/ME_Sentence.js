/*
Sentence class specific for MaxEnt modeling
Copyright (C) 2019 Hugo W.L. ter Doest

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

const util = require('util')
const Context = require('../Context')
const Sentence = require('../../../brill_pos_tagger/lib/Sentence')
const Element = require('./POS_Element')

function MESentence (data) {
  MESentence.super_.call(this, data)
}

util.inherits(MESentence, Sentence)

MESentence.prototype.generateSampleElements = function (sample) {
  const sentence = this.taggedWords
  sentence.forEach(function (token, index) {
    const x = new Element(
      token.tag,
      new Context({
        wordWindow: {},
        tagWindow: {}
      })
    )

    // Current word and tag
    x.b.data.wordWindow['0'] = token.token
    x.b.data.tagWindow['0'] = sentence[index].tag

    // Previous bigram
    if (index > 1) {
      x.b.data.tagWindow['-2'] = sentence[index - 2].tag
      x.b.data.wordWindow['-2'] = sentence[index - 2].token
    }

    // Left bigram
    if (index > 0) {
      x.b.data.tagWindow['-1'] = sentence[index - 1].tag
      x.b.data.wordWindow['-1'] = sentence[index - 1].token
    }

    // Right bigram
    if (index < sentence.length - 1) {
      x.b.data.tagWindow['1'] = sentence[index + 1].tag
      x.b.data.wordWindow['1'] = sentence[index + 1].token
    }

    // Next bigram
    if (index < sentence.length - 2) {
      x.b.data.tagWindow['2'] = sentence[index + 2].tag
      x.b.data.wordWindow['2'] = sentence[index + 2].token
    }

    sample.addElement(x)
  })
}

module.exports = MESentence
