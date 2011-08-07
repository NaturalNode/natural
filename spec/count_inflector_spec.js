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

var CountInflector = (require('lib/natural/inflectors/count_inflector'));

describe('count_inflector', function() {
    it('should handle 1st cases', function() {
        expect(CountInflector.nth(1)).toBe('1st');
        expect(CountInflector.nth(101)).toBe('101st');
        expect(CountInflector.nth(11)).toNotBe('11st');
        expect(CountInflector.nth(111)).toNotBe('111st');
    });

    it('should handle the 12th cases', function() {
        expect(CountInflector.nth(12)).toBe('12th');
        expect(CountInflector.nth(112)).toBe('112th');
        expect(CountInflector.nth(1112)).toBe('1112th');
    });
    
    it('should handle the 11th cases', function() {
        expect(CountInflector.nth(11)).toBe('11th');
        expect(CountInflector.nth(111)).toBe('111th');
        expect(CountInflector.nth(1111)).toBe('1111th');
    });

    it('should handle the 13th cases', function() {
        expect(CountInflector.nth(13)).toBe('13th');
        expect(CountInflector.nth(113)).toBe('113th');
        expect(CountInflector.nth(1113)).toBe('1113th');
    });
    
    it('should handle the th cases', function() {
        expect(CountInflector.nth(10)).toBe('10th');
        expect(CountInflector.nth(4)).toBe('4th');
        expect(CountInflector.nth(400)).toBe('400th');
        expect(CountInflector.nth(404)).toBe('404th');
        expect(CountInflector.nth(5)).toBe('5th');
        expect(CountInflector.nth(5000)).toBe('5000th');
        expect(CountInflector.nth(5005)).toBe('5005th');
        expect(CountInflector.nth(9)).toBe('9th');
        expect(CountInflector.nth(90009)).toBe('90009th');
        expect(CountInflector.nth(90000)).toBe('90000th');
    });
    
    it('should handle 2nd cases', function() {
        expect(CountInflector.nth(2)).toBe('2nd');
        expect(CountInflector.nth(12)).toNotBe('12nd');        
    });
    
    it('should handle 3rd cases', function() {
        expect(CountInflector.nth(3)).toBe('3rd');
        expect(CountInflector.nth(13)).toNotBe('13rd');         
    });
});