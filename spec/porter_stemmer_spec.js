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

var stemmer = require('../lib/natural/stemmers/porter_stemmer');

describe('porter_stemmer', function() {
	it('should perform step 1a', function() {
		expect(stemmer.step1a('caresses')).toBe('caress');
		expect(stemmer.step1a('ponies')).toBe('poni');
		expect(stemmer.step1a('ties')).toBe('ti');
		expect(stemmer.step1a('caress')).toBe('caress');
		expect(stemmer.step1a('cats')).toBe('cat');
	 });

	it('should perform step 1b', function() {
		expect(stemmer.step1b('feed')).toBe('feed');
		expect(stemmer.step1b('agreed')).toBe('agree');
		expect(stemmer.step1b('plastered')).toBe('plaster');
		expect(stemmer.step1b('bled')).toBe('bled');
		expect(stemmer.step1b('motoring')).toBe('motor');
		expect(stemmer.step1b('sing')).toBe('sing');
	});

	it('should perform step 1c', function() {
		expect(stemmer.step1c('happy')).toBe('happi');
		expect(stemmer.step1c('sky')).toBe('sky');
	});

	it('should perform step 2', function() {
		expect(stemmer.step2('relational')).toBe('relate');
		expect(stemmer.step2('conditional')).toBe('condition');
		expect(stemmer.step2('rational')).toBe('rational');
		expect(stemmer.step2('valenci')).toBe('valence');
		expect(stemmer.step2('hesitanci')).toBe('hesitance');
		expect(stemmer.step2('digitizer')).toBe('digitize');
		expect(stemmer.step2('conformabli')).toBe('conformable');
		expect(stemmer.step2('radicalli')).toBe('radical');
		expect(stemmer.step2('differentli')).toBe('different');
		expect(stemmer.step2('vileli')).toBe('vile');
		expect(stemmer.step2('analogousli')).toBe('analogous');
		expect(stemmer.step2('vietnamization')).toBe('vietnamize');
		expect(stemmer.step2('predication')).toBe('predicate');
		expect(stemmer.step2('operator')).toBe('operate');
		expect(stemmer.step2('feudalism')).toBe('feudal');
		expect(stemmer.step2('decisiveness')).toBe('decisive');
		expect(stemmer.step2('hopefulness')).toBe('hopeful');
		expect(stemmer.step2('callousness')).toBe('callous');
		expect(stemmer.step2('formaliti')).toBe('formal');
		expect(stemmer.step2('sensitiviti')).toBe('sensitive');
		expect(stemmer.step2('sensibiliti')).toBe('sensible');
	});

	it('should perform step 3', function() {
		expect(stemmer.step3('triplicate')).toBe('triplic');
		expect(stemmer.step3('formative')).toBe('form');
		expect(stemmer.step3('formalize')).toBe('formal');
		expect(stemmer.step3('electriciti')).toBe('electric');
		expect(stemmer.step3('electrical')).toBe('electric');
		expect(stemmer.step3('hopeful')).toBe('hope');
		expect(stemmer.step3('goodness')).toBe('good');
	});

	it('should perform step 4', function() {
		expect(stemmer.step4('revival')).toBe('reviv');
		expect(stemmer.step4('allowance')).toBe('allow');
		expect(stemmer.step4('inference')).toBe('infer');
		expect(stemmer.step4('airliner')).toBe('airlin');
		expect(stemmer.step4('gyroscopic')).toBe('gyroscop');
		expect(stemmer.step4('adjustable')).toBe('adjust');
		expect(stemmer.step4('defensible')).toBe('defens');
		expect(stemmer.step4('irritant')).toBe('irrit');
		expect(stemmer.step4('replacement')).toBe('replac');
		expect(stemmer.step4('adjustment')).toBe('adjust');
		expect(stemmer.step4('dependent')).toBe('depend');
		expect(stemmer.step4('adoption')).toBe('adopt');
		expect(stemmer.step4('homologou')).toBe('homolog');
		expect(stemmer.step4('communism')).toBe('commun');
		expect(stemmer.step4('activate')).toBe('activ');
		expect(stemmer.step4('angulariti')).toBe('angular');
		expect(stemmer.step4('homologous')).toBe('homolog');
		expect(stemmer.step4('effective')).toBe('effect');
		expect(stemmer.step4('bowdlerize')).toBe('bowdler');
	});

	it('should perform step 5a', function() {
		expect(stemmer.step5a('probate')).toBe('probat');
		expect(stemmer.step5a('rate')).toBe('rate');
		expect(stemmer.step5a('cease')).toBe('ceas');
	});

	it('should perform step5b', function() {
		expect(stemmer.step5b('controll')).toBe('control');
		expect(stemmer.step5b('roll')).toBe('roll');
	});

	it('should perform complete stemming', function() {
		expect(stemmer.stem('scoring')).toBe('score');
		expect(stemmer.stem('scored')).toBe('score');
		expect(stemmer.stem('scores')).toBe('score');
		expect(stemmer.stem('score')).toBe('score');
		expect(stemmer.stem('SCORING')).toBe('score');
		expect(stemmer.stem('SCORED')).toBe('score');
		expect(stemmer.stem('SCORES')).toBe('score');
		expect(stemmer.stem('SCORE')).toBe('score');
		expect(stemmer.stem('nationals')).toBe('nation');
		expect(stemmer.stem('doing')).toBe('do');
	});

	it('should tokenize and stem attached', function() {
		stemmer.attach();
		expect('scoring stinks'.tokenizeAndStem()).toEqual(['score', 'stink']);
		expect('SCORING STINKS'.tokenizeAndStem()).toEqual(['score', 'stink']);
	});
});
