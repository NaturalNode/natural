/*
Copyright (c) 2023, Hugo W.L. ter Doest

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

// Converts a diff file from snowball.tartarus.org to a JSON file

const fs = require('fs')
const filenameIn = './snowball-de-diffs.txt'
const dict = {}
const filenameOut = './snowball_de.json'

fs.readFile(filenameIn, 'utf8', function (err, data) {
  if (err) {
    console.log(err)
  } else {
    console.log('Raw data read from ' + filenameIn)
    const lines = data.split(/[\r\n]+/)
    lines.forEach(line => {
      const pair = line.split(/\s+/)
      dict[pair[0]] = pair[1]
    })
  }
  fs.writeFile(filenameOut, JSON.stringify(dict, null, 2), null, function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('Dictionary written to ' + filenameOut)
    }
  })
})
