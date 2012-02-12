
var doubleMetaphone = require('lib/natural/phonetics/double_metaphone');

describe('double metaphone', function() {
    it('should drop initial silent consonants', function() {
    	var encodings = doubleMetaphone.process('gnat', function (spy) {
			expect(spy.initialSilentConsonantSkipped).toBeTruthy();    		
    	});
    });

    describe('vowels', function() {
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
    });

    describe('B', function() {
	    it('should encode B to P', function() {
	    	var encodings = doubleMetaphone.process('berry');
	    	expect(encodings[0]).toMatch('^P.*');
	    	expect(encodings[1]).toMatch('^P.*');    	
	    });

	    it('should encode BB to P', function() {
	    	var encodings = doubleMetaphone.process('tabby');
	    	expect(encodings[0]).toContain('P');
	    	expect(encodings[0]).toNotContain('PP');
	    	expect(encodings[0]).toNotContain('PB');    	
	    	expect(encodings[1]).toContain('P');
	    	expect(encodings[1]).toNotContain('PP');
	    	expect(encodings[1]).toNotContain('PB');
	    });    	
    });

    describe('C', function() {
	    it('should encode case Ç (French) to S', function() {
	    	var encodings = doubleMetaphone.process('leçon');
	    	expect(encodings[0]).toContain('S');
	    	expect(encodings[1]).toContain('S');
	    });    	
    });

    describe('F', function() {
	    it('should encode F', function() {
	    	var encodings = doubleMetaphone.process('far');
	    	expect(encodings[0]).toContain('F');
	    	expect(encodings[1]).toContain('F');    	
	    });

	    it('should encode FF to F', function() {
	    	var encodings = doubleMetaphone.process('effect');
	    	expect(encodings[0]).toContain('F');
	    	expect(encodings[0]).toNotContain('FF');
	    	expect(encodings[1]).toContain('F');
	    	expect(encodings[1]).toNotContain('FF');
	    });    	
    });

    describe('H', function() {
	    it('should keep initial Hs', function() {
	    	var encodings = doubleMetaphone.process('hardly');
	    	expect(encodings[0]).toMatch('^H.*');
	    	expect(encodings[1]).toMatch('^H.*');
	    });

	    it('should keep Hs between vowels', function() {
	    	var encodings = doubleMetaphone.process('ahoi');
	    	expect(encodings[0]).toContain('H');
	    	expect(encodings[1]).toContain('H');
	    });

	    it('should drop Hs in words if not surrounded by vowels or starting', function() {
	    	var encodings = doubleMetaphone.process('charlie');
	    	expect(encodings[0]).toNotContain('H');
	    	expect(encodings[1]).toNotContain('H');
	    });    	
    });

    describe('N', function() {
	    it('should encode Ns', function() {
	    	var encodings = doubleMetaphone.process('natural');
	    	expect(encodings[0]).toContain('N');
	    	expect(encodings[1]).toContain('N');
	    });

	    it('should encode NN to N', function() {
	    	var encodings = doubleMetaphone.process('fanny');
	    	expect(encodings[0]).toContain('N');
	    	expect(encodings[1]).toContain('N');

	    	expect(encodings[0]).toNotContain('NN');
	    	expect(encodings[1]).toNotContain('NN');
	    });

	    it('should treat a spainish Ñ as a N', function() {
	    	var encodings = doubleMetaphone.process('jalapeño');
	    	expect(encodings[0]).toContain('N');
	    	expect(encodings[1]).toContain('N');
	    });    	
    });

    describe('P', function() {
	    it('should encode PH to F', function() {
	    	var encodings = doubleMetaphone.process('phone');
	    	expect(encodings[0]).toMatch('^F.*');
	    	expect(encodings[1]).toMatch('^F.*');
	    });

	    it('should encode P', function() {
	    	var encodings = doubleMetaphone.process('party');
	    	expect(encodings[0]).toContain('P');
	    	expect(encodings[1]).toContain('P');    	
	    });

	    it('should encode PP to P', function() {
	    	var encodings = doubleMetaphone.process('sappy');
	    	expect(encodings[0]).toContain('P');
	    	expect(encodings[0]).toNotContain('PP');
	    	expect(encodings[1]).toContain('P');    	
	    	expect(encodings[1]).toNotContain('PP');    	
	    });

	    it('should skip P before B i.e. raspberry', function() {
	    	var encodings = doubleMetaphone.process('raspberry');
	    	expect(encodings[0]).toContain('P');
	    	expect(encodings[0]).toNotContain('PP');
	    	expect(encodings[0]).toNotContain('PB');    	
	    	expect(encodings[1]).toContain('P');
	    	expect(encodings[1]).toNotContain('PP');
	    	expect(encodings[1]).toNotContain('PB');    	    	
	    });    	
    });

    describe('Q', function() {
	    it('should encode Q to K', function() {
	    	var encodings = doubleMetaphone.process('quarry');
	    	expect(encodings[0]).toContain('K');
	    	expect(encodings[1]).toContain('K');    	
	    });    	
    });

	describe('V', function() {
	    it('should encode V to F', function() {
	    	var encodings = doubleMetaphone.process('very');
	    	expect(encodings[0]).toContain('F');
	    	expect(encodings[1]).toContain('F');    	
	    });

	    it('should encode VV to F', function() {
	    	var encodings = doubleMetaphone.process('savvy');
	    	expect(encodings[0]).toContain('F');
	    	expect(encodings[0]).toNotContain('FF');
	    	expect(encodings[0]).toNotContain('FV');    	
	    	expect(encodings[1]).toContain('F');
	    	expect(encodings[1]).toNotContain('FF');
	    	expect(encodings[1]).toNotContain('FV');
	    });		
	});


    describe('helpers', function() {
    	it('should detect vowels', function() {
    		expect(doubleMetaphone.isVowel('a')).toBeTruthy();
    		expect(doubleMetaphone.isVowel('e')).toBeTruthy();
    		expect(doubleMetaphone.isVowel('b')).toBeFalsy();    		
    	});
    });    
});