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

function get(location, callback) {
  var buff = new Buffer(4096);                                                  

  this.open(function(err, fd, done) {
    WordNetFile.appendLineChar(fd, location, 0, buff, function(line) {
      done();                                                                   
      var data = line.split('| ');                                              
      var tokens = data[0].split(/\s+/);                                        
      var ptrs = [];                                                            
      var wCnt = parseInt(tokens[3], 10);                                       
      var synonyms = [];                                                        

      for(var i = 0; i < wCnt; i++) {                                           
	synonyms.push(tokens[4 + i * 2]);                                       
      } 

      for(var i = 0; i < parseInt(tokens[6], 10); i++) {                        
	ptrs.push({
          pointerSymbol: tokens[7 + i * 4],
          synsetOffset: parseInt(tokens[8 + i * 4], 10),
          pos: tokens[9 + i * 4],
          sourceTarget: tokens[10 + i * 4]
	});                                                                     
      } 

      callback({
	synsetOffset: parseInt(tokens[0], 10),
	lexFilenum: parseInt(tokens[1], 10),
	pos: tokens[2],
	wCnt: wCnt,
	lemma: tokens[4],
	synonyms: synonyms,
	lexId: tokens[5],
	ptrs: ptrs,
	gloss: data[1]
      });                                                                       
    });                                                                         
  });                                                                           
}

var DataFile = function(dataDir, base, name) {
  WordNetFile.call(this, dataDir, base, 'data.' + name);
};

util.inherits(DataFile, WordNetFile);
DataFile.prototype.get = get;

module.exports = DataFile;
