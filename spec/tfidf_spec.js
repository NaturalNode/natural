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
var TEST_CORPUS_STRING = '50\nthe:23\na:17\ngirl:1\nmoon:1\nsaid:5\nphone:2';
var getExectedIdf = function(num_docs_total, num_docs_term){
   return Math.log(parseFloat(1 + num_docs_total) / (1 + num_docs_term))
}

describe('tfidf', function() {
    describe('get idf', function() {
        it('should return return the default value for non eixstant words', function() {
            var tfObj = new Tfidf(DEFAULT_IDF_UNITTEST);
            
            tfObj.measureFile(TEST_CORPUS, null, function() {
                expect(tfObj.getIdf("THE")).toBe(DEFAULT_IDF_UNITTEST);
                expect(tfObj.getIdf("nonexistant")).toBe(DEFAULT_IDF_UNITTEST);                
            });
        });

        it('should return return the default value for non eixstant words by string', function() {
            var tfObj = new Tfidf(DEFAULT_IDF_UNITTEST);
            
            tfObj.measure(TEST_CORPUS_STRING, null, function() {
                expect(tfObj.getIdf("THE")).toBe(DEFAULT_IDF_UNITTEST);
                expect(tfObj.getIdf("nonexistant")).toBe(DEFAULT_IDF_UNITTEST);                
            });
        });
        
        it('should handle greaters', function() {
            var tfObj = new Tfidf(DEFAULT_IDF_UNITTEST);
            
            tfObj.measureFile(TEST_CORPUS, null, function() {
                expect(tfObj.getIdf("a")).toBeGreaterThan(tfObj.getIdf("the"));
            });
        });

        it('should handle greaters by string', function() {
            var tfObj = new Tfidf(DEFAULT_IDF_UNITTEST);
            
            tfObj.measure(TEST_CORPUS_STRING, null, function() {
                expect(tfObj.getIdf("a")).toBeGreaterThan(tfObj.getIdf("the"));
            });
        });
        
        it('should handle almost equal', function() {
            var tfObj = new Tfidf(DEFAULT_IDF_UNITTEST);
            
            tfObj.measureFile(TEST_CORPUS, null, function() {
                expect(tfObj.getIdf("girl")).toBe(tfObj.getIdf("moon"));
            });
        });            
    });
    
    describe('keywords', function() {
        it('should retrieve keywords when there is only one keyword', function() {
            var tfObj = new Tfidf(DEFAULT_IDF_UNITTEST);
            
            tfObj.measureFile(TEST_CORPUS, TEST_STOPWORDS, function() {
                expect(tfObj.getDocKeywords("the spoon and the fork")[0][0]).toBe("the");
            });
        });
        
        it('should retrieve multiple keywords', function() {
            var tfObj = new Tfidf(DEFAULT_IDF_UNITTEST);
            
            tfObj.measureFile(TEST_CORPUS, TEST_STOPWORDS, function() {
                var keywords = tfObj.getDocKeywords("the girl said hello over the phone");
                expect(keywords[0][0]).toBe("girl");
                expect(keywords[1][0]).toBe("phone");
                expect(keywords[2][0]).toBe("said");
                expect(keywords[3][0]).toBe("the");                
            });
        });        
    });
    
    describe('add corpus', function() {
        var tfObj = new Tfidf(DEFAULT_IDF_UNITTEST);
            
        tfObj.measureFile(TEST_CORPUS, null, function() {
            expect(getExectedIdf(tfObj.getNumDocs(), 1)).toBeTruthy();
            expect(tfObj.getIdf("water")).toBe(DEFAULT_IDF_UNITTEST);
            expect(getExectedIdf(tfObj.getNumDocs(), 1)).toBe(tfObj.getIdf("moon"));
            expect(getExectedIdf(tfObj.getNumDocs(), 5)).toBe(tfObj.getIdf("said"));
            
            tfObj.addInputDocument("water, moon");
            
            expect(getExectedIdf(tfObj.getNumDocs(), 1)).toBe(tfObj.getIdf("water"));
            expect(getExectedIdf(tfObj.getNumDocs(), 2)).toBe(tfObj.getIdf("moon"));            
            expect(getExectedIdf(tfObj.getNumDocs(), 5)).toBe(tfObj.getIdf("said"));            
        });
    });
});