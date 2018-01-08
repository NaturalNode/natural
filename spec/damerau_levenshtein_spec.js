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

var damerauLevenshtein = require('../lib/natural/distance/levenshtein_distance')
  .DamerauLevenshteinDistance;

describe('DamerauLevenshtein', function () {
  describe('default', function () {
    it('should be 0 when given equal strings', function () {
      expect(damerauLevenshtein('test', 'test')).toBe(0);
    })

    it('should calculate 1 for adjacent transposition', function () {
      expect(damerauLevenshtein('za', 'az')).toBe(1);
      expect(damerauLevenshtein('Tomato', 'oTmato')).toBe(1);
    });

    it('should handle custom transposition_cost', function () {
      expect(damerauLevenshtein('za', 'az', { transposition_cost: 0 })).toBe(0);
    });

    it('should calculate 2 when there are 2 transpositions', function () {
      expect(damerauLevenshtein('tomato', 'otmaot')).toBe(2);
    });

    it('should calculate 2 for 1 transposition and 1 insertion', function () {
      expect(damerauLevenshtein('CA', 'ABC')).toBe(2);
      expect(damerauLevenshtein('a cat', 'a abct')).toBe(2);
    });
  });

  describe('options.restricted = true', function () {
    var restricted = { restricted: true };
    it('should calculate 0 for equal strings', function () {
        expect(damerauLevenshtein('identity', 'identity', restricted)).toBe(0);
    });
    it('should calculate 1 for an adjacent transposition', function () {
        expect(damerauLevenshtein('za', 'az', restricted)).toBe(1);
    });
    it('should not count transposition more than 1 char away', function () {
        expect(damerauLevenshtein('CA', 'ABC', restricted)).toBe(3);
    });
  });
});
