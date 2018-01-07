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

var damerauLevenshtein = require('../lib/natural/distance/damerau_levenshtein_distance')

describe('DamerauLevenshtein', function () {
  describe('options.search = true', function () {
    it('should find cheapest substring', function () {
      expect(damerauLevenshtein('kitten', 'sitting', { search: true }))
        .toEqual({ substring: 'sittin', distance: 2 });
    });

    it('should find 0 cost substring in target', function () {
      expect(damerauLevenshtein('doctor', 'the doctor is in', { search: true }))
        .toEqual({ substring: 'doctor', distance: 0 });
    });

    it('should find 1 cost substring in target', function () {
      expect(damerauLevenshtein('doctor', 'the doktor is in', { search: true }))
        .toEqual({ substring: 'doktor', distance: 1 });
    });

    it('should return empty substring when that is cleapest match', function () {
      expect(damerauLevenshtein('doctor', '000000000000', { search: true }))
        .toEqual({ substring: '', distance: 6 });
    });

    it('different insertion costs should work', function () {
      // delete 10 0's at cost 1 and insert the letters for doctor at cost -1
      expect(damerauLevenshtein('0000000000', 'doctor', { search: true, insertion_cost: -1 }))
        .toEqual({ substring: 'doctor', distance: 4 });
    });

    it('different deletion costs should work', function () {
      // delete 10 0's at cost -10
      expect(damerauLevenshtein('0000000000', 'doctor', { search: true, deletion_cost: -1 }))
        .toEqual({ substring: '', distance: -10 });
    });
  });

  describe('default / options.search = false', function () {
    it('should replace 2', function () {
      expect(damerauLevenshtein('doctor', 'doktor')).toBe(1);
    });

    it('should allow altering replacement value', function () {
      expect(damerauLevenshtein('doctor', 'doktor', { substitution_cost: 1 })).toBe(1);
    });

    it('should delete 1', function () {
      expect(damerauLevenshtein('doctor', 'docto')).toBe(1);
    });

    it('should insert 1', function () {
      expect(damerauLevenshtein('flat', 'flats')).toBe(1);
    });

    it('should combine operations', function () {
      expect(damerauLevenshtein('flad', 'flaten')).toBe(3);
      expect(damerauLevenshtein('flaten', 'flad')).toBe(3);
    });

    it('should consider perfect matches 0', function () {
      expect(damerauLevenshtein('one', 'one')).toBe(0);
    });

    it('different deletion cost should work', function () {
      expect(damerauLevenshtein('ones', 'one', { deletion_cost: 3 })).toBe(3);
    });

    it('different insertion cost should work', function () {
      expect(damerauLevenshtein('one', 'ones', { deletion_cost: 3, insertion_cost: 5 })).toBe(5);
    });

    it('delete all characters with -ve cost', function () {
      expect(damerauLevenshtein('delete', '', { deletion_cost: -1 })).toBe(-6);
    });

    it('insert all characters', function () {
      expect(damerauLevenshtein('', 'insert')).toBe(6);
    });

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
