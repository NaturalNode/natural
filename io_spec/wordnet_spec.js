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

var WordNet = require('lib/natural/wordnet/wordnet');
jasmine.asyncSpecWait.timeout = 30 * 1000;

describe('wordnet', function() {

  it('should lookup synonyms', function() {
    var wordnet = new WordNet();

    wordnet.lookupSynonyms('entity', function(records) {
      expect(records.length).toBe(3);
      asyncSpecDone();
    });

    asyncSpecWait();
  });

  it('should lookup synonyms give a synset offset and a pos', function() {
    var wordnet = new WordNet();

    wordnet.getSynonyms(1740, 'n', function(records) {
      expect(records.length).toBe(3);
      expect(records[0].synsetOffset).toBe(4424418);
      expect(records[1].synsetOffset).toBe(2137);
      expect(records[2].synsetOffset).toBe(1930);
      asyncSpecDone();
    });

    asyncSpecWait();
  });

  it('should lookup synonyms via a provided synset object', function() {
    var wordnet = new WordNet();

    wordnet.lookup('entity', function(results) {
      wordnet.getSynonyms(results[0], function(records) {
        expect(records.length).toBe(3);
        expect(records[0].synsetOffset).toBe(4424418);
        expect(records[1].synsetOffset).toBe(2137);
        expect(records[2].synsetOffset).toBe(1930);
        asyncSpecDone();
      });
    });

    asyncSpecWait();
  });

  it('should add records but once', function() {
    var wordnet = new WordNet();

    wordnet.lookup('node', function(records) {
      expect(records.length).toBe(8);
      expect(records[0].lemma).toBe('node');

      asyncSpecDone();
    });

    asyncSpecWait();
  });
});
