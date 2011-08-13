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

var fs = require('fs');

function getFileSize(path) {
  var stat = fs.statSync(path);
  return stat.size;
}

function findPrevEOL(fd, pos, callback) {
  var buff = new Buffer(128);
    
  if(pos == 0)
    callback(0);
  else {
    fs.read(fd, buff, 0, 1, pos, function(err, count) {
      if(buff[0] == 10)
        callback(pos + 1);
      else
        findPrevEOL(fd, pos - 1, callback);
    });
  }
}

function appendLineChar(fd, pos, buffPos, buff, callback) {
  fs.read(fd, buff, buffPos, 1, pos, function(err, count) {
    if(buff[buffPos] == 10)
      callback(buff.slice(0, buffPos).toString('ASCII'));
    else
      appendLineChar(fd, pos + 1, buffPos + 1, buff, callback);
  });
}

function readLine(fd, pos, callback) {
  var buff = new Buffer(256);  

  findPrevEOL(fd, pos, function(pos) {
    appendLineChar(fd, pos, 0, buff, callback);
  });
}

function miss(callback) {
  callback({status: 'miss'});
}

function findAt(fd, size, pos, lastPos, adjustment, searchKey, callback) {
  if (lastPos == pos || pos >= size) {
    miss(callback);
  } else {
    readLine(fd, pos, function(line) {
      var tokens = line.split(/\s+/);
      var key = tokens[0];
    
      if(key == searchKey) {
        callback({status: 'hit', key: key, 'line': line, tokens: tokens});
      } else if(adjustment == 1)  {
        miss(callback);
      } else {      
        adjustment = Math.ceil(adjustment * 0.5);

        if (key < searchKey) {
          findAt(fd, size, pos + adjustment, pos, adjustment, searchKey, callback);
        } else {
          findAt(fd, size, pos - adjustment, pos, adjustment, searchKey, callback);
        }
      }
    });
  }
}

function find(fileName, searchKey, callback) {
  fs.open(fileName, 'r', null, function(err, fd) {
    if(err) {
      console.log(err);
    } else {
      var size = getFileSize(fileName) - 1;
      var pos = Math.ceil(size / 2);
      findAt(fd, size, pos, null, pos, searchKey, callback);
    }
  });
}

exports.find = find;
