/*
Copyright (c) 2012, Guillaume Marty

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

var CountInflector = (require('../lib/natural/inflectors/fr/count_inflector'));

describe('count_inflector', function() {
  it('should handle 1er cases', function() {
    expect(CountInflector.nth(1)).toBe('1er');
  });

  it('should handle the 2e cases', function() {
    expect(CountInflector.nth(0)).toBe('0e');
    expect(CountInflector.nth(2)).toBe('2e');
    expect(CountInflector.nth(3)).toBe('3e');
    expect(CountInflector.nth(5)).toBe('5e');
    expect(CountInflector.nth(11)).toBe('11e');
    expect(CountInflector.nth(100)).toBe('100e');
    expect(CountInflector.nth(999)).toBe('999e');
  });

  it('should handle roman numerals', function() {
    expect(CountInflector.nth('I')).toBe('Ier');
    expect(CountInflector.nth('XX')).toBe('XXe');
  });
});
