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

  it('should hold the original token string', function () {
    var string = 'test',
      token    = new StemmerToken(string);

    expect(token.original).toBe(string);
  });

  it('should replace all instances of a string', function () {
    var string = 'tester',
      token    = new StemmerToken(string);

    token.replaceAll('e', 'a');
    expect(token.string).toBe('tastar');

    token.replaceAll('ar', 'er');
    expect(token.string).toBe('taster');

    token.replaceAll('r', '');
    expect(token.string).toBe('taste');
  });

  it('should allow vowels to be set', function () {
    var vowels    = 'aeiou',
      vowelsArray = vowels.split(''),
      token       = new StemmerToken('');

    token.usingVowels(vowels);
    expect(token.vowels).toBe(vowels);

    token.usingVowels(vowelsArray);
    expect(token.vowels).toBe(vowelsArray);
  });

  it('should check for vowels', function () {
    var vowels = 'aeiou',
      token    = new StemmerToken('test');

    token.usingVowels(vowels);

    expect(token.hasVowelAtIndex(0)).toBe(false);
    expect(token.hasVowelAtIndex(1)).toBe(true);
    expect(token.hasVowelAtIndex(99)).toBe(false);

    token.usingVowels(vowels.split(''));

    expect(token.hasVowelAtIndex(0)).toBe(false);
    expect(token.hasVowelAtIndex(1)).toBe(true);
    expect(token.hasVowelAtIndex(99)).toBe(false);
  });

  it('should find the next vowel', function () {
    var token = new StemmerToken('tester').usingVowels('aeiou');

    expect(token.nextVowelIndex(0)).toBe(1);
    expect(token.nextVowelIndex(1)).toBe(1);
    expect(token.nextVowelIndex(2)).toBe(4);
    expect(token.nextVowelIndex(5)).toBe(6);
    expect(token.nextVowelIndex(99)).toBe(6);
    expect(token.nextVowelIndex(-1)).toBe(6);
  });

  it('should find the next consonant', function () {
    var token = new StemmerToken('testee').usingVowels('aeiou');

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

  it('should check for suffixes', function() {
    var token = new StemmerToken('tester');

    expect(token.hasSuffix('er')).toBe(true);
    expect(token.hasSuffix('st')).toBe(false);
  });

  it('should check for suffixes within a region', function() {
    var token = new StemmerToken('tester').markRegion('region', 2);

    expect(token.hasSuffixInRegion('st', 'region')).toBe(false);
    expect(token.hasSuffixInRegion('ster', 'region')).toBe(true);
    expect(token.hasSuffixInRegion('ester', 'region')).toBe(false);
  });

  it('should replace the suffix within a region', function() {
    var t1 = new StemmerToken('tester').markRegion('region', 4),
      t2   = new StemmerToken('tester').markRegion('region', 0);

    t1.replaceSuffixInRegion('ter', '<s>', 'region');
    expect(t1.string).toBe('tester');

    t1.replaceSuffixInRegion('er', '<s>', 'region');
    expect(t1.string).toBe('test<s>');

    t2.replaceSuffixInRegion('protester', '<s>', 'region');
    expect(t2.string).toBe('tester');
  });

});
