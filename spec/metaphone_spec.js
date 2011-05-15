
var metaphone = require('lib/natural/metaphone');

describe('metaphone', function() {
    it('should drop duplicate adjacent letters, except C', function() {
        expect(metaphone.dedup('dropping')).toBe('droping');
    });

    it('should not drop duplicat C', function() {
        expect(metaphone.dedup('accelerate')).toBe('accelerate');
    });
    
    it('should drop some initial letters', function() {
        expect(metaphone.dropInitialLetters('knuth')).toBe('nuth');
    });
    
    it('should not drop other initial letters', function() {
        expect(metaphone.dropInitialLetters('garbage')).toBe('garbage');
    });
});
