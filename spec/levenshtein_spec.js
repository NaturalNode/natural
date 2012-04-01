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

var levenshteinDistance = require('lib/natural/distance/levenshtein_distance')

describe('levenshtein_distance', function() {
	it('should replace 2', function() {
		expect(levenshteinDistance('doctor', 'doktor')).toBe(2);
	});	

	it('should allow altering replacement value', function() {
		expect(levenshteinDistance('doctor', 'doktor', {substitution_cost: 1})).toBe(1);
	});	

	it('should delete 1', function() {
		expect(levenshteinDistance('doctor', 'docto')).toBe(1);
	});

	it('should insert 1', function() {
		expect(levenshteinDistance('flat', 'flats')).toBe(1);
	});

	it('should combine operations', function() {
		expect(levenshteinDistance('flad', 'flaten')).toBe(4);
		expect(levenshteinDistance('flaten', 'flad')).toBe(4);
	});

	it('should consider perfect matches 0', function() {
		expect(levenshteinDistance('one', 'one')).toBe(0);
	});

    it('different deletion cost should work', function() {
		expect(levenshteinDistance('ones', 'one', {deletion_cost: 3})).toBe(3);
	});

    it('different insertion cost should work', function() {
		expect(levenshteinDistance('one', 'ones', {deletion_cost: 3, insertion_cost: 5})).toBe(5);
	});

    it('delete all characters with -ve cost', function() {
		expect(levenshteinDistance('delete', '', {deletion_cost: -1})).toBe(-6);
	});

    it('insert all characters', function() {
		expect(levenshteinDistance('', 'insert')).toBe(6);
	});
});
