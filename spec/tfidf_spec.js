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

var Tfidf = require('lib/natural/tfidf/tfidf').TfIdf;

var DEFAULT_IDF_UNITTEST = 1.5;
var TEST_CORPUS = 'spec/test_data/tfdif_testcorpus.txt';

describe('tfidf', function() {
    describe('non existant words', function() {
        it('should return return the default value', function() {
            var tfiObj = new Tfidf(TEST_CORPUS, null, DEFAULT_IDF_UNITTEST, function(myTfidf) {
                expect(myTfidf.get_idf("THE")).toBe(DEFAULT_IDF_UNITTEST);
                expect(myTfidf.get_idf("nonexistant")).toBe(DEFAULT_IDF_UNITTEST);                
            });
        });
    });
});