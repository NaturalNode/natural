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

var WordNetFile = require('./wordnet_file'),
  fs = require('fs'),
  util = require('util');

function getFileSize(path) {
  var stat = fs.statSync(path);
  return stat.size;
}

function findPrevEOL(fd, pos, callback) {
  var buff = new Buffer(1024);
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

function readLine(fd, pos, callback) {
  var buff = new Buffer(1024);
  findPrevEOL(fd, pos, function(pos) {
    WordNetFile.appendLineChar(fd, pos, 0, buff, callback);
  });
}

function miss(callback) {
  callback({status: 'miss'});
}

function findAt(fd, size, pos, lastPos, adjustment, searchKey, callback, lastKey) {
  if (lastPos == pos || pos >= size) {
    miss(callback);
  } else {
    readLine(fd, pos, function(line) {
      var tokens = line.split(/\s+/);
      var key = tokens[0];

    if(key == searchKey) {
        callback({status: 'hit', key: key, 'line': line, tokens: tokens});
      } else if(adjustment == 1 || key == lastKey)  {
        miss(callback);
      } else {
        adjustment = Math.ceil(adjustment * 0.5);

        if (key < searchKey) {
          findAt(fd, size, pos + adjustment, pos, adjustment, searchKey, callback, key);
        } else {
          findAt(fd, size, pos - adjustment, pos, adjustment, searchKey, callback, key);
        }
      }
    });
  }
}

function find(searchKey, callback) {
  var indexFile = this;

  indexFile.open(function(err, fd, done) {
    if(err) {
      console.log(err);
    } else {
      var size = getFileSize(indexFile.filePath) - 1;
      var pos = Math.ceil(size / 2);
      findAt(fd, size, pos, null, pos, searchKey,
        function(result) { callback(result); done(); });
    }
  });
}

function lookupFromFile(word, callback) {
  this.find(word, function(record) {
    var indexRecord = null;

    if(record.status == 'hit') {
      var ptrs = [], offsets = [];

      for(var i = 0; i < parseInt(record.tokens[3]); i++)
        ptrs.push(record.tokens[i]);

      for(var i = 0; i < parseInt(record.tokens[2]); i++)
        offsets.push(parseInt(record.tokens[ptrs.length + 6 + i], 10));

      indexRecord = {
        lemma: record.tokens[0],
        pos: record.tokens[1],
        ptrSymbol: ptrs,
        senseCnt:  parseInt(record.tokens[ptrs.length + 4], 10),
        tagsenseCnt:  parseInt(record.tokens[ptrs.length + 5], 10),
        synsetOffset:  offsets
      };
    }

    callback(indexRecord);
  });
}

function lookup(word, callback) {
  this.lookupFromFile(word, callback);
}

var IndexFile = function(dataDir, name) {
  WordNetFile.call(this, dataDir, 'index.' + name);
};

util.inherits(IndexFile, WordNetFile);

IndexFile.prototype.lookupFromFile = lookupFromFile;
IndexFile.prototype.lookup = lookup;
IndexFile.prototype.find = find;

IndexFile.prototype._findAt = findAt;

module.exports = IndexFile;
