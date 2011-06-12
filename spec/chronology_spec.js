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

var now = new Date(2000, 0, 1, 0, 0, 0, 0),
    natural = require('lib/natural'),
    chronology = new natural.Chronology(now);

describe('chronology', function() {
    it('should parse "today" as today\'s date', function() {
        var result = chronology.parse('today');
    
        expect(result.getFullYear()).toBe(2000);
        expect(result.getMonth()).toBe(0);
        expect(result.getDate()).toBe(1);
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);        
    });
    
    it('should parse "noon" as 12:00', function() {
        var result = chronology.parse('noon');
    
        expect(result.getHours()).toBe(12);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);        
    });
    
    it('should handle multiple tokens', function() {
        var result = chronology.parse('today at noon');
        
        expect(result.getFullYear()).toBe(2000);
        expect(result.getMonth()).toBe(0);
        expect(result.getDate()).toBe(1);
        expect(result.getHours()).toBe(12);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);        
    });
    
    it('should handle half-passed', function() {
        var result = chronology.parse('half passed noon');
        expect(result.getHours()).toBe(12);
        expect(result.getMinutes()).toBe(30);
    });
    
    it('should handle quarter-passed', function() {
        var result = chronology.parse('quarter passed noon');
        expect(result.getHours()).toBe(12);
        expect(result.getMinutes()).toBe(15);
    });
    
    it('should handle quarter-to', function() {
        var result = chronology.parse('quarter till noon');        
        expect(result.getHours()).toBe(11);
        expect(result.getMinutes()).toBe(45);
        
        result = chronology.parse('quarter to noon');
        expect(result.getHours()).toBe(11);
        expect(result.getMinutes()).toBe(45);
    });    
});
