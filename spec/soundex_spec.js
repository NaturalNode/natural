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

var soundex = require('lib/natural/phonetics/soundex');

describe('soundex', function() {   
    describe('transformLipps', function() {
        it('should replace B, F, P, and V with 1', function() {
            expect(soundex.transformLipps('bopper')).toBe('1o11er');
            expect(soundex.transformLipps('valumf')).toBe('1alum1');
        });
    });
    
    describe('transformThroats', function() {
        it('should replace C, G, J, K, Q, S, X, Z with 2', function() {
            expect(soundex.transformLipps('bopper')).toBe('1o11er');
            expect(soundex.transformLipps('valumf')).toBe('1alum1');
        });
    });
    
    describe('transformTongue', function() {
        it('should replace D and T with 3', function() {
            expect(soundex.transformToungue('dat')).toBe('3a3');
        });
    });

    describe('transformL', function() {
        it('should replace L with 4', function() {
            expect(soundex.transformL('lala')).toBe('4a4a');
        });
    });
    
    describe('transformHum', function() {
        it('should replace M and N with 5', function() {
            expect(soundex.transformHum('mummification')).toBe('5u55ificatio5');
        });
    });
    
    describe('transformR', function() {
        it('should replace R with 6', function() {
            expect(soundex.transformR('render')).toBe('6ende6');
        });
    });
    
    describe('condense', function() {
        it('sound condense sequences', function() {
            expect(soundex.condense('11222556')).toBe('1256');
        });

        it('sound condense sequences around H and W', function() {
            expect(soundex.condense('113w355')).toBe('135');
        });
        
        it('sound drop irrelevant H and W', function() {
            expect(soundex.condense('phonetics')).toBe('ponetics');
            expect(soundex.condense('towering')).toBe('toering');            
        });
    });
    
    describe('padRight0', function() {
        it('sound padd zeros on the right to a lenght of 3', function() {
            expect(soundex.padRight0('1')).toBe('100');
            expect(soundex.padRight0('11')).toBe('110');
            expect(soundex.padRight0('111')).toBe('111');            
        });        
    });
    
    it('should not code the first character', function() {
        expect(soundex.process('render').charAt(0)).toBe('R');
    });
    
    it('should pad right with zeros', function() {
        expect(soundex.process('super')).toBe('S160');
        expect(soundex.process('butt')).toBe('B300');
        expect(soundex.process('a')).toBe('A000');        
    });
    
    it('should pad right with zeros', function() {
        expect(soundex.process('but')).toBe('B300');
    });
    
    it('should perform soundex', function() {
        expect(soundex.process('BLACKBERRY')).toBe('B421');
        expect(soundex.process('blackberry')).toBe('B421');
        expect(soundex.process('calculate')).toBe('C424');
        expect(soundex.process('CALCULATE')).toBe('C424');
        expect(soundex.process('fox')).toBe('F200');
        expect(soundex.process('FOX')).toBe('F200');
        expect(soundex.process('jump')).toBe('J510');
        expect(soundex.process('JUMP')).toBe('J510');
        expect(soundex.process('phonetics')).toBe('P532');
        expect(soundex.process('PHONETICS')).toBe('P532');

    });
    
    it('should perform soundex via compare method', function() {
        expect(soundex.compare('ant', 'and')).toBeTruthy();
        expect(soundex.compare('ant', 'anne')).toBeFalsy();
        expect(soundex.compare('band', 'bant')).toBeTruthy();
        expect(soundex.compare('band', 'gand')).toBeFalsy();
    });
    
    it('should perform soundex via attached soundsLike String patch', function() {
        soundex.attach();
        expect('ant'.soundsLike('ant')).toBeTruthy();
        expect('ant'.soundsLike('anne')).toBeFalsy();
        expect('band'.soundsLike('bant')).toBeTruthy();
        expect('band'.soundsLike('gand')).toBeFalsy();
    });
    
    it('should return string phonetics with string patch', function() {
        soundex.attach();
        expect('phonetics'.phonetics()).toBe('P532');
        expect('PHONETICS'.phonetics()).toBe('P532');        
    });
    
    it('should tokenize and return string phonetics with string patch', function() {
        soundex.attach();
        expect('phonetics'.tokenizeAndPhoneticize()).toEqual(['P532']);
        expect('phonetics jump'.tokenizeAndPhoneticize()).toEqual(['P532', 'J510']);
        expect('phonetics jump calculate'.tokenizeAndPhoneticize()).toEqual(['P532', 'J510', 'C424']);        
    });      

    it('should max out at four characters long by default', function() {
        expect(soundex.process('supercalifragilisticexpialidocious').length).toBe(4);
    });    

    it('should truncate to specified length if maxLength passed', function() {
        expect(soundex.process('supercalifragilisticexpialidocious', 8).length).toBe(8);
    });    

    it('should handle a maxLength beyond code length', function() {
        expect(soundex.process('JUMP', 8)).toBe('J510');
    });
});
