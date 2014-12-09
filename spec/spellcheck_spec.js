

var Spellcheck = require('../lib/natural/spellcheck/spellcheck.js');

describe('spellcheck', function() {
    
    /*
    describe('handled mistakes', function() {
        var spellcheck = new Spellcheck();
        
        it('should fix deletions', function() {

        });
        it('should fix insertions', function() {

        });
        it('should fix transpositions', function() {

        });
        it('should fix replacements', function() {

        });
    });
    */

/*
    describe('special cases', function() {
        var spellcheck = new Spellcheck('cat');

        it('should not change a correct word', function() {

        });
    });
    */

    describe('edits', function() {
        var spellcheck = new Spellcheck([]);
        var edits = spellcheck.edits('ab');

        it('should compute insertions', function () {
            var insertions = ['xab', 'axb', 'abx'];
            for(var i in insertions) {
                expect(edits.indexOf(insertions[i])).toBeGreaterThan(-1);
            }
        });
        it('should compute deletions', function () {
            var deletions = ['a', 'b']; 
            for(var i in deletions) {
                expect(edits.indexOf(deletions[i])).toBeGreaterThan(-1);
            }
        });
        it('should compute transpositions', function () {
            var transpositions = ['ba']
            for(var i in transpositions) {
                expect(edits.indexOf(transpositions[i])).toBeGreaterThan(-1);
            }

        });
        it('should compute replacements', function () {
            var replacements = ['zb', 'af']
            for(var i in replacements) {
                expect(edits.indexOf(replacements[i])).toBeGreaterThan(-1);
            }
        });
    });

    describe('edits up to distance', function() {
        var spellcheck = new Spellcheck([]);

        it('should compute some distance 2 edits', function () {
            var edits = spellcheck.editsUpToDistance(['abc'], 2);
            //TODO: More distance 2 edits
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
