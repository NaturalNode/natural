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

describe('lancaster_stemmer', function() {
    var stemmer = require('lib/natural/stemmers/lancaster_stemmer');

    it('should stem', function() {
	stemmer.attach();

        expect('marks'.stem()).toBe('mark');
        expect('MARKs'.stem()).toBe('mark');        
    });

    it('should stop running rules where appropriate', function() {
	stemmer.attach();

        expect('living'.stem()).toBe('liv');
        expect('thing'.stem()).toBe('thing');
        expect('ear'.stem()).toBe('ear');
        expect('string'.stem()).toBe('string');
    });

    it('should only pop the size specified by the rule', function() {
	stemmer.attach();

        expect('triplicate'.stem()).toBe('triply');
        expect('triPlicAte'.stem()).toBe('triply');        
    });
    
    it('should stem and append and recurse', function() {
	stemmer.attach();

        expect('classified'.stem()).toBe('class');
        expect('ClaSsiFied'.stem()).toBe('class');        
    });
    
    it('should apply intact rules only to intact string', function() {
	stemmer.attach();

        expect('maximum'.stem()).toBe('maxim');
        expect('presumably'.stem()).toBe('presum');
        expect('MAXIMUM'.stem()).toBe('maxim');
        expect('PRESUMABLY'.stem()).toBe('presum');        
    });
});
