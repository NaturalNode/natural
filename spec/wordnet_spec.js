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

var fileSearcher = require('lib/natural/wordnet/file_searcher');

describe('wordnet', function() {
  it('should find a line at the start of a file', function() {
    fileSearcher.findLine('./spec/test_data/search_file', 'A', function(line) {
      expect(line).toBe('A 1');
      asyncSpecDone();
    });

    asyncSpecWait();
  });

  it('should find a line near the beginning in a file', function() {
    fileSearcher.findLine('./spec/test_data/search_file', 'B', function(line) {
      expect(line).toBe('B 2');
      asyncSpecDone();
    });

    asyncSpecWait();
  });

  it('should find a line somewhere in a file 1', function() {
    fileSearcher.findLine('./spec/test_data/search_file', 'D', function(line) {
      expect(line).toBe('D 4');
      asyncSpecDone();
    });

    asyncSpecWait();
  });

  it('should find a line near the end of a file 2', function() {
    fileSearcher.findLine('./spec/test_data/search_file', 'I', function(line) {
      expect(line).toBe('I 9');
      asyncSpecDone();
    });

    asyncSpecWait();
  });

  it('should find a line near the end of a file', function() {
    fileSearcher.findLine('./spec/test_data/search_file', 'K', function(line) {
      expect(line).toBe('K 11');
      asyncSpecDone();
    });

    asyncSpecWait();
  });

  it('should find a line near the end of a file', function() {
    fileSearcher.findLine('./spec/test_data/search_file', 'I', function(line) {
      console.log('found '+ line);
      expect(line).toBe('I 9');
      asyncSpecDone();
    });

    asyncSpecWait();
  });

  it('should find a line at the end of a file', function() {
    fileSearcher.findLine('./spec/test_data/search_file', 'M', function(line) {
      expect(line).toBe('M 13');
      asyncSpecDone();
    });

    asyncSpecWait();
  });
});
