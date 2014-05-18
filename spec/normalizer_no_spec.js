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
            expect(normalizer.remove_diacritics('ä')).toBe('ä');
            expect(normalizer.remove_diacritics('Ä')).toBe('Ä');
        });

        it("should leave uppercase and lowercase ö's untouched", function() {
            expect(normalizer.remove_diacritics('ö')).toBe('ö');
            expect(normalizer.remove_diacritics('Ö')).toBe('Ö');
        });

        it("should leave uppercase and lowercase ü's untouched", function() {
            expect(normalizer.remove_diacritics('ü')).toBe('ü');
            expect(normalizer.remove_diacritics('Ü')).toBe('Ü');
        });

        it("should correctly normalize uppercase and lowercase a's with grave accents", function(){
            expect(normalizer.remove_diacritics('à')).toBe('a');
            expect(normalizer.remove_diacritics('À')).toBe('A');
        });

        it("should correctly normalize uppercase and lowercase a's with acute accents", function(){
            expect(normalizer.remove_diacritics('á')).toBe('a');
            expect(normalizer.remove_diacritics('Á')).toBe('A');
        });

        it("should correctly normalize uppercase and lowercase a's with circumflex accents", function(){
            expect(normalizer.remove_diacritics('â')).toBe('a');
            expect(normalizer.remove_diacritics('Â')).toBe('A');
        });

        it("should correctly normalize uppercase and lowercase c's with cedillas", function(){
            expect(normalizer.remove_diacritics('ç')).toBe('c');
            expect(normalizer.remove_diacritics('Ç')).toBe('C');
        });

        it("should correctly normalize uppercase and lowercase e's with grave accents", function(){
            expect(normalizer.remove_diacritics('è')).toBe('e');
            expect(normalizer.remove_diacritics('È')).toBe('E');
        });

        it("should correctly normalize uppercase and lowercase e's with acute accents", function(){
            expect(normalizer.remove_diacritics('é')).toBe('e');
            expect(normalizer.remove_diacritics('É')).toBe('E');
        });

        it("should correctly normalize uppercase and lowercase e's with circumflex accents", function(){
            expect(normalizer.remove_diacritics('ê')).toBe('e');
            expect(normalizer.remove_diacritics('Ê')).toBe('E');
        });

        it("should correctly normalize uppercase and lowercase i's with circumflex accents", function(){
            expect(normalizer.remove_diacritics('î')).toBe('i');
            expect(normalizer.remove_diacritics('Î')).toBe('I');
        });

        it("should correctly normalize uppercase and lowercase n's with tildes", function(){
            expect(normalizer.remove_diacritics('ñ')).toBe('n');
            expect(normalizer.remove_diacritics('Ñ')).toBe('N');
        });

        it("should correctly normalize uppercase and lowercase o's with acute accents", function(){
            expect(normalizer.remove_diacritics('ó')).toBe('o');
            expect(normalizer.remove_diacritics('Ó')).toBe('O');
        });

        it("should correctly normalize uppercase and lowercase o's with circumflex accents", function(){
            expect(normalizer.remove_diacritics('ô')).toBe('o');
            expect(normalizer.remove_diacritics('Ô')).toBe('O');
        });

        it("should correctly normalize uppercase and lowercase u's with circumflex accents", function(){
            expect(normalizer.remove_diacritics('û')).toBe('u');
            expect(normalizer.remove_diacritics('Û')).toBe('U');
        });

        it("should correctly normalize uppercase and lowercase s's with caron/wedge accents", function(){
            expect(normalizer.remove_diacritics('š')).toBe('s');
            expect(normalizer.remove_diacritics('Š')).toBe('S');
        });
    });
});
