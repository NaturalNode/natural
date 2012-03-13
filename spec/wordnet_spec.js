/*
Copyright (c) 2011, Chris Umbel and Russell Mull

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
var sqlite3 = require('sqlite3');
var _ = require('underscore');
var fs = require('fs');

describe('wordnet', function() {
  var testDataFile = __dirname + '/test_data/wordnet_mini.sql';
  var testData = fs.readFileSync(testDataFile, 'utf8');

  var db = new sqlite3.Database(':memory:');
  db.exec(testData);

  var wordnet = new WordNet(db);

  it('should get a single word', function() {
    wordnet.getWord('unique', function(word) {
      expect(word.id).toBe(138336);
      expect(word.lemma).toBe('unique');

      asyncSpecDone();
    });

    asyncSpecWait();
  });

  it('should find multiple words', function() {
    wordnet.findWords('unique%', function(words) {
      expect(words.length).toBe(3);
      expect(_.pluck(words, 'lemma')).toEqual(['unique', 'uniquely', 'uniqueness']);
    });
  });

  it('should find a word by id', function() {
    wordnet.getWordById(138336, function(word) {
      expect(word.id).toBe(138336);
      expect(word.lemma).toBe('unique');

      asyncSpecDone();
    });

    asyncSpecWait();
  });

  it('should handle a miss for single word retrieval', function() {
    wordnet.getWord('argombiszki', function(word) {
      expect(word).toBeNull();
      asyncSpecDone();
    });

    asyncSpecWait();
  });

  it('should handle a miss for multiple word retrieval', function() {
    wordnet.findWords('argombiszki%', function(words) {
      expect(words.length).toBe(0);
      asyncSpecDone();
    });

    asyncSpecWait();
  });

  describe('word', function() {
    var word = null;
    wordnet.getWord('good', function(w) { word = w; });

    waitsFor(function() { return word != null; }, 1000);

    it('should have senses', function() {
      expect(word.senses.length).toBe(27);
      expect(word.senses[0].pos).toBe('n');
      expect(word.senses[0].definition).toBe('articles of commerce');
    });

    it('should be able to tell you its synonyms for its senses', function() {
      word.senses[0].getSynonyms(function(synonyms) {
        expect(_.pluck(synonyms, 'lemma')).toEqual(['commodity', 'good', 'trade good']);
        asyncSpecDone();
      });
      asyncSpecWait();
    });
  });
});
