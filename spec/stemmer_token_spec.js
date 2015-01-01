/*
Copyright (c) 2014, Luís Rodrigues

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

var StemmerToken = require('../lib/natural/stemmers/token');

describe('stemmer token', function () {

  it('should receive a string', function () {
    var string = 'test',
      token    = new StemmerToken(string);

    expect(token.string).toBe(string);
  });

  it('should compare strings', function () {
    var string        = 'test',
      token           = new StemmerToken(string),
      equalToken      = new StemmerToken(string),
      differentToken  = new StemmerToken('different');

    expect(token.isEqual(equalToken)).toBe(true);
    expect(token.isEqual(differentToken)).toBe(false);
  });

  it('should allow vowels to be set', function () {
    var vowels = 'aeiou',
      token    = (new StemmerToken('')).usingVowels(vowels);

    expect(token.vowels).toBe(vowels);
  });

  it('should check for vowels', function () {
    var token = (new StemmerToken('test')).usingVowels('aeiou');

    expect(token.hasVowelAtIndex(0)).toBe(false);
    expect(token.hasVowelAtIndex(1)).toBe(true);
    expect(token.hasVowelAtIndex(99)).toBe(false);
  });

  it('should find the next vowel', function () {
    var token = (new StemmerToken('tester')).usingVowels('aeiou');

    expect(token.nextVowelIndex(0)).toBe(1);
    expect(token.nextVowelIndex(1)).toBe(1);
    expect(token.nextVowelIndex(2)).toBe(4);
    expect(token.nextVowelIndex(5)).toBe(6);
    expect(token.nextVowelIndex(99)).toBe(6);
    expect(token.nextVowelIndex(-1)).toBe(6);
  });

  it('should find the next consonant', function () {
    var token = (new StemmerToken('testee')).usingVowels('aeiou');

    expect(token.nextConsonantIndex(0)).toBe(0);
    expect(token.nextConsonantIndex(1)).toBe(2);
    expect(token.nextConsonantIndex(5)).toBe(6);
    expect(token.nextConsonantIndex(99)).toBe(6);
    expect(token.nextConsonantIndex(-1)).toBe(6);
  });

  it('should mark regions', function() {
    var token = new StemmerToken('tester');

    token.markRegion('test', 1);
    expect(token.regions.test).toBe(1);
  });

  it('should mark regions with a callback', function() {
    var token = new StemmerToken('tester'),
      context = { value: 99 };

    token.markRegion('test', 1, function (arg) { return arg; });
    expect(token.regions.test).toBe(1);

    token.markRegion('test', [1], function (arg) { return arg; });
    expect(token.regions.test).toBe(1);

    token.markRegion('test', [1, 1], function (a1, a2) { return a1 + a2; });
    expect(token.regions.test).toBe(2);

    token.markRegion('test', null, function () { return this.string.length; });
    expect(token.regions.test).toBe(6);

    token.markRegion('test', null, function () { return this.value; }, context);
    expect(token.regions.test).toBe(99);
  });

});
