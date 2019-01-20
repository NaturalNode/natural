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

var natural = require('../lib/natural');
var baseClassifier = require('../lib/natural/classifiers/classifier.js');
var fs = require('fs');

describe('classifier file IO', function () {

  describe('save', function () {

    var tmpFilename = '/spec/test_data/deleteMe';
    var nonExistentFilename = '/nonExistentDir/deleteMe';
    var classifier;

    beforeEach(function () {
      classifier = new natural.BayesClassifier();
      classifier.addDocument('I went to see the doctor of', 'philosophy');
    });

    afterEach(function () {
      if (fs.existsSync(tmpFilename)) {
        fs.unlinkSync(tmpFilename);
        fs.unlinkSync(nonExistentFilename);
      }
    });

    it('does nothing if called without a callback', function () {
      classifier.save(tmpFilename);
      expect(fs.existsSync(tmpFilename)).toBe(false);
    });

    it('fails if writing to a file fails', function () {
      classifier.save(nonExistentFilename, function (err) {
        expect(err).toBe.ok;
        expect(fs.existsSync(tmpFilename)).toBe(false);
      });
    });
  });

  describe('load', function () {

    it('does nothing if called without a callback', function () {
      result = baseClassifier.load('io_spec/test_data/tfidf/tfidf_document1.txt');
      expect(result).not.toBe.ok;
    });

    it('does nothing if called with a nonexistent filename', function () {
      result = baseClassifier.load('/nonexistentFilename', function (err, newClassifier){
        expect(err).toBe.ok;
        expect(newClassifier).not.toBe.ok;
      });
    });
  });
});
