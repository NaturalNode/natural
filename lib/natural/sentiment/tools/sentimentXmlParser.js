/*
Copyright (c) 2019, Hugo W.L. ter Doest

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

const fs = require('fs')
const parseString = require('xml2js').parseString

const xml = fs.readFileSync('senticon.ca.xml', 'utf8')

const list = {}

parseString(xml, function (err, result) {
  if (err) {
    console.log(err)
    return
  }
  for (let i = 0; i < result.senticon.layer.length; i++) {
    for (let j = 0; j < result.senticon.layer[i].positive[0].lemma.length; j++) {
      // console.log(util.inspect(result.senticon.layer[i].negative[0].lemma[j], false, null))
      list[result.senticon.layer[i].positive[0].lemma[j]._] = result.senticon.layer[i].positive[0].lemma[j].$
    }
    for (let n = 0; n < result.senticon.layer[i].negative[0].lemma.length; n++) {
      list[result.senticon.layer[i].negative[0].lemma[n]._] = result.senticon.layer[i].negative[0].lemma[n].$
    }
  }
})

const listTrimmed = {}

for (const token in list) {
  listTrimmed[token.replace(/ /gi, '').replace(/_/gi, ' ')] = list[token]
}
console.log(listTrimmed)
// console.log(util.inspect(list, false, null))
console.log(Object.keys(listTrimmed).length)

fs.writeFileSync('senticon_ca.json', JSON.stringify(listTrimmed, null, 2))
