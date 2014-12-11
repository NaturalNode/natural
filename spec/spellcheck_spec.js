

var Spellcheck = require('../lib/natural/spellcheck/spellcheck.js');

describe('spellcheck', function() {
    
    describe('distance 1 corrections', function() {
        var spellcheck = new Spellcheck(['something']);
        
        it('should fix deletions', function() {
            expect(spellcheck.getCorrections('smething')).toContain('something');
        });
        it('should fix insertions', function() {
            expect(spellcheck.getCorrections('somethhing')).toContain('something');
        });
        it('should fix transpositions', function() {
            expect(spellcheck.getCorrections('somehting')).toContain('something');
        });
        it('should fix replacements', function() {
            expect(spellcheck.getCorrections('sometzing')).toContain('something');
        });
    });

    describe('distance 2 corrections', function() {
        var spellcheck = new Spellcheck(['something']);

        it('should fix a deletion then a transposition', function() {
            expect(spellcheck.getCorrections('smtehing', 2)).toContain('something');
        });
    });

    describe('edits', function() {
        var spellcheck = new Spellcheck([]);
        var edits = spellcheck.edits('ab');

        it('should compute insertions', function() {
            var insertions = ['xab', 'axb', 'abx'];
            for(var i in insertions) {
                expect(edits.indexOf(insertions[i])).toBeGreaterThan(-1);
            }
        });
        it('should compute deletions', function() {
            var deletions = ['a', 'b']; 
            for(var i in deletions) {
                expect(edits.indexOf(deletions[i])).toBeGreaterThan(-1);
            }
        });
        it('should compute transpositions', function() {
            var transpositions = ['ba']
            for(var i in transpositions) {
                expect(edits.indexOf(transpositions[i])).toBeGreaterThan(-1);
            }

        });
        it('should compute replacements', function() {
            var replacements = ['zb', 'af']
            for(var i in replacements) {
                expect(edits.indexOf(replacements[i])).toBeGreaterThan(-1);
            }
        });
    });

    describe('edits up to distance', function() {
        var spellcheck = new Spellcheck([]);

        it('should compute some distance 2 edits', function() {
            var edits = spellcheck.editsWithMaxDistance(['abc'], 2);
            var expectedEdits = [
                'a', // two deletions
                'abxzc', // two insertions
            ];
            for(var i in expectedEdits) {
                expect(edits.indexOf(expectedEdits[i])).toBeGreaterThan(-1);
            }
        });
    });

    describe('booleanSpellcheck', function() {
        var spellcheck = new Spellcheck(['cat']);

        it('should consider cat a word', function() {
            expect(spellcheck.isCorrect('cat')).toBe(true);
        });

        it('should not consider dog a word', function() {
            expect(spellcheck.isCorrect('dog')).toBe(false);
        });
    });
});
