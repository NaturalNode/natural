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

var Wordnet = require('lib/natural/wordnet/wordnet');
jasmine.asyncSpecWait.timeout = 30 * 1000;

describe('wordnet', function() {
  it('should download files', function() {
    var wordnet = new Wordnet('./spec/test_data/wordnet/download/', 'http://wordnet.naturalnode.com/');
    
    wordnet.lookup('entity', function(records) {
      expect(records.length).toBe(1);
      expect(records[0].word).toBe('entity');
      
      require('path').exists('./spec/test_data/wordnet/download/index.noun', function(exists) {
        expect(exists).toBeTruthy();
        asyncSpecDone();
      });
    });
    
    asyncSpecWait();
  });
  
  it('should lookup synonyms', function() {
    var wordnet = new Wordnet('./spec/test_data/wordnet/download/', 'http://wordnet.naturalnode.com/');
    
    wordnet.lookupSynonyms('entity', function(records) {
      expect(records.length).toBe(3);
      
      require('path').exists('./spec/test_data/wordnet/download/index.noun', function(exists) {
        expect(exists).toBeTruthy();
        asyncSpecDone();
      });
    });
    
    asyncSpecWait();
  });

  it('should lookup synonyms give a synset offset and a pos', function() {
    var wordnet = new Wordnet('./spec/test_data/wordnet/download/', 'http://wordnet.naturalnode.com/');
    
    wordnet.getSynonyms(1740, 'n', function(records) {
      expect(records.length).toBe(3);      
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });
});  