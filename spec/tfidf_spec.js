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

        it('should list important terms', function() {
            var terms = tfidf.listTerms(0);
            expect(terms[0].tfidf).toBeGreaterThan(terms[1].tfidf);
        });
    });

    describe("special cases", function(){

        // In response to
        it("should handle reserved function names correctly in documents", function(){
            var reservedWords = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ];
            tfidf = new TfIdf();
            tfidf.addDocument(reservedWords.join(" "));

            for(var i in reservedWords) {
                expect(tfidf.tfidf(reservedWords[i], 0)).toBe(0);
            }
        });
    });

    describe("correct calculations", function(){

        it("should compute idf correctly", function(){

            tfidf = new TfIdf();
            tfidf.addDocument('this document is about node.');
            tfidf.addDocument('this document is about ruby.');
            tfidf.addDocument('this document is about ruby and node.');
            tfidf.addDocument('this document is about node. it has node examples');

            expect(tfidf.idf("node")).toBe(Math.log( 4.0 / 3.0 ));
        });

        it("should compute tf correctly", function(){
            expect(TfIdf.tf("node", {this:1, document:1, is:1, about:1, node:1})).toBe(1);
            expect(TfIdf.tf("node", {this:1, document:1, is:1, about:1, ruby:1})).toBe(0);
            expect(TfIdf.tf("node", {this:1, document:1, is:1, about:1, ruby:1, and:1, node:1})).toBe(1);
            expect(TfIdf.tf("node", {this:1, document:1, is:1, about:1, node:2, it:1, has:1, examples:1})).toBe(2);
        });

        // This is a test of the use case outlined in the readme.
        it("should compute tf-idf correctly", function(){

            var correctCalculations = [
                1 * Math.log( 4.0 / 3.0 ),
                0,
                2 * Math.log( 4.0 / 3.0 ),
                1 * Math.log( 4.0 / 2.0 )
            ];

            tfidf = new TfIdf();
            tfidf.addDocument('this document is about node.', {node: 0, ruby:1});
            tfidf.addDocument('this document is about ruby.', {node:1, ruby:3});
            tfidf.addDocument('this document is about ruby and node.', {node:0, ruby:3});
            tfidf.addDocument('this document is about node. it has node examples', {node:2, ruby:1});

            tfidf.tfidfs('node', function(i, measure, k) {
                expect(measure).toBe(correctCalculations[k.node]);
            });

            tfidf.tfidfs('ruby', function(i, measure, k) {
                expect(measure).toBe(correctCalculations[k.ruby]);
            });

        });

        it("should not return NaN if a term is not present in any documents", function() {
            tfidf = new TfIdf();
            tfidf.addDocument('this document is about node.');

            expect(tfidf.tfidf('ruby', 0)).toBe(0);
        });

        // This test assures that tf-idf is computed correctly before and after a document is added
        // Computes and tests a few tf-idfs, then adds a document and ensures that those terms tf-idf value
        // is updated accordingly.
        it("should update a terms tf-idf score after adding documents", function(){

            tfidf = new TfIdf();

            // Add 2 documents
            tfidf.addDocument('this document is about node.', 0);
            tfidf.addDocument('this document is about ruby.', 1);

            // check the tf-idf for 'node'
            expect( tfidf.tfidf("node", 0) ).toBe( 1 * Math.log( 2.0 / 1.0 ) );

            // Add 2 more documents
            tfidf.addDocument('this document is about ruby and node.');
            tfidf.addDocument('this document is about node. it has node examples');

            // Ensure that the tf-idf in the same document has changed to reflect the new idf.
            expect( tfidf.tfidf("node", 0) ).toBe( 1 * Math.log( 4.0 / 3.0 ) );
        });

        // Test tf-idf computation on files loaded using readFileSync
        it("should load documents from files", function(){

            tfidf = new TfIdf();

            tfidf.addFileSync("spec/test_data/tfidf_document1.txt", null, {node: 0, ruby:1});
            tfidf.addFileSync("spec/test_data/tfidf_document2.txt", null, {node:1, ruby:3});
            tfidf.addFileSync("spec/test_data/tfidf_document3.txt", null, {node:0, ruby:3});
            tfidf.addFileSync("spec/test_data/tfidf_document4.txt", null, {node:2, ruby:1});

            var correctCalculations = [
                1 * Math.log( 4.0 / 3.0 ),
                0,
                2 * Math.log( 4.0 / 3.0 ),
                1 * Math.log( 4.0 / 2.0 )
            ];

            tfidf.tfidfs('node', function(i, measure, k) {
                expect(measure).toBe(correctCalculations[k.node]);
            });

            tfidf.tfidfs('ruby', function(i, measure, k) {
                expect(measure).toBe(correctCalculations[k.ruby]);
            });
        });

        // Test idf caching when adding documents from addFileSync
        it("should update a terms tf-idf score after adding documents from addFileSync", function(){
            tfidf = new TfIdf();

            // Add 2 documents
            tfidf.addFileSync("spec/test_data/tfidf_document1.txt", null, 0);
            tfidf.addFileSync("spec/test_data/tfidf_document2.txt", null, 1);

            // check the tf-idf for 'node'
            expect( tfidf.tfidf("node", 0) ).toBe( 1 * Math.log( 2.0 / 1.0 ) );

            // Add 2 more documents
            tfidf.addFileSync("spec/test_data/tfidf_document3.txt");
            tfidf.addFileSync("spec/test_data/tfidf_document4.txt");

            // Ensure that the tf-idf in the same document has changed to reflect the new idf.
            expect( tfidf.tfidf("node", 0) ).toBe( 1 * Math.log( 4.0 / 3.0 ) );
        });

        // Test idf.setTokenizer
        it('should allow for specific types of Tokenizers', function(){
            tfidf = new TfIdf();

            tfidf.addDocument('this document isn\'t about node.', 0);
            tfidf.addDocument('that doc is about node.', 1);
            expect( tfidf.tfidf('n\'t', 0) ).toBe(0);
            expect( tfidf.tfidf('isn', 0) ).toBe( 1 * Math.log( 2 / 1 ) );

            tfidf = new TfIdf();

            tfidf.addDocument('this document isn\'t about node.', 0);
            tfidf.addDocument('this document isn\'t about node.', 1);
            expect( tfidf.tfidf('isn', 0) ).toBe(0);

            tfidf = new TfIdf();
            var TreebankWordTokenizer = require('../lib/natural/tokenizers/treebank_word_tokenizer');
            var tokenizer = new TreebankWordTokenizer();

            tfidf.addDocument('this document isn\'t about node.', 0);
            tfidf.setTokenizer(tokenizer);
            tfidf.addDocument('this doc isn\'t about node.', 1);

            expect( tfidf.tfidf('isn', 0) ).toBe( 1 * Math.log( 2 / 1 ) );
            expect( tfidf.tfidf('n\'t', 1) ).toBe( 1 * Math.log( 2 / 1 ) );
            expect( tfidf.tfidf('isn', 1) ).toBe(0);
        });

        it('should require a valid tokenizer when using setTokenizer', function(){
            tfidf = new TfIdf();

            expect( function() { tfidf.setTokenizer(1); } ).toThrow(new Error('Expected a valid Tokenizer'));
            expect( function() { tfidf.setTokenizer({}); } ).toThrow(new Error('Expected a valid Tokenizer'));
        });

        // Test encoding for addFileSync
        it('should use the specified encoding for addFileSync', function(){

            tfidf = new TfIdf();

            tfidf.addFileSync('spec/test_data/tfidf_document1.txt', 'base64');
            tfidf.addFileSync('spec/test_data/tfidf_document1.txt', 'utf8');

            expect( tfidf.tfidf('dghpcybkb2n1bwvudcbpcybhym91dcbub2rllg', 0) ).toBe( 1 * Math.log( 2.0 / 1.0 ) );
        });

        // Test encoding check for addFileSync
        it('should require a valid encoding for addFileSync', function(){

            tfidf = new TfIdf();

            expect( function() { tfidf.addFileSync('spec/test_data/tfidf_document1.txt', 'foobar'); } ).toThrow(new Error('Invalid encoding: foobar'));
        });
    });
});
