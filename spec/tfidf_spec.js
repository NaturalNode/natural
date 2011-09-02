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

var TfIdf = require('lib/natural/tfidf/tfidf');
var tfidf;
        
describe('tfidf', function() {
    describe('stateless operations', function() {
        it('should tf', function() {
            expect(TfIdf.tf('document', 'document of a document')).toBe(2);
        });        
    });
    
    describe('stateful operations', function() {
        beforeEach(function() {
            tfidf = new TfIdf();
        	tfidf.addDocument('document one');
        	tfidf.addDocument('document two');
        });
        
    	it('should add documents', function() {
            expect(tfidf.documents.length).toBe(2);
            expect(tfidf.documents[0]).toEqual(['document', 'one']);
            expect(tfidf.documents[1]).toEqual(['document', 'two']);        
    	});
            
        it('should idf', function() {
            expect(tfidf.idf('document')).toBe(0.8472978603872037);
            expect(tfidf.idf('dumb')).toBe(1.0986122886681098);
        });   
        
        it('should tfidf a single doc', function() {
            expect(tfidf.tfidf('document', 0)).toBe(0.8472978603872037);
            expect(tfidf.tfidf('one', 0)).toBe(0.9162907318741551);
            expect(tfidf.tfidf('two', 0)).toBe(0);            
        });
        
        it('should tfidfs docs', function() {
            expect(tfidf.tfidfs('two')).toEqual([0, 0.9162907318741551]);
            expect(tfidf.tfidfs('document')).toEqual([0.8472978603872037, 0.8472978603872037]);
        });        
    });
});
