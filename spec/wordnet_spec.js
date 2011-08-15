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

var IndexFile = require('lib/natural/wordnet/index_file'),
  DataFile = require('lib/natural/wordnet/data_file'),
  WordNet = require('lib/natural/wordnet/wordnet');

describe('wordnet', function() {
  describe('index_file', function() {
    it('should build a valid url', function() {
      var indexFile = new IndexFile('./spec/test_data/wordnet', 'http://wordnet.naturalnode.com/', 'noun');      
      expect(indexFile.url.href).toBe('http://wordnet.naturalnode.com/index.noun.gz');
    });

    it('should miss a record', function() {
      var indexFile = new IndexFile('./spec/test_data/wordnet', 'http://wordnet.naturalnode.com/', 'noun');
      indexFile.lookup('aac', function(result) {
        expect(result).toBeNull();
        asyncSpecDone();
      });
      
      asyncSpecWait();
    });    
    
    it('should find a record', function() {
      var indexFile = new IndexFile('./spec/test_data/wordnet', 'http://wordnet.naturalnode.com/', 'noun');      
      indexFile.lookup('pass', function(result) {
        expect(result.lemma).toBe('pass');
        expect(result.pos).toBe('n');
        expect(result.ptrSymbol.length == 5);        
        expect(result.synsetOffset.length == 16);
        asyncSpecDone();
      });
      
      asyncSpecWait();
    });
  });
  
  describe('data_file', function() {
    it('should find a record', function() {
      var dataFile = new DataFile('./spec/test_data/wordnet/', 'http://wordnet.naturalnode.com/', 'noun');
      
      dataFile.get(1740, function(data) {
        expect(data.lemma).toBe('entity');
        expect(data.ptrs.length).toBe(3);
        asyncSpecDone();
      });
      
      asyncSpecWait();
    });
  });
  
  it('should look up a word', function() {
    var wordnet = new WordNet('./spec/test_data/wordnet/', 'http://wordnet.naturalnode.com/');
    
    wordnet.lookup('entity', function(records) {
      expect(records.length).toBe(1);
      expect(records[0].lemma).toBe('entity');      
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });  
  
  it('should handle a miss', function() {
    var wordnet = new WordNet('./spec/test_data/wordnet/', 'http://wordnet.naturalnode.com/');
    
    wordnet.lookup('argombiszki', function(records) {
      expect(records.length).toBe(0);
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });  
  
  
  it('should get a word', function() {
    var wordnet = new WordNet('./spec/test_data/wordnet/', 'http://wordnet.naturalnode.com/');
    
    wordnet.get(1740, 'n', function(record) {
      expect(record.lemma).toBe('entity');      
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });   
});
