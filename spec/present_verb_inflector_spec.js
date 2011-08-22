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

var VerbInflector = require('lib/natural/inflectors/present_verb_inflector'),
    inflector = new VerbInflector ();

describe('present verb inflector', function() {
    describe('singularization', function() {
        it('should singularize regular ES forms', function() {
            expect(inflector.singularize('catch')).toBe('catches');
            expect(inflector.singularize('do')).toBe('does');
            expect(inflector.singularize('go')).toBe('goes');
        });

        it('should handle [CS]HES forms', function () {
            expect(inflector.singularize('cash')).toBe('cashes');
            expect(inflector.singularize('ach')).toBe('aches');
        });

        it('should ignore XES forms', function() {
            expect(inflector.singularize('annex')).toBe('annexes');
        });

        it('should handle SSES forms', function() {
            expect(inflector.singularize('access')).toBe('accesses');
        });

        it('should ignore ZZES forms', function() {
            expect(inflector.singularize('buzz')).toBe('buzzes');
        });

        it('should singularize regular S forms', function() {
            expect(inflector.singularize('claim')).toBe('claims');
            expect(inflector.singularize('drink')).toBe('drinks');
            expect(inflector.singularize('become')).toBe('becomes');
        });

        it('should singularize irregular forms', function() {
            expect(inflector.singularize('are')).toBe('is');
            expect(inflector.singularize('were')).toBe('was');
        });
        
        it('should handle ambiguous forms', function() {
            expect(inflector.singularize('will')).toBe('will');
        });                
    });
    
    describe('pluralization', function() {
        it('should pluralize regular ES forms', function() {
            expect(inflector.pluralize('catches')).toBe('catch');
            expect(inflector.pluralize('does')).toBe('do');
            expect(inflector.pluralize('goes')).toBe('go');
        });
        
        it('should handle [CS]HES forms', function () {
            expect(inflector.pluralize('cashes')).toBe('cash');
            expect(inflector.pluralize('aches')).toBe('ach');            
        });        
        
        it('should handle XES forms', function() {
            expect(inflector.pluralize('annexes')).toBe('annex');
        });

        it('should handle SSES forms', function() {
            expect(inflector.pluralize('accesses')).toBe('access');
        });

        it('should handle ZZES forms', function() {
            expect(inflector.pluralize('buzzes')).toBe('buzz');
        });

        it('should pluralize regular S forms that done drop e', function() {
            expect(inflector.pluralize('becomes')).toBe('become');
        });

        it('should pluralize regular S forms', function() {
            expect(inflector.pluralize('drinks')).toBe('drink');
            expect(inflector.pluralize('claims')).toBe('claim');            
        });
        
        it('should pluralize irregular forms', function() {
            expect(inflector.pluralize('was')).toBe('were');                        
            expect(inflector.pluralize('is')).toBe('are');
        });
        
        it('should handle ambiguous forms', function() {
            expect(inflector.pluralize('will')).toBe('will');                        
        });
    });
    
    describe('should pluralize and singularize string from patch', function() {
        inflector.attach();
        expect('becomes'.pluralizePresentVerb()).toBe('become');
        expect('become'.singularizePresentVerb()).toBe('becomes');
    });
});
