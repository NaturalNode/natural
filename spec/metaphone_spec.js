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

var metaphone = require('../lib/natural/phonetics/metaphone');

describe('metaphone', function() {    
    it('should drop duplicate adjacent letters, except C', function() {
        expect(metaphone.dedup('dropping')).toBe('droping');
    });

    it('should not drop duplicat C', function() {
        expect(metaphone.dedup('accelerate')).toBe('accelerate');
    });

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
 
    it('should b if if words end with mb', function() {
        expect(metaphone.dropBafterMAtEnd('dumb')).toBe('dum');
    });

    it('should not drop b after m if not at end of word', function() {
        expect(metaphone.dropBafterMAtEnd('dumbo')).toBe('dumbo');
    });
    
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

    it('should transform D to J if followed by GE, GY, GI', function() {
        expect(metaphone.dTransform('abridge')).toBe('abrijge');
    });
    
    it('should transform D to T if not followed by GE, GY, GI', function() {
        expect(metaphone.dTransform('bid')).toBe('bit');
    });
    
    it('should drop G before H if not at the end or before vowell', function() {
        expect(metaphone.dropG('alight')).toBe('aliht');
        expect(metaphone.dropG('fright')).toBe('friht');        
    });
    
    it('should drop G if followed by N or NED at the end', function() {
        expect(metaphone.dropG('aligned')).toBe('alined');
        expect(metaphone.dropG('align')).toBe('alin');        
    });

    
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
    
    it('should drop H if after vowell and not before vowell', function() {
        expect(metaphone.dropH('alriht')).toBe('alrit');        
    });

    it('should not drop H if after vowell', function() {
        expect(metaphone.dropH('that')).toBe('that');        
    });

    it('should not drop H if not before vowell', function() {
        expect(metaphone.dropH('chump')).toBe('chump');        
    });
    
    it('should transform CK to K', function() {
        expect(metaphone.transformCK('check')).toBe('chek');        
    });
    
    it('should transform PH to F', function() {
        expect(metaphone.transformPH('phone')).toBe('fone');        
    });
    
    it('should transform Q to K', function() {
        expect(metaphone.transformQ('quack')).toBe('kuack');        
    });
    
    it('should transform S to X if followed by H, IO, or IA', function() {
        expect(metaphone.transformS('shack')).toBe('xhack');
        expect(metaphone.transformS('sialagogues')).toBe('xialagogues');
        expect(metaphone.transformS('asia')).toBe('axia');        
    });
    
    it('should not transform S to X if not followed by H, IO, or IA', function() {
        expect(metaphone.transformS('substance')).toBe('substance');        
    });
    
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
    
    it('should transform V to F', function() {
        expect(metaphone.transformV('vestige')).toBe('festige');        
    });
    
    it('should transform WH to W if at beginning', function() {
        expect(metaphone.transformWH('whisper')).toBe('wisper');        
    });
    
    it('should drop W if not followed by vowell', function() {
        expect(metaphone.dropW('bowl')).toBe('bol');
        expect(metaphone.dropW('warsaw')).toBe('warsa');
    });

    it('should transform X to S if at beginning', function() {
        expect(metaphone.transformX('xenophile')).toBe('senophile');
    });
    
    it('should transform X to KS if not at beginning', function() {
        expect(metaphone.transformX('admixed')).toBe('admiksed');
    });
    
    it('should drop Y of not followed by a vowell', function() {
        expect(metaphone.dropY('analyzer')).toBe('analzer');
        expect(metaphone.dropY('specify')).toBe('specif');            
    });

    it('should not drop Y of followed by a vowell', function() {
        expect(metaphone.dropY('allying')).toBe('allying');
    });
    
    it('should transform Z to S', function() {
        expect(metaphone.transformZ('blaze')).toBe('blase');
    });

    it('should drop all vowels except initial', function() {
        expect(metaphone.dropVowels('ablaze')).toBe('ablz');
        expect(metaphone.dropVowels('adamantium')).toBe('admntm');            
    });
    
    it('should do all', function() {
        expect(metaphone.process('ablaze')).toBe('ABLS');
        expect(metaphone.process('transition')).toBe('TRNSXN');
        expect(metaphone.process('astronomical')).toBe('ASTRNMKL');
        expect(metaphone.process('buzzard')).toBe('BSRT');
        expect(metaphone.process('wonderer')).toBe('WNTRR');
        expect(metaphone.process('district')).toBe('TSTRKT');
        expect(metaphone.process('hockey')).toBe('HK');
        expect(metaphone.process('capital')).toBe('KPTL');
        expect(metaphone.process('penguin')).toBe('PNKN');
        expect(metaphone.process('garbonzo')).toBe('KRBNS');
        expect(metaphone.process('lightning')).toBe('LTNNK');
        expect(metaphone.process('light')).toBe('LT');
    });

    it('should compare strings', function() {
        expect(metaphone.compare('phonetics', 'fonetix')).toBeTruthy();
        expect(metaphone.compare('phonetics', 'garbonzo')).toBeFalsy();
        expect(metaphone.compare('PHONETICS', 'fonetix')).toBeTruthy();
        expect(metaphone.compare('PHONETICS', 'garbonzo')).toBeFalsy();
    });
    
    it('should compare strings with string patch', function() {
        metaphone.attach();
        expect('phonetics'.soundsLike('fonetix')).toBeTruthy();
        expect('phonetics'.soundsLike('garbonzo')).toBeFalsy();
        expect('PHONETICS'.soundsLike('fonetix')).toBeTruthy();
        expect('PHONETICS'.soundsLike('garbonzo')).toBeFalsy();        
    });
    
    it('should return string phonetics with string patch', function() {
        metaphone.attach();
        expect('phonetics'.phonetics()).toBe('FNTKS');
        expect('PHONETICS'.phonetics()).toBe('FNTKS');        
    });
    
    it('should tokenize and return string phonetics with string patch', function() {
        metaphone.attach();
        expect('phonetics'.tokenizeAndPhoneticize()).toEqual(['FNTKS']);
        expect('phonetics garbonzo'.tokenizeAndPhoneticize()).toEqual(['FNTKS', 'KRBNS']);
        expect('phonetics garbonzo lightning'.tokenizeAndPhoneticize()).toEqual(['FNTKS', 'KRBNS', 'LTNNK']);
    });     

    it('should truncate to length specified if code exceeds', function() {
        expect(metaphone.process('phonetics', 4)).toBe('FNTK');        
    });

    it('should not truncate to length specified if code does not exceed', function() {
        expect(metaphone.process('phonetics', 8)).toBe('FNTKS');
    });    
});
