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

const fs = require('fs')

function appendLineChar (fd, pos, buffPos, buff, callbackFunction) {
  if (buffPos >= buff.length) {
    const newBuff = Buffer.alloc(buff.length * 2)
    buff.copy(newBuff, 0, 0, buff.length)
    buff = newBuff
  }

  fs.read(fd, buff, buffPos, 1, pos, function (err, count) {
    if (err) { console.log(err) } else {
      if (buff[buffPos] === 10 || buffPos === buff.length) {
        callbackFunction(buff.slice(0, buffPos).toString('UTF-8'))
      } else {
        appendLineChar(fd, pos + 1, buffPos + 1, buff, callbackFunction)
      }
    }
  })
}

function open (callback) {
  const filePath = this.filePath

  fs.open(filePath, 'r', null, function (err, fd) {
    if (err) {
      console.log('Unable to open %s', filePath)
      return
    }
    callback(err, fd, function () {
      fs.close(fd, function (error) {
        if (error) {
          throw error
        }
      })
    })
  })
}

const WordNetFile = function (dataDir, fileName) {
  this.dataDir = dataDir
  this.fileName = fileName
  this.filePath = require('path').join(this.dataDir, this.fileName)
}

WordNetFile.prototype.open = open
WordNetFile.appendLineChar = appendLineChar

module.exports = WordNetFile
