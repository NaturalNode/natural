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

var normalizer = require("../lib/natural/normalizers/normalizer_no.js");

describe('normalizer_no', function() {

    /**
     * Test character normalization
     **/
    describe("Normalization of diacritical marks", function(){
        it("should leave uppercase and lowercase ä's untouched", function() {
            expect(normalizer.removeDiacritics('ä')).toBe('ä');
            expect(normalizer.removeDiacritics('Ä')).toBe('Ä');
        });

        it("should leave uppercase and lowercase ö's untouched", function() {
            expect(normalizer.removeDiacritics('ö')).toBe('ö');
            expect(normalizer.removeDiacritics('Ö')).toBe('Ö');
        });

        it("should leave uppercase and lowercase ü's untouched", function() {
            expect(normalizer.removeDiacritics('ü')).toBe('ü');
            expect(normalizer.removeDiacritics('Ü')).toBe('Ü');
        });

        it("should correctly normalize uppercase and lowercase a's with grave accents", function(){
            expect(normalizer.removeDiacritics('à')).toBe('a');
            expect(normalizer.removeDiacritics('À')).toBe('A');
        });

        it("should correctly normalize uppercase and lowercase a's with acute accents", function(){
            expect(normalizer.removeDiacritics('á')).toBe('a');
            expect(normalizer.removeDiacritics('Á')).toBe('A');
        });

        it("should correctly normalize uppercase and lowercase a's with circumflex accents", function(){
            expect(normalizer.removeDiacritics('â')).toBe('a');
            expect(normalizer.removeDiacritics('Â')).toBe('A');
        });

        it("should correctly normalize uppercase and lowercase c's with cedillas", function(){
            expect(normalizer.removeDiacritics('ç')).toBe('c');
            expect(normalizer.removeDiacritics('Ç')).toBe('C');
        });

        it("should correctly normalize uppercase and lowercase e's with grave accents", function(){
            expect(normalizer.removeDiacritics('è')).toBe('e');
            expect(normalizer.removeDiacritics('È')).toBe('E');
        });

        it("should correctly normalize uppercase and lowercase e's with acute accents", function(){
            expect(normalizer.removeDiacritics('é')).toBe('e');
            expect(normalizer.removeDiacritics('É')).toBe('E');
        });

        it("should correctly normalize uppercase and lowercase e's with circumflex accents", function(){
            expect(normalizer.removeDiacritics('ê')).toBe('e');
            expect(normalizer.removeDiacritics('Ê')).toBe('E');
        });

        it("should correctly normalize uppercase and lowercase i's with circumflex accents", function(){
            expect(normalizer.removeDiacritics('î')).toBe('i');
            expect(normalizer.removeDiacritics('Î')).toBe('I');
        });

        it("should correctly normalize uppercase and lowercase n's with tildes", function(){
            expect(normalizer.removeDiacritics('ñ')).toBe('n');
            expect(normalizer.removeDiacritics('Ñ')).toBe('N');
        });

        it("should correctly normalize uppercase and lowercase o's with acute accents", function(){
            expect(normalizer.removeDiacritics('ó')).toBe('o');
            expect(normalizer.removeDiacritics('Ó')).toBe('O');
        });

        it("should correctly normalize uppercase and lowercase o's with circumflex accents", function(){
            expect(normalizer.removeDiacritics('ô')).toBe('o');
            expect(normalizer.removeDiacritics('Ô')).toBe('O');
        });

        it("should correctly normalize uppercase and lowercase u's with circumflex accents", function(){
            expect(normalizer.removeDiacritics('û')).toBe('u');
            expect(normalizer.removeDiacritics('Û')).toBe('U');
        });

        it("should correctly normalize uppercase and lowercase s's with caron/wedge accents", function(){
            expect(normalizer.removeDiacritics('š')).toBe('s');
            expect(normalizer.removeDiacritics('Š')).toBe('S');
        });
    });
});
