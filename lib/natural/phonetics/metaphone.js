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

class Metaphone extends Phonetic {
  dedup (token) {
    return token.replace(/([^c])\1/g, '$1')
  }

  dropInitialLetters (token) {
    if (token.match(/^(kn|gn|pn|ae|wr)/)) { return token.substr(1, token.length - 1) }

    return token
  }

  dropBafterMAtEnd (token) {
    return token.replace(/mb$/, 'm')
  }

  cTransform (token) {
    token = token.replace(/([^s]|^)(c)(h)/g, '$1x$3').trim()

    token = token.replace(/cia/g, 'xia')
    token = token.replace(/c(i|e|y)/g, 's$1')
    token = token.replace(/c/g, 'k')

    return token
  }

  dTransform (token) {
    token = token.replace(/d(ge|gy|gi)/g, 'j$1')
    token = token.replace(/d/g, 't')

    return token
  }

  dropG (token) {
    token = token.replace(/gh(^$|[^aeiou])/g, 'h$1')
    token = token.replace(/g(n|ned)$/g, '$1')

    return token
  }

  transformG (token) {
    token = token.replace(/gh/g, 'f')
    token = token.replace(/([^g]|^)(g)(i|e|y)/g, '$1j$3')
    token = token.replace(/gg/g, 'g')
    token = token.replace(/g/g, 'k')

    return token
  }

  dropH (token) {
    return token.replace(/([aeiou])h([^aeiou]|$)/g, '$1$2')
  }

  transformCK (token) {
    return token.replace(/ck/g, 'k')
  }

  transformPH (token) {
    return token.replace(/ph/g, 'f')
  }

  transformQ (token) {
    return token.replace(/q/g, 'k')
  }

  transformS (token) {
    return token.replace(/s(h|io|ia)/g, 'x$1')
  }

  transformT (token) {
    token = token.replace(/t(ia|io)/g, 'x$1')
    token = token.replace(/th/, '0')

    return token
  }

  dropT (token) {
    return token.replace(/tch/g, 'ch')
  }

  transformV (token) {
    return token.replace(/v/g, 'f')
  }

  transformWH (token) {
    return token.replace(/^wh/, 'w')
  }

  dropW (token) {
    return token.replace(/w([^aeiou]|$)/g, '$1')
  }

  transformX (token) {
    token = token.replace(/^x/, 's')
    token = token.replace(/x/g, 'ks')
    return token
  }

  dropY (token) {
    return token.replace(/y([^aeiou]|$)/g, '$1')
  }

  transformZ (token) {
    return token.replace(/z/, 's')
  }

  dropVowels (token) {
    return token.charAt(0) + token.substr(1, token.length).replace(/[aeiou]/g, '')
  }

  process (token, maxLength) {
    const maxLengthNew = maxLength || 32
    token = token.toLowerCase()
    token = this.dedup(token)
    token = this.dropInitialLetters(token)
    token = this.dropBafterMAtEnd(token)
    token = this.transformCK(token)
    token = this.cTransform(token)
    token = this.dTransform(token)
    token = this.dropG(token)
    token = this.transformG(token)
    token = this.dropH(token)
    token = this.transformPH(token)
    token = this.transformQ(token)
    token = this.transformS(token)
    token = this.transformX(token)
    token = this.transformT(token)
    token = this.dropT(token)
    token = this.transformV(token)
    token = this.transformWH(token)
    token = this.dropW(token)
    token = this.dropY(token)
    token = this.transformZ(token)
    token = this.dropVowels(token)

    token.toUpperCase()
    if (token.length >= maxLengthNew) { token = token.substring(0, maxLengthNew) }

    return token.toUpperCase()
  }
}

module.exports = Metaphone
