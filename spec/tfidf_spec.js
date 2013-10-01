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

var TfIdf = require('../lib/natural/tfidf/tfidf');
var tfidf;
        
describe('tfidf', function() {
    describe('stateless operations', function() {
        it('should tf', function() {
            expect(TfIdf.tf('document', { document : 2, one : 1 })).toBe(2);
            expect(TfIdf.tf('document', { greetings : 1, program : 1 })).toBe(0);
            expect(TfIdf.tf('program', { greetings : 1, program : 1 })).toBe(1);
        });
    });

    describe('keys', function() {
        it('should store and recall keys', function() {
            tfidf = new TfIdf();
            tfidf.addDocument('document one', 'un');
        	tfidf.addDocument('document Two', 'deux');
            
            tfidf.tfidfs('two', function(i, tfidf, key) {
                if(i == 0)
                    expect(key).toBe('un');
                else
                    expect(key).toBe('deux');
            });
        });    
    });

    describe('stateful operations', function() {
        beforeEach(function() {
            tfidf = new TfIdf();
            tfidf.addDocument('document one');
            tfidf.addDocument('document Two');
        });

    	it('should add documents', function() {
            expect(tfidf.documents.length).toBe(2);
            expect(tfidf.documents[0]).toEqual({ document : 1, one : 1 });
            expect(tfidf.documents[1]).toEqual({ document : 1, two : 1 });        
    	});

	it('should list important terms', function() {
            var terms = tfidf.listTerms(0);
            expect(terms[0].tfidf).toBeGreaterThan(terms[1].tfidf);
	});
    });
});
