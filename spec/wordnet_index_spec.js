/*
Copyright (c) 2014, John Markos O'Neill

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

var IndexFile = require('../lib/natural/wordnet/index_file');
var fs = require('fs');

describe('indexFile', function() {
    describe('getFileSize', function() {

        it('should look up a word if the file exists', function() {
            indexFile = new IndexFile('spec/test_data/', 'document1.txt');
            indexFile.lookupFromFile('node', function(indexRecord) {
                should.not.exist(indexRecord);
            });
        });

        it('should fail to lookup a word if the file does not exist', function() {
            indexFile = new IndexFile('spec/test_data/', 'nonexistent.txt');
            indexFile.lookupFromFile('node', function(err) {
                err.code.should.equal('ENOENT');
            });
        });
    });
});
