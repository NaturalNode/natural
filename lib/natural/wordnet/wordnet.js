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

var IndexFile = require('./index_file'),
  DataFile = require('./data_file');

function pushResults(data, results, offsets, callback) {
  var wordnet = this;

  if(offsets.length == 0) {
    callback(results);
  } else {
    data.get(offsets.pop(), function(record) {
      results.push(record);
      wordnet.pushResults(data, results, offsets, callback);
    });  
  }
}

function getOffsetList(record) {
  if(record)
    return record.synsetOffset;
  else
    return [];
}

function lookupFromFiles(files, results, word, callback) {
  var wordnet = this;

  if(files.length == 0)
    callback(results);
  else {
    var file = files.pop();
    file.index.lookup(word, function(record) {
      wordnet.pushResults(file.data, results, getOffsetList(record), function() {
        wordnet.lookupFromFiles(files, results, word, callback);
      });
    });
  }  
}

function lookup(word, callback) {
  this.lookupFromFiles([
    {index: this.nounIndex, data: this.nounData},
    {index: this.verbIndex, data: this.verbData},
    {index: this.adjIndex, data: this.adjData},
    {index: this.advIndex, data: this.advData},
  ], [], word, callback);
}

function Wordnet(dataDir, base, name) {
  this.nounIndex = new IndexFile(dataDir, base, 'noun');
  this.verbIndex = new IndexFile(dataDir, base, 'verb');
  this.adjIndex = new IndexFile(dataDir, base, 'adj');
  this.advIndex = new IndexFile(dataDir, base, 'adv');

  this.nounData = new DataFile(dataDir, base, 'noun');
  this.verbData = new DataFile(dataDir, base, 'verb');
  this.adjData = new DataFile(dataDir, base, 'adj');
  this.advData = new DataFile(dataDir, base, 'adv');

  this.lookup = lookup;
  this.lookupFromFiles = lookupFromFiles;
  this.pushResults = pushResults;
}

module.exports = Wordnet;
