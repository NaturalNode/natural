
var metaphone = require('lib/natural/metaphone');

describe('metaphone', function() {
    // step 1
    it('should drop duplicate adjacent letters, except C', function() {
        expect(metaphone.dedup('dropping')).toBe('droping');
    });

    it('should not drop duplicat C', function() {
        expect(metaphone.dedup('accelerate')).toBe('accelerate');
    });
    
    // step 2
    it('should drop some initial letters', function() {
        expect(metaphone.dropInitialLetters('knuth')).toBe('nuth');
        expect(metaphone.dropInitialLetters('gnat')).toBe('nat');
        expect(metaphone.dropInitialLetters('aegis')).toBe('egis');
        expect(metaphone.dropInitialLetters('pneumatic')).toBe('neumatic');
        expect(metaphone.dropInitialLetters('wrack')).toBe('rack');
    });
    
    it('should not drop other initial letters', function() {
        expect(metaphone.dropInitialLetters('garbage')).toBe('garbage');
    });
    
    // step 3
    it('should b if if words end with mb', function() {
        expect(metaphone.dropBafterMAtEnd('dumb')).toBe('dum');
    });

    it('should not drop b after m if not at end of word', function() {
        expect(metaphone.dropBafterMAtEnd('dumbo')).toBe('dumbo');
    });
    
    // step 4 
    it('should replace CH to X', function() {
        expect(metaphone.cTransform('change')).toBe('xhange');
    });
    
    it('should not replace CH to X if part of SCH', function() {
        expect(metaphone.cTransform('discharger')).toBe('diskharger');
    });
    
    it('should replace CIA to X', function() {
        expect(metaphone.cTransform('aesthetician')).toBe('aesthetixian');
    });
    
    it('C should become S if followed by I, E, or Y', function() {
        expect(metaphone.cTransform('cieling')).toBe('sieling');        
    });
    
    it('should transform other C\'s to K', function() {
        expect(metaphone.cTransform('cuss')).toBe('kuss');        
    });
    
    // step 5
    it('should transform D to J if followed by GE, GY, GI', function() {
        expect(metaphone.dTransform('abridge')).toBe('abrijge');
    });
    
    it('should transform D to T if not followed by GE, GY, GI', function() {
        expect(metaphone.dTransform('bid')).toBe('bit');
    });
    
    // step 6
    it('should drop G before H if not at the end or before vowell', function() {
        expect(metaphone.dropG('alight')).toBe('aliht');
    });
    
    it('should drop G if followed by N or NED at the end', function() {
        expect(metaphone.dropG('aligned')).toBe('alined');
        expect(metaphone.dropG('align')).toBe('alin');        
    });
    
    // step 7
    it('should transform G to J if followed by I, E or Y and not preceeded by G', function() {
        expect(metaphone.transformG('age')).toBe('aje');
        expect(metaphone.transformG('gin')).toBe('jin');        
    });
    
    it('should transform G to K', function() {
        expect(metaphone.transformG('august')).toBe('aukust');        
    });
    
    it('should reduce GG to G before turning to K', function() {
        expect(metaphone.transformG('aggrade')).toBe('akrade');        
    });
    
    // step 8 
    it('should drop H if after vowell and not before vowell', function() {
        expect(metaphone.dropH('alriht')).toBe('alrit');        
    });

    it('should not drop H if after vowell', function() {
        expect(metaphone.dropH('that')).toBe('that');        
    });

    it('should not drop H if not before vowell', function() {
        expect(metaphone.dropH('chump')).toBe('chump');        
    });
    
    // step 9     
    it('should transform CK to K', function() {
        expect(metaphone.transformCK('check')).toBe('chek');        
    });
    
    // step 10
    it('should transform PH to F', function() {
        expect(metaphone.transformPH('phone')).toBe('fone');        
    });
    
    // step 11
    it('should transform Q to K', function() {
        expect(metaphone.transformQ('quack')).toBe('kuack');        
    });
    
    // step 12
    it('should transform S to X if followed by H, IO, or IA', function() {
        expect(metaphone.transformS('shack')).toBe('xhack');
        expect(metaphone.transformS('sialagogues')).toBe('xialagogues');
        expect(metaphone.transformS('asia')).toBe('axia');        
    });
    
    it('should not transform S to X if not followed by H, IO, or IA', function() {
        expect(metaphone.transformS('substance')).toBe('substance');        
    });
    
    // step 13
    it('should transform T to X if followed by IA or IO', function() {
        expect(metaphone.transformT('dementia')).toBe('demenxia');
        expect(metaphone.transformT('abbreviation')).toBe('abbreviaxion');        
    });
    
    it('should transform TH to 0', function() {
        expect(metaphone.transformT('that')).toBe('0at');        
    });

    it('should drop T if followed by CH', function() {
        expect(metaphone.dropT('backstitch')).toBe('backstich');        
    });
});
