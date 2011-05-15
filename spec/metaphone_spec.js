
var metaphone = require('lib/natural/metaphone');

describe('metaphone', function() {
    describe('step 1', function() {
        it('should drop duplicate adjacent letters, except C', function() {
            expect(metaphone.dedup('dropping')).toBe('droping');
        });
    
        it('should not drop duplicat C', function() {
            expect(metaphone.dedup('accelerate')).toBe('accelerate');
        });
    });
    
    describe('step 2', function() {
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
    });
    
    describe('step 3', function() {
        it('should b if if words end with mb', function() {
            expect(metaphone.dropBafterMAtEnd('dumb')).toBe('dum');
        });
    
        it('should not drop b after m if not at end of word', function() {
            expect(metaphone.dropBafterMAtEnd('dumbo')).toBe('dumbo');
        });
    });
    
    describe('step 4', function() {    
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
    });
    
    describe('step 5', function() {    
        it('should transform D to J if followed by GE, GY, GI', function() {
            expect(metaphone.dTransform('abridge')).toBe('abrijge');
        });
        
        it('should transform D to T if not followed by GE, GY, GI', function() {
            expect(metaphone.dTransform('bid')).toBe('bit');
        });
    });
    
    describe('step 6', function() {    
        it('should drop G before H if not at the end or before vowell', function() {
            expect(metaphone.dropG('alight')).toBe('aliht');
        });
        
        it('should drop G if followed by N or NED at the end', function() {
            expect(metaphone.dropG('aligned')).toBe('alined');
            expect(metaphone.dropG('align')).toBe('alin');        
        });
    });
    
    describe('step 7', function() {    
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
    });
    
    describe('step 8', function() {    
        it('should drop H if after vowell and not before vowell', function() {
            expect(metaphone.dropH('alriht')).toBe('alrit');        
        });
    
        it('should not drop H if after vowell', function() {
            expect(metaphone.dropH('that')).toBe('that');        
        });
    
        it('should not drop H if not before vowell', function() {
            expect(metaphone.dropH('chump')).toBe('chump');        
        });
    });
    
    describe('step 9', function() {    
        it('should transform CK to K', function() {
            expect(metaphone.transformCK('check')).toBe('chek');        
        });
    });
    
    describe('step 10', function() {    
        it('should transform PH to F', function() {
            expect(metaphone.transformPH('phone')).toBe('fone');        
        });
    });
    
    describe('step 11', function() {    
        it('should transform Q to K', function() {
            expect(metaphone.transformQ('quack')).toBe('kuack');        
        });
    });
    
    describe('step 12', function() {    
        it('should transform S to X if followed by H, IO, or IA', function() {
            expect(metaphone.transformS('shack')).toBe('xhack');
            expect(metaphone.transformS('sialagogues')).toBe('xialagogues');
            expect(metaphone.transformS('asia')).toBe('axia');        
        });
        
        it('should not transform S to X if not followed by H, IO, or IA', function() {
            expect(metaphone.transformS('substance')).toBe('substance');        
        });
    });
    
    describe('step 13', function() {    
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
    
    describe('step 14', function() {    
        it('should transform V to F', function() {
            expect(metaphone.transformV('vestige')).toBe('festige');        
        });
    });
    
    describe('step 15', function() {    
        it('should transform WH to W if at beginning', function() {
            expect(metaphone.transformWH('whisper')).toBe('wisper');        
        });
        
        it('should drop W if not followed by vowell', function() {
            expect(metaphone.dropW('bowl')).toBe('bol');
            expect(metaphone.dropW('warsaw')).toBe('warsa');
        });
    });
    
});
