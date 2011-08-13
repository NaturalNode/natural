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

var fileSearcher = require('./file_searcher'),
  WordnetFile = require('lib/natural/wordnet/wordnet_file');

function getSubArray(input, offset, count, preProcess) {
  var subArray = [];

  for(var i = 0; i < count; i++) {
    if(preProcess)
      subArray.push(preProcess(input[offset + i]));
    else
      subArray.push(input[offset + i]);
  }
  
  return subArray;
}

function lookupFromFile(word, callback) {
  fileSearcher.find(this.filePath, word, function(record) {
    var indexRecord = null;

    if(record.status == 'hit') {
      var ptrs = getSubArray(record.tokens, 4, parseInt(record.tokens[3]));
      
      indexRecord = {
        'lemma': record.tokens[0],
        'pos': record.tokens[1],
        'ptr_symbol': ptrs,
        'sense_cnt':  parseInt(record.tokens[ptrs.length + 4]),
        'tagsense_cnt':  parseInt(record.tokens[ptrs.length + 5]),
        'synset_offset':  getSubArray(record.tokens, ptrs.length + 6, 
          parseInt(record.tokens[2]), parseInt)
      };
    }
    
    callback(indexRecord);
  });
}

function lookup(word, callback) {
  this.lookupFromFile(word, callback);
}

var IndexFile = function(dataDir, base, name) {
  var indexFile = new WordnetFile(dataDir, base, 'index.' + name);
  indexFile.lookupFromFile = lookupFromFile;
  indexFile.lookup = lookup;  
  return indexFile;
};

module.exports = IndexFile;
