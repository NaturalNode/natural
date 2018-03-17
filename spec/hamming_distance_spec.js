/*
	Copyright (c) 2018, Hugo ter Doest

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

var hammingDistance = require('../lib/natural/distance/hamming_distance');

var stringsToCompare = [
  ["karolin", "kathrin", false, 3],
  ["karolin", "kerstin", false, 3],
  ["1011101", "1001001", false, 2],
  ["2173896", "2233796", false, 3],
  ["different", "length", false, -1],
  [5, function noString() {}, false, -1],
  ["ignorecase", "IgnoreCase", true, 0]
];

describe("The Hamming distance function compares strings of equal length", function() {
  stringsToCompare.forEach(function(values) {
    it("should calculate the difference between two strings correctly", function() {
      expect(hammingDistance(values[0], values[1], values[2])).toEqual(values[3]);
    });
  });
});
