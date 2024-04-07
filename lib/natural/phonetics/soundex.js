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

const Phonetic = require('./phonetic')

class SoundEx extends Phonetic {
  process (token, maxLength) {
    token = token.toLowerCase()
    let transformed = this.condense(this.transform(token.substr(1, token.length - 1))) // anything that isn't a digit goes
    // deal with duplicate INITIAL consonant SOUNDS
    transformed = transformed.replace(new RegExp('^' + this.transform(token.charAt(0))), '')
    return token.charAt(0).toUpperCase() + this.padRight0(transformed.replace(/\D/g, '')).substr(0, (maxLength && maxLength - 1) || 3)
  }

  transformLipps (token) {
    return token.replace(/[bfpv]/g, '1')
  }

  transformThroats (token) {
    return token.replace(/[cgjkqsxz]/g, '2')
  }

  transformToungue (token) {
    return token.replace(/[dt]/g, '3')
  }

  transformL (token) {
    return token.replace(/l/g, '4')
  }

  transformHum (token) {
    return token.replace(/[mn]/g, '5')
  }

  transformR (token) {
    return token.replace(/r/g, '6')
  }

  condense (token) {
    return token.replace(/(\d)?\1+/g, '$1')
  }

  padRight0 (token) {
    if (token.length < 4) { return token + Array(4 - token.length).join('0') } else { return token }
  }

  transform (token) {
    return this.transformLipps(this.transformThroats(
      this.transformToungue(this.transformL(this.transformHum(this.transformR(token))))))
  }
}

module.exports = SoundEx
