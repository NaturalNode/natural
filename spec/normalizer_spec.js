/*
Copyright (c) 2013, Ken Koch

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

var normalizer = require("../lib/natural/normalizers/normalizer.js");
        
describe('normalizer', function() {
    
    /**
     * Test Normal Execution. This tests that the basic rules are sound and does not consider special cases.
     **/
    describe("normal operations (rule execution)", function(){
        it("should correctly normalize n't as not", function(){
            expect(JSON.stringify(normalizer.normalize_tokens(["hasn't"]))).toBe(JSON.stringify(["has", "not"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["hadn't"]))).toBe(JSON.stringify(["had", "not"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["haven't"]))).toBe(JSON.stringify(["have", "not"]));
        });

        it("should correctly normalize 's as is", function(){
            expect(JSON.stringify(normalizer.normalize_tokens(["it's"]))).toBe(JSON.stringify(["it", "is"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["he's"]))).toBe(JSON.stringify(["he", "is"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["here's"]))).toBe(JSON.stringify(["here", "is"]));
        });

        it("should correctly normalize 'll as will", function(){
            expect(JSON.stringify(normalizer.normalize_tokens(["we'll"]))).toBe(JSON.stringify(["we", "will"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["he'll"]))).toBe(JSON.stringify(["he", "will"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["I'll"]))).toBe(JSON.stringify(["I", "will"]));
        });

        it("should correctly normalize 're as are", function(){
            expect(JSON.stringify(normalizer.normalize_tokens(["we're"]))).toBe(JSON.stringify(["we", "are"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["how're"]))).toBe(JSON.stringify(["how", "are"]));
        });

        it("should correctly normalize 'd as would", function(){
            expect(JSON.stringify(normalizer.normalize_tokens(["he'd"]))).toBe(JSON.stringify(["he", "would"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["I'd"]))).toBe(JSON.stringify(["I", "would"]));
        });
    });

    /**
     * Test special case execution, this ensures that special cases are correctly normalized.
     **/
    describe("special cases", function(){
        it("should convert can't to cannot", function(){
            expect(JSON.stringify(normalizer.normalize_tokens(["can't"]))).toBe(JSON.stringify(["can","not"]));
        });

        it("should convert couldn't've as could not have", function(){
            expect(JSON.stringify(normalizer.normalize_tokens(["couldn't've"]))).toBe(JSON.stringify(["could", "not", "have"]));
        });

        it("should convert how'd to how did", function(){
            expect(JSON.stringify(normalizer.normalize_tokens(["how'd"]))).toBe(JSON.stringify(["how", "did"]));
        });

        it("should correctly normalize I'm as I am", function(){
            expect(JSON.stringify(normalizer.normalize_tokens(["I'm"]))).toBe(JSON.stringify(["I", "am"]));
        });
    });

    /**
     * Test some basic properties of the normailization.
     **/
    describe("basic properties", function(){
        it("should handle different cases on special case conversion", function(){
            expect(JSON.stringify(normalizer.normalize_tokens(["I'm"]))).toBe(JSON.stringify(["I", "am"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["i'm"]))).toBe(JSON.stringify(["I", "am"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["can't"]))).toBe(JSON.stringify(["can", "not"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["Can't"]))).toBe(JSON.stringify(["can", "not"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["CaN'T"]))).toBe(JSON.stringify(["can", "not"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["how'd"]))).toBe(JSON.stringify(["how", "did"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["how'D"]))).toBe(JSON.stringify(["how", "did"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["HOw'd"]))).toBe(JSON.stringify(["how", "did"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["COULDN't've"]))).toBe(JSON.stringify(["could", "not", "have"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["couldn'T've"]))).toBe(JSON.stringify(["could", "not", "have"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["couldn't'VE"]))).toBe(JSON.stringify(["could", "not", "have"]));
        });
    
        // Note: In rule-based conversion, case will be preserved on the base word.
        it("should handle different cases on rule-based conversion", function(){
            expect(JSON.stringify(normalizer.normalize_tokens(["Hasn't"]))).toBe(JSON.stringify(["Has", "not"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["HAsn't"]))).toBe(JSON.stringify(["HAs", "not"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["hasn'T"]))).toBe(JSON.stringify(["has", "not"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["It's"]))).toBe(JSON.stringify(["It", "is"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["IT's"]))).toBe(JSON.stringify(["IT", "is"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["it'S"]))).toBe(JSON.stringify(["it", "is"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["We'll"]))).toBe(JSON.stringify(["We", "will"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["WE'll"]))).toBe(JSON.stringify(["WE", "will"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["we'Ll"]))).toBe(JSON.stringify(["we", "will"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["How're"]))).toBe(JSON.stringify(["How", "are"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["hOW're"]))).toBe(JSON.stringify(["hOW", "are"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["how'RE"]))).toBe(JSON.stringify(["how", "are"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["I'd"]))).toBe(JSON.stringify(["I", "would"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["i'd"]))).toBe(JSON.stringify(["i", "would"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["I'D"]))).toBe(JSON.stringify(["I", "would"]));
        });

        it("should convert a string to an array for normalization", function() {
            expect(JSON.stringify(normalizer.normalize_tokens("I'D"))).toBe(JSON.stringify(["I", "would"]));
        });

        it("should simply tokenize a string that does not match a rule", function() {
            expect(JSON.stringify(normalizer.normalize_tokens(["Has", "not"]))).toBe(JSON.stringify(["Has", "not"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["HAs", "not"]))).toBe(JSON.stringify(["HAs", "not"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["has", "noT"]))).toBe(JSON.stringify(["has", "noT"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["It", "is"]))).toBe(JSON.stringify(["It", "is"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["IT", "is"]))).toBe(JSON.stringify(["IT", "is"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["it", "iS"]))).toBe(JSON.stringify(["it", "iS"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["We", "will"]))).toBe(JSON.stringify(["We", "will"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["WE", "will"]))).toBe(JSON.stringify(["WE", "will"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["we", "wiLl"]))).toBe(JSON.stringify(["we", "wiLl"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["How", "are"]))).toBe(JSON.stringify(["How", "are"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["hOW", "are"]))).toBe(JSON.stringify(["hOW", "are"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["how", "aRE"]))).toBe(JSON.stringify(["how", "aRE"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["I", "would"]))).toBe(JSON.stringify(["I", "would"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["i", "would"]))).toBe(JSON.stringify(["i", "would"]));
            expect(JSON.stringify(normalizer.normalize_tokens(["I", "woulD"]))).toBe(JSON.stringify(["I", "woulD"]));
        });
    });
});
