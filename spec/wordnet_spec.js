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

var fileSearcher = require('lib/natural/wordnet/file_searcher'),
  IndexFile = require('lib/natural/wordnet/index_file'),
  DataFile = require('lib/natural/wordnet/data_file'),
  Wordnet = require('lib/natural/wordnet/wordnet');

describe('wordnet', function() {
  describe('file_searcher', function() {
    it('should find a line at the start of a file', function() {
      fileSearcher.find('./spec/test_data/search_file', 'A', function(value) {
        expect(value.key).toBe('A');
        expect(value.line).toBe('A 1');
        asyncSpecDone();
      });
      
      asyncSpecWait();
    });
    
    it('should find a line near the beginning in a file', function() {
      fileSearcher.find('./spec/test_data/search_file', 'B', function(value) {
        expect(value.key).toBe('B');
        expect(value.line).toBe('B 2');
        asyncSpecDone();
      });
      
      asyncSpecWait();
    });
    
    it('should find a line somewhere in a file 1', function() {
      fileSearcher.find('./spec/test_data/search_file', 'D', function(value) {
        expect(value.key).toBe('D');
        expect(value.line).toBe('D 4');
        asyncSpecDone();
      });
      
      asyncSpecWait();
    });
    
    it('should find a line near the end of a file', function() {
      fileSearcher.find('./spec/test_data/search_file', 'K', function(value) {
        expect(value.key).toBe('K');
        expect(value.line).toBe('K 11');
        asyncSpecDone();
      });
      
      asyncSpecWait();
    });
    
    it('should find a line near the end of a file', function() {
      fileSearcher.find('./spec/test_data/search_file', 'I', function(value) {
        expect(value.key).toBe('I');
        expect(value.line).toBe('I 9');
        asyncSpecDone();
      });
      
      asyncSpecWait();
    });
    
    it('should find a line at the end of a file', function() {
      fileSearcher.find('./spec/test_data/search_file', 'M', function(value) {
        expect(value.key).toBe('M');
        expect(value.line).toBe('M 13');
        asyncSpecDone();
      });
      
      asyncSpecWait();
    });
    
    it('should handle a miss in the middle', function() {
      fileSearcher.find('./spec/test_data/search_file', 'B_NON_EXISTANT', function(value) {
        expect(value).toEqual({status: 'miss'});
        asyncSpecDone();
      });
      
      asyncSpecWait();
    });
    
    it('should handle a miss at the start', function() {
      fileSearcher.find('./spec/test_data/search_file', '0_NON_EXISTANT', function(value) {
        expect(value).toEqual({status: 'miss'});
        asyncSpecDone();
      });
      
      asyncSpecWait();
    });
    
    it('should handle a miss at the end', function() {
      fileSearcher.find('./spec/test_data/search_file', 'Z_NON_EXISTANT', function(value) {
        expect(value).toEqual({status: 'miss'});
        asyncSpecDone();
      });
      
      asyncSpecWait();
    });
  });
  
  describe('index_file', function() {
    it('should build a valid url', function() {
      var indexFile = new IndexFile('./spec/test_data/wordnet', 'http://wordnet.naturalnode.com/', 'noun');
      expect(indexFile.url).toBe('http://wordnet.naturalnode.com/index.noun');
    });
    
    it('should miss a record', function() {
      var indexFile = new IndexFile('./spec/test_data/wordnet/', 'http://wordnet.naturalnode.com/', 'noun');
      
      indexFile.lookup('aac', function(result) {
        expect(result).toBeNull();
        asyncSpecDone();
      });
      
      asyncSpecWait();
    });    
    
    it('should find a record', function() {
      var indexFile = new IndexFile('./spec/test_data/wordnet/', 'http://wordnet.naturalnode.com/', 'noun');
  
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
        expect(data.word).toBe('entity');
        expect(data.ptrs.length).toBe(3);
        asyncSpecDone();
      });
      
      asyncSpecWait();
    });
  });
  
  it('should look up a word', function() {
    var wordnet = new Wordnet('./spec/test_data/wordnet/', 'http://wordnet.naturalnode.com/');
    
    wordnet.lookup('entity', function(records) {
      expect(records.length).toBe(1);
      expect(records[0].word).toBe('entity');      
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });
});
