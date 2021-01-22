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

const baseFolder = '/home/hugo/Workspace/pattern/pattern/text/'
// var inputFile = baseFolder + "nl/nl-sentiment.xml";
// var outputFile = baseFolder + "nl/nl-sentiment.json";
// var inputFile = baseFolder + "fr/fr-sentiment.xml";
// var outputFile = baseFolder + "fr/fr-sentiment.json";
// var inputFile = baseFolder + "en/en-sentiment.xml";
// var outputFile = baseFolder + "en/en-sentiment.json";
const inputFile = baseFolder + 'it/it-sentiment.xml'
const outputFile = baseFolder + 'it/pattern-sentiment-it.json'

const xml = fs.readFileSync(inputFile, 'utf8')
const list = {}

parseString(xml, function (err, result) {
  if (err) {
    console.log(err)
    return
  }
  // console.log(JSON.stringify(result, null, 2));
  console.log(result.sentiment.word.length)
  for (let i = 0; i < result.sentiment.word.length; i++) {
    console.log(result.sentiment.word[i].$.form)
    list[result.sentiment.word[i].$.form] = result.sentiment.word[i].$
  }
})

console.log(Object.keys(list).length)

fs.writeFileSync(outputFile, JSON.stringify(list, null, 2))
