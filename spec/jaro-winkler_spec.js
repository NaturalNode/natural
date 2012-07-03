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

var jaroWinklerDistance = require('lib/natural/distance/jaro-winkler_distance')

Number.prototype.approxEql = function(val) {
    return Math.abs(this - val) < 1e-5;
}

describe('jaro-winkler', function () {
    it('should evaluate string similarity', function () {
        expect(jaroWinklerDistance('DIXON', 'DICKSONX').approxEql(0.81333)).toBeTruthy();
        expect(jaroWinklerDistance('DWAYNE', 'DUANE').approxEql(0.84)).toBeTruthy();
    });

    it('should handle exact matches', function () {
        expect(jaroWinklerDistance('RICK', 'RICK')).toBe(1);
        expect(jaroWinklerDistance('abc', 'abc')).toBe(1);
        expect(jaroWinklerDistance('abcd', 'abcd')).toBe(1);
        expect(jaroWinklerDistance('seddon', 'seddon')).toBe(1);
    });

    it('should handle total mis-matches', function () {
        expect(jaroWinklerDistance('NOT', 'SAME')).toBe(0);
    });

    it('should handle partial mis-matches', function () {
        expect(jaroWinklerDistance('aaa', 'abcd').approxEql(0.575)).toBeTruthy();
    });

    it('should handle transpositions', function () {
        expect(jaroWinklerDistance('MARTHA', 'MARHTA').approxEql(0.96111)).toBeTruthy();
    });
});
