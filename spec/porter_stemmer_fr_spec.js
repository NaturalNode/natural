/*
Copyright (c) 2014, Ismaël Héry

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

var stemmer = require('../lib/natural/stemmers/porter_stemmer_fr');

describe('porter_stemmer', function() {

  it('should prelude', function() {
    expect(stemmer.prelude('JOUER')).toBe('joUer');
    expect(stemmer.prelude('ennuie')).toBe('ennuIe');
    expect(stemmer.prelude('yeux')).toBe('Yeux');
    expect(stemmer.prelude('quand')).toBe('qUand');
  });

  it('should give rv region', function() {
    expect(stemmer.rvRegion('parade')).toBe('ade');
    expect(stemmer.rvRegion('colet')).toBe('et');
    expect(stemmer.rvRegion('tapis')).toBe('is');
    expect(stemmer.rvRegion('aimer')).toBe('er');
    expect(stemmer.rvRegion('adorer')).toBe('rer');
    expect(stemmer.rvRegion('voler')).toBe('ler');
  });

  it('should give r1 region', function() {
    expect(stemmer.r1Region('fameusement')).toBe('eusement');
  });

});
