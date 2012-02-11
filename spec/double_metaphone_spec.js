
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
    });

    it('should encode case Ç (French) to S', function() {
    	var encodings = doubleMetaphone.process('leçon');
    	expect(encodings[0]).toContain('S');
    	expect(encodings[1]).toContain('S');
    });
});