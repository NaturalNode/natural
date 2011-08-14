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

function lookupFromFile(word, callback) {
  fileSearcher.find(this.filePath, word, function(record) {
    var indexRecord = null;

    if(record.status == 'hit') {
      var ptrs = [], offsets = [];
      
      for(var i = 0; i < parseInt(record.tokens[3]); i++)
        ptrs.push(record.tokens[i]);
        
      for(var i = 0; i < parseInt(record.tokens[2]); i++)
        offsets.push(parseInt(record.tokens[ptrs.length + 6], 10));
  
      indexRecord = {
        'lemma': record.tokens[0],
        'pos': record.tokens[1],
        'ptrSymbol': ptrs,
        'senseCnt':  parseInt(record.tokens[ptrs.length + 4], 10),
        'tagsenseCnt':  parseInt(record.tokens[ptrs.length + 5], 10),
        'synsetOffset':  offsets
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
