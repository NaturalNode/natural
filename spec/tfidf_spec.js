/*
Copyright (c) 2011, Rob Ellis, Chris Umbel

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
var TEST_STOPWORDS = 'spec/test_data/tfdif_testcorpus.txt';

var getExectedIdf = function(num_docs_total, num_docs_term){
   return Math.log(parseFloat(1 + num_docs_total) / (1 + num_docs_term))
}

describe('tfidf', function() {
    describe('get idf', function() {
        it('should return return the default value for non eixstant words', function() {
            var tfiObj = new Tfidf(TEST_CORPUS, null, DEFAULT_IDF_UNITTEST, function(myTfidf) {
                expect(myTfidf.getIdf("THE")).toBe(DEFAULT_IDF_UNITTEST);
                expect(myTfidf.getIdf("nonexistant")).toBe(DEFAULT_IDF_UNITTEST);                
            });
        });
        
        it('should handle greaters', function() {
            var tfiObj = new Tfidf(TEST_CORPUS, null, DEFAULT_IDF_UNITTEST, function(myTfidf) {
                expect(myTfidf.getIdf("a")).toBeGreaterThan(myTfidf.getIdf("the"));
            });
        });
        
        it('should handle almost equal', function() {
            var tfiObj = new Tfidf(TEST_CORPUS, null, DEFAULT_IDF_UNITTEST, function(myTfidf) {
                expect(myTfidf.getIdf("girl")).toBe(myTfidf.getIdf("moon"));
            });
        });            
    });
    
    describe('keywords', function() {
        it('should retrieve keywords when there is only one keyword', function() {
            var tfiObj = new Tfidf(TEST_CORPUS, TEST_STOPWORDS, DEFAULT_IDF_UNITTEST, function(myTfidf) {
                expect(myTfidf.getDocKeywords("the spoon and the fork")[0][0]).toBe("the");
            });
        });
        
        it('should retrieve multiple keywords', function() {
            var tfiObj = new Tfidf(TEST_CORPUS, TEST_STOPWORDS, DEFAULT_IDF_UNITTEST, function(myTfidf) {
                var keywords = myTfidf.getDocKeywords("the girl said hello over the phone");
                expect(keywords[0][0]).toBe("girl");
                expect(keywords[1][0]).toBe("phone");
                expect(keywords[2][0]).toBe("said");
                expect(keywords[3][0]).toBe("the");                
            });
        });        
    });
    
    describe('add corpus', function() {
        var tfiObj = new Tfidf(TEST_CORPUS, null, DEFAULT_IDF_UNITTEST, function(myTfidf) {
            expect(getExectedIdf(myTfidf.getNumDocs(), 1)).toBeTruthy();
            expect(myTfidf.getIdf("water")).toBe(DEFAULT_IDF_UNITTEST);
            expect(getExectedIdf(myTfidf.getNumDocs(), 1)).toBe(myTfidf.getIdf("moon"));
            expect(getExectedIdf(myTfidf.getNumDocs(), 5)).toBe(myTfidf.getIdf("said"));
            
            myTfidf.addInputDocument("water, moon");
            
            expect(getExectedIdf(myTfidf.getNumDocs(), 1)).toBe(myTfidf.getIdf("water"));
            expect(getExectedIdf(myTfidf.getNumDocs(), 2)).toBe(myTfidf.getIdf("moon"));            
            expect(getExectedIdf(myTfidf.getNumDocs(), 5)).toBe(myTfidf.getIdf("said"));            
        });
    });
});