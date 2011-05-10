
stemmer = require('lib/porter_stemmer');

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
});
