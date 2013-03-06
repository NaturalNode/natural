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

var NounInflector = require('../lib/natural/inflectors/noun_inflector'),
    inflector = new NounInflector();

describe('noun inflector', function() {
    describe('singularization', function() {
        it('should drop an S by default', function() {
            expect(inflector.singularize('rrrs')).toBe('rrr');
            expect(inflector.singularize('hackers')).toBe('hacker');
            expect(inflector.singularize('movies')).toBe('movie');
            
            // MAN cases that don't pluralize to MEN            
            expect(inflector.singularize('talismans')).toBe('talisman');
            expect(inflector.singularize('humans')).toBe('human');
            expect(inflector.singularize('prehumans')).toBe('prehuman');            
        });
        
        it('should handle ambiguous form', function() {
            expect(inflector.singularize('deer')).toBe('deer');
            expect(inflector.singularize('fish')).toBe('fish');
            expect(inflector.singularize('series')).toBe('series');
            expect(inflector.singularize('sheep')).toBe('sheep');
            expect(inflector.singularize('trout')).toBe('trout');
        });
        
        it('should convert plurals ending SES to S', function() {
            expect(inflector.singularize('statuses')).toBe('status');
            expect(inflector.singularize('buses')).toBe('bus');
        });        
        
        it('should match irregulars', function() {
            expect(inflector.singularize('people')).toBe('person');
            expect(inflector.singularize('children')).toBe('child');
            expect(inflector.singularize('oxen')).toBe('ox');
        });
        
        it('should handle IX cases', function() {
            expect(inflector.singularize('matrices')).toBe('matrix');
            expect(inflector.singularize('indices')).toBe('index');
            // our pluralizer won''t cause this form of appendix (appendicies)
            // but we should handle it
            expect(inflector.singularize('appendices')).toBe('appendix');
        });        
        
        it('should regulars to ES', function() {
            expect(inflector.singularize('churches')).toBe('church');
            expect(inflector.singularize('appendixes')).toBe('appendix');
            expect(inflector.singularize('messes')).toBe('mess');
            expect(inflector.singularize('quizes')).toBe('quiz');
            expect(inflector.singularize('shoes')).toBe('shoe');
            expect(inflector.singularize('funguses')).toBe('fungus');
        });
        
        it('should handle SIS cases', function() {
            expect(inflector.singularize('synopses')).toBe('synopsis');
            expect(inflector.singularize('parentheses')).toBe('parenthesis');            
        });        

        it('should handle special OES cases', function() {
            expect(inflector.singularize('tomatoes')).toBe('tomato');
        });

        it('should handle I cases', function() {
            expect(inflector.singularize('octopi')).toBe('octopus');
            expect(inflector.singularize('stimuli')).toBe('stimulus');
            expect(inflector.singularize('radii')).toBe('radius');
            expect(inflector.singularize('nuclei')).toBe('nucleus');
            expect(inflector.singularize('fungi')).toBe('fungus');
            expect(inflector.singularize('cacti')).toBe('cactus');
        });
        
        it('should handle IVES cases', function() {
            expect(inflector.singularize('lives')).toBe('life');
            expect(inflector.singularize('knives')).toBe('knife');
        });

        it('should handle Y cases', function() {
            expect(inflector.singularize('parties')).toBe('party');
            expect(inflector.singularize('flies')).toBe('fly');
            expect(inflector.singularize('victories')).toBe('victory');
            expect(inflector.singularize('monstrosities')).toBe('monstrosity');
        });

	it('should handle MAN->MAN cases', function() {
	    expect(inflector.singularize('men')).toBe('man');
	    expect(inflector.singularize('women')).toBe('woman');
	    expect(inflector.singularize('workmen')).toBe('workman');
	    expect(inflector.singularize('riflemen')).toBe('rifleman');            
        });

	it('should handle irregular cases', function() {
	    expect(inflector.singularize('feet')).toBe('foot');
	    expect(inflector.singularize('geese')).toBe('goose');
	    expect(inflector.singularize('teeth')).toBe('tooth');
	});
        
	it('should handle AE cases', function() {
	    expect(inflector.singularize('antennae')).toBe('antenna');
	    expect(inflector.singularize('formulae')).toBe('formula');
	    expect(inflector.singularize('nebulae')).toBe('nebula');
	    expect(inflector.singularize('vertebrae')).toBe('vertebra');
	    expect(inflector.singularize('vitae')).toBe('vita');
        });
        
	it('should allow AE cases to be S', function() {
	    expect(inflector.singularize('antennas')).toBe('antenna');
	    expect(inflector.singularize('formulas')).toBe('formula');
        });        
    });

    describe('pluralization', function() {
        it('should append an S by default', function() {
            expect(inflector.pluralize('rrr')).toBe('rrrs');
            expect(inflector.pluralize('hacker')).toBe('hackers');
            expect(inflector.pluralize('movie')).toBe('movies');
        });
        
        it('should handle ambiguous form', function() {
            expect(inflector.pluralize('deer')).toBe('deer');
            expect(inflector.pluralize('fish')).toBe('fish');
            expect(inflector.pluralize('series')).toBe('series');
            expect(inflector.pluralize('sheep')).toBe('sheep');
            expect(inflector.pluralize('trout')).toBe('trout');
        });
        
        it('should convert singulars ending s to ses', function() {
            expect(inflector.pluralize('status')).toBe('statuses');
            expect(inflector.pluralize('bus')).toBe('buses');
        });
        
        it('should match irregulars', function() {
            expect(inflector.pluralize('person')).toBe('people');
            expect(inflector.pluralize('child')).toBe('children');
            expect(inflector.pluralize('ox')).toBe('oxen');
        });
        
        it('should maintain case of irregulars', function() {
            expect(inflector.pluralize('OX')).toBe('OXEN');
            expect(inflector.pluralize('Person')).toBe('People');
            expect(inflector.pluralize('child')).toBe('children');
        });

        it('should handle IX cases', function() {
            expect(inflector.pluralize('matrix')).toBe('matrices');
            expect(inflector.pluralize('index')).toBe('indices');
        });        
        
        it('should regulars to ES', function() {
            expect(inflector.pluralize('church')).toBe('churches');
            expect(inflector.pluralize('appendix')).toBe('appendixes');
            expect(inflector.pluralize('mess')).toBe('messes');
            expect(inflector.pluralize('quiz')).toBe('quizes');
            expect(inflector.pluralize('shoe')).toBe('shoes');
        });
        
        it('should handle SIS cases', function() {
            expect(inflector.pluralize('synopsis')).toBe('synopses');
            expect(inflector.pluralize('parenthesis')).toBe('parentheses');            
        });
        
        it('should handle special OES cases', function() {
            expect(inflector.pluralize('tomato')).toBe('tomatoes');
        });

        it('should handle I cases', function() {
            expect(inflector.pluralize('radius')).toBe('radii');
            expect(inflector.pluralize('octopus')).toBe('octopi');
            expect(inflector.pluralize('stimulus')).toBe('stimuli');
            expect(inflector.pluralize('nucleus')).toBe('nuclei');
            expect(inflector.pluralize('fungus')).toBe('fungi');
            expect(inflector.pluralize('cactus')).toBe('cacti');
        });
        
        it('should handle IVES cases', function() {
            expect(inflector.pluralize('knife')).toBe('knives');
            expect(inflector.pluralize('life')).toBe('lives');            
        });

        it('should handle Y cases', function() {
            expect(inflector.pluralize('party')).toBe('parties');
            expect(inflector.pluralize('fly')).toBe('flies');
            expect(inflector.pluralize('victory')).toBe('victories');
            expect(inflector.pluralize('monstrosity')).toBe('monstrosities');
        });

	it('should handle MAN->MEN cases', function() {
	    expect(inflector.pluralize('man')).toBe('men');
	    expect(inflector.pluralize('woman')).toBe('women');
            expect(inflector.pluralize('workman')).toBe('workmen');
            expect(inflector.pluralize('rifleman')).toBe('riflemen');            
        });

	it('should handle irregular cases', function() {
	    expect(inflector.pluralize('foot')).toBe('feet');
	    expect(inflector.pluralize('goose')).toBe('geese');
	    expect(inflector.pluralize('tooth')).toBe('teeth');
            
            // MAN cases that don't pluralize to MEN
            expect(inflector.pluralize('talisman')).toBe('talismans');
            expect(inflector.pluralize('human')).toBe('humans');
            expect(inflector.pluralize('prehuman')).toBe('prehumans');            
	});
        
	it('should handle AE cases', function() {
	    expect(inflector.pluralize('antenna')).toBe('antennae');
	    expect(inflector.pluralize('formula')).toBe('formulae');
	    expect(inflector.pluralize('nebula')).toBe('nebulae');
	    expect(inflector.pluralize('vertebra')).toBe('vertebrae');
	    expect(inflector.pluralize('vita')).toBe('vitae');
        });        
    });
    
    describe('should pluralize and singularize string from patch', function() {
        inflector.attach();
        expect('synopsis'.pluralizeNoun()).toBe('synopses');
        expect('synopses'.singularizeNoun()).toBe('synopsis');        
        expect('mess'.pluralizeNoun()).toBe('messes');
        expect('messes'.singularizeNoun()).toBe('mess');
    });

    describe('custom inflections', function() {
        describe('should pluralize and singularize custom forms', function() {
            var myInflector = new NounInflector();
            myInflector.attach();
            myInflector.addPlural(/(code|ware)/i, '$1z');
            myInflector.addSingular(/(code|ware)z/i, '$1');
            expect('code'.pluralizeNoun()).toBe('codez');
            expect('ware'.pluralizeNoun()).toBe('warez');
            expect('codez'.singularizeNoun()).toBe('code');
            expect('warez'.singularizeNoun()).toBe('ware');
        });
        
        describe('should not break regular forms', function() {
            var myInflector = new NounInflector();
            myInflector.attach();
            myInflector.addPlural(/(code|ware)/i, '$1z');
            myInflector.addSingular(/(code|ware)z/i, '$1');
            expect('bus'.pluralizeNoun()).toBe('buses');
            expect('buses'.singularizeNoun()).toBe('bus');            
        });
    });
});
