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
        
describe('tfidf io', function() { 
    it('should be able to be serialized', function() {
        tfidf = new TfIdf();
        tfidf.addDocument('document one', 'un');
        tfidf.addDocument('document Two', 'deux');
        var s = JSON.stringify(tfidf);
        expect(s).toBe('{"documents":[{"__key":"un","document":1,"one":1},{"__key":"deux","document":1,"two":1}]}'); 
    });
    
    it('should deserialize', function() {
        var s = '{"documents":[{"__key":"un","document":1,"one":1},{"__key":"deux","document":1,"two":1}]}';
        var tfidf = new TfIdf(JSON.parse(s));
        expect(tfidf.tfidf('one', 0)).toBe(0.9162907318741551);
        expect(tfidf.tfidf('two', 0)).toBe(0);
    });
    
    describe('files', function() {
        var tfidf = new TfIdf();
        tfidf.addFileSync('io_spec/test_data/tfidf/one');
        tfidf.addFileSync('io_spec/test_data/tfidf/two');
        expect(tfidf.tfidf('Document', 0)).toBe(0.8472978603872037);
        expect(tfidf.tfidf('one', 0)).toBe(0.9162907318741551);
        expect(tfidf.tfidf('two', 0)).toBe(0);
    });
});