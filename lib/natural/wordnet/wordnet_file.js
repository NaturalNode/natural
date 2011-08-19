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

var compress = require('compress'),
  gzip = new compress.Gunzip()
  fs = require('fs'),
  path = require('path'),
  url = require('url');

function downloadFile(url, filePath, callback) {
  gzip.init();

  var http = require('http');
  var client = http.createClient(80, url.host);
  var request = client.request('GET', url.pathname, {host: url.host});
  
  client.on('error', function(err) {
	  console.log(err);
    callback();
  });
  
  request.end();

  var fileStream = fs.createWriteStream(filePath);

  fs.open(filePath, 'w', null, function(err, outFd) {    
    request.on('response', function(response) {
      var size = parseInt(response.headers['content-length']);
      var progress = 0;
  
      response.on('data', function(data) {
        var rawLen = data.length;
        data = gzip.inflate(data.toString('binary'), 'binary');
        var outBuff = new Buffer(data.length);
        outBuff.write(data.toString(), 0, 'binary');
  
	fileStream.write(outBuff, 'binary');
	progress += rawLen;
  
	if(progress >= size) {
	  fileStream.end();
          callback();
	};
      });
    });
  });
}

function appendLineChar(fd, pos, buffPos, buff, callback) {
  fs.read(fd, buff, buffPos, 1, pos, function(err, count) {
    if(err)
      console.log(err);
    else {
      if(buff[buffPos] == 10 || buffPos == buff.length)
        callback(buff.slice(0, buffPos).toString('ASCII'));
      else {
        appendLineChar(fd, pos + 1, buffPos + 1, buff, callback);
      }
    }
  });
}

function open(callback) {
  var filePath = this.filePath;
  var url = this.url;
  
  path.exists(filePath, function(exists) {
    var _open = function(){
      fs.open(filePath, 'r', null, function(err, fd) {    
        callback(err, fd, function() {fs.close(fd)});
      });
    };
    
    if(exists) {
      _open();
    } else {
      downloadFile(url, filePath, function() {
        _open();
      })
    }
  });
}

var WordNetFile = function(dataDir, base, fileName) {
  this.dataDir = dataDir;
  this.fileName = fileName;
  this.url = url.parse(url.resolve(base, this.fileName + '.gz'));
  this.filePath = require('path').join(this.dataDir, this.fileName);
};

WordNetFile.prototype.open = open;
WordNetFile.appendLineChar = appendLineChar;

module.exports = WordNetFile;
