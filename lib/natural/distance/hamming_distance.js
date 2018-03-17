/*
	Copyright (c) 2018, Shane Caldwell, Hugo ter Doest

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

// Computes the Hamming distance between two string -- intrepreted from:
// https://en.wikipedia.org/wiki/Hamming_distance
// s1 is the first string to compare
// s2 is the second string to compare
// Strings should have equal length
function HammingDistance(s1, s2, ignoreCase) {
	// Return -1 if one of the parameters is not a string
	if (typeof(s1) != "string" || typeof(s2) != "string") {
		return -1;
	}
	// Return -1 the lengths of the strings differ
	if (s1.length != s2.length) {
		return -1;
	}

	if (ignoreCase) {
		s1 = s1.toLowerCase();
		s2 = s2.toLowerCase();
	}

  var diffs = 0;
  for (var i = 0; i < s1.length; i++) {
  	if (s1[i] != s2[i]) {
  		diffs++;
		}
  }
  return diffs;
}

module.exports = HammingDistance;
