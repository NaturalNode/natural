/*
Copyright (c) 2014, Kristoffer Brabrand

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

'use strict'

import { normalizeNo as normalizer } from 'lib/natural'

describe('normalizer_no', function () {
  /**
     * Test character normalization
     **/
  describe('Normalization of diacritical marks', function () {
    it("should leave uppercase and lowercase ä's untouched", function () {
      expect(normalizer('ä')).toBe('ä')
      expect(normalizer('Ä')).toBe('Ä')
    })

    it("should leave uppercase and lowercase ö's untouched", function () {
      expect(normalizer('ö')).toBe('ö')
      expect(normalizer('Ö')).toBe('Ö')
    })

    it("should leave uppercase and lowercase ü's untouched", function () {
      expect(normalizer('ü')).toBe('ü')
      expect(normalizer('Ü')).toBe('Ü')
    })

    it("should correctly normalize uppercase and lowercase a's with grave accents", function () {
      expect(normalizer('à')).toBe('a')
      expect(normalizer('À')).toBe('A')
    })

    it("should correctly normalize uppercase and lowercase a's with acute accents", function () {
      expect(normalizer('á')).toBe('a')
      expect(normalizer('Á')).toBe('A')
    })

    it("should correctly normalize uppercase and lowercase a's with circumflex accents", function () {
      expect(normalizer('â')).toBe('a')
      expect(normalizer('Â')).toBe('A')
    })

    it("should correctly normalize uppercase and lowercase c's with cedillas", function () {
      expect(normalizer('ç')).toBe('c')
      expect(normalizer('Ç')).toBe('C')
    })

    it("should correctly normalize uppercase and lowercase e's with grave accents", function () {
      expect(normalizer('è')).toBe('e')
      expect(normalizer('È')).toBe('E')
    })

    it("should correctly normalize uppercase and lowercase e's with acute accents", function () {
      expect(normalizer('é')).toBe('e')
      expect(normalizer('É')).toBe('E')
    })

    it("should correctly normalize uppercase and lowercase e's with circumflex accents", function () {
      expect(normalizer('ê')).toBe('e')
      expect(normalizer('Ê')).toBe('E')
    })

    it("should correctly normalize uppercase and lowercase i's with circumflex accents", function () {
      expect(normalizer('î')).toBe('i')
      expect(normalizer('Î')).toBe('I')
    })

    it("should correctly normalize uppercase and lowercase n's with tildes", function () {
      expect(normalizer('ñ')).toBe('n')
      expect(normalizer('Ñ')).toBe('N')
    })

    it("should correctly normalize uppercase and lowercase o's with acute accents", function () {
      expect(normalizer('ó')).toBe('o')
      expect(normalizer('Ó')).toBe('O')
    })

    it("should correctly normalize uppercase and lowercase o's with circumflex accents", function () {
      expect(normalizer('ô')).toBe('o')
      expect(normalizer('Ô')).toBe('O')
    })

    it("should correctly normalize uppercase and lowercase u's with circumflex accents", function () {
      expect(normalizer('û')).toBe('u')
      expect(normalizer('Û')).toBe('U')
    })

    it("should correctly normalize uppercase and lowercase s's with caron/wedge accents", function () {
      expect(normalizer('š')).toBe('s')
      expect(normalizer('Š')).toBe('S')
    })
  })
})
