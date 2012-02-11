
var doubleMetaphone = require('lib/natural/phonetics/double_metaphone');

describe('double metaphone', function() {
    it('should drop initial silent consonants', function() {
    	doubleMetaphone.process('gnat', function (spy) {
			expect(spy.initialSilentConsonantSkipped).toBeTruthy();    		
    	});
    });
});