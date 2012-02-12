
var doubleMetaphone = require('lib/natural/phonetics/double_metaphone');

describe('double metaphone', function() {
    it('should drop initial silent consonants', function() {
    	var encodings = doubleMetaphone.process('gnat', function (spy) {
			expect(spy.initialSilentConsonantSkipped).toBeTruthy();    		
    	});
    });

    it('should consider initial vowels to be A', function() {
    	var encodings = doubleMetaphone.process('England');
    	expect(encodings[0]).toMatch('^A.*');
    	expect(encodings[1]).toMatch('^A.*');
    	
		encodings = doubleMetaphone.process('astromech');
    	expect(encodings[0]).toMatch('^A.*');
    	expect(encodings[1]).toMatch('^A.*');

		encodings = doubleMetaphone.process('être');
    	expect(encodings[0]).toMatch('^A.*');
    	expect(encodings[1]).toMatch('^A.*');    

		encodings = doubleMetaphone.process('éte');
    	expect(encodings[0]).toMatch('^A.*');
    	expect(encodings[1]).toMatch('^A.*');
    });

    it('should encode case Ç (French) to S', function() {
    	var encodings = doubleMetaphone.process('leçon');
    	expect(encodings[0]).toContain('S');
    	expect(encodings[1]).toContain('S');
    });

    it('should encode FF to F', function() {
    	var encodings = doubleMetaphone.process('effect');
    	expect(encodings[0]).toMatch('F');
    	expect(encodings[0]).toNotMatch('FF');
    	expect(encodings[1]).toMatch('F');
    	expect(encodings[1]).toNotMatch('FF');
    });

    it('should keep initial Hs', function() {
    	var encodings = doubleMetaphone.process('hardly');
    	expect(encodings[0]).toMatch('^H.*');
    	expect(encodings[1]).toMatch('^H.*');
    });

    it('should keep Hs between vowels', function() {
    	var encodings = doubleMetaphone.process('ahoi');
    	expect(encodings[0]).toMatch('H');
    	expect(encodings[1]).toMatch('H');
    });

    it('should drop Hs in words if not surrounded by vowels or starting', function() {
    	var encodings = doubleMetaphone.process('charlie');
    	expect(encodings[0]).toNotMatch('H');
    	expect(encodings[1]).toNotMatch('H');
    });

    describe('helpers', function() {
    	it('should detect vowels', function() {
    		expect(doubleMetaphone.isVowel('a')).toBeTruthy();
    		expect(doubleMetaphone.isVowel('e')).toBeTruthy();
    		expect(doubleMetaphone.isVowel('b')).toBeFalsy();    		
    	});
    });    
});