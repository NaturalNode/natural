/*
Copyright (c) 2019, Ian Read, Rob Ellis, Chris Umbel, Hugo W.L. ter Doest

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
const _ = require("underscore")._;

const SkipNGrams = require('../lib/natural/ngrams/skip_ngrams');

var text = require('spec/test_data/NYT-20150205-picassos-granddaughter-plans-to-sell-art-worrying-the-market.json');

//const text = '1 2 3 4 5';
const n = 3
const k = 2

/*k = number of spaces to skip
const output = 1 2 3
1 2 4
1 2 5
1 3 4*/


const expectedTrigrams = [
    ['these', 'are', 'some'],
    ['these', 'some', 'words'],
    ['these', 'are', 'words'],
    ['are', 'some', 'words']];

const expectedBigrams = [
    ['these', 'are'],
    ['these', 'some'],
    ['these', 'words'],
    ['are', 'some' ],
    ['are', 'words' ],
    ['some', 'words']];

describe('ngrams', function() {
    
    it('should bigram a string via ngrams', function() {
        const computed = SkipNGrams.skip_ngrams('these are some words', 2, k);
        expect(computed).toEqual(expectedBigrams);
    });

    it('should trigram a string via ngrams', function() {
        const computed = SkipNGrams.skip_ngrams('these are some words', 3, k);
        expect(computed).toEqual(expectedTrigrams);
    });    
    
    it('should trigram an array via ngrams', function() {
        expect(SkipNGrams.skip_ngrams(['these', 'are', 'some', 'words'], 3, k)).toEqual(expectedTrigrams);
    });
    
    describe('bigrams', function() {
        it('should bigram a string', function() {
            expect(SkipNGrams.skip_bigrams('these are some words', 2)).toEqual(expectedBigrams);
        });
        
        it('should bigram an array', function() {
            expect(SkipNGrams.skip_bigrams(['these', 'are', 'some', 'words'], 2)).toEqual(expectedBigrams);
        });        
    });

    describe('trigrams', function() {
        it('should trigram a string', function() {
            const computed = SkipNGrams.skip_trigrams('these are some words', 2);
            expect(computed).toEqual(expectedTrigrams);
        });
        
        it('should trigram an array', function() {
            const computed = SkipNGrams.skip_trigrams(['these', 'are', 'some', 'words'], 2);
            expect(computed).toEqual(expectedTrigrams);
        });        
    });

    // New Start/End Symbols Feature
    it('should bigram a string with start and end symbols', function() {
        const computed = SkipNGrams.skip_ngrams('these are some words', 2, k, "[start]", "[end]");
        const expected = [
            ['[start]', 'are'], 
            ['[start]', 'some'], 
            ['[start]', 'these'], 
            ['these', 'are'],
            ['these', 'some'],
            ['these', 'words'],
            ['are', 'some' ], 
            ['are', 'words' ], 
            ['some', 'words'], 
            ['are', '[end]'],
            ['some', '[end]'], 
            ['words', '[end]'],
        ];
        expect(computed).toEqual(expected);
    });

    it('should bigram a string with no start symbols only', function() {
        const computed = SkipNGrams.skip_ngrams('1 2 3 4 5', 2, k);
        const expected = [
            ['1', '2'], 
            ['1', '3'],
            ['1', '4'], 
            ['2', '3'],
            ['2', '4'],
            ['2', '5'],
            ['3', '4'],
            ['3', '5'],
            ['4', '5']
        ];
        expect(computed).toEqual(expected);
    });

    it('should bigram a string with start symbols only', function() {
        const computed = SkipNGrams.skip_ngrams('these are some words', 2, k, "[start]");
        const expected = [ 
            [ '[start]', 'are' ],
            [ '[start]', 'some' ],
            [ '[start]', 'these' ],
            [ 'these', 'are' ],
            [ 'these', 'some' ],
            [ 'these', 'words' ],
            [ 'are', 'some' ],
            [ 'are', 'words' ],
            [ 'some', 'words' ] ];    
        expect(computed).toEqual(expected);
    });

    it('should bigram a string with end symbols only', function() {
        const computed = SkipNGrams.skip_ngrams('these are some words', 2, k, null, "[end]");
        expect(computed).toEqual([
            ['these', 'are'],
            ['these', 'some'],
            ['these', 'words'],
            ['are', 'some' ], 
            ['are', 'words' ], 
            ['some', 'words'],
            ['are', '[end]' ],
            ['some', '[end]'],
            ['words', '[end]']
        ]);
    });
    it('should trigram a string with start and end symbols', function() {
        const computed = SkipNGrams.skip_ngrams('a b c d', 3, k, '[start]', '[end]')
        const expected = [
            ['[start]', '[start]', 'a'],
            ['[start]', '[start]', 'b'],
            ['[start]', '[start]', 'c'],
            ['[start]', 'a', 'b'], 
            ['[start]', 'a', 'c'], 
            ['[start]', 'a', 'd'],
            ['[start]', 'b', 'c'], 
            ['[start]', 'c', 'd'],
            ['a', 'b', 'c'],
            ['a', 'c', 'd'],
            ['a', 'b', 'd'],
            ['b', 'c', 'd'],
            [ 'a', 'd', '[end]' ],
            [ 'b', 'd', '[end]' ],
            [ 'a', 'b', '[end]' ],
            [ 'b', 'c', '[end]' ],
            [ 'c', 'd', '[end]' ],
            [ 'b', '[end]', '[end]' ],
            [ 'c', '[end]', '[end]' ],
            [ 'd', '[end]', '[end]' ]
        ];
        expect(computed).toEqual(expected);
    });

    it('should 4-gram a string with start and end symbols', function() {
        const computed = SkipNGrams.skip_ngrams('these are some words', 4, k, '[start]', '[end]');
        const expected = [
            [ '[start]', '[start]', '[start]', 'are' ],
            [ '[start]', '[start]', '[start]', 'some' ],
            [ '[start]', '[start]', '[start]', 'these' ],
            [ '[start]', '[start]', 'are', 'some' ],
            [ '[start]', '[start]', 'some', 'words' ],
            [ '[start]', '[start]', 'these', 'are' ],
            [ '[start]', '[start]', 'these', 'some' ],
            [ '[start]', '[start]', 'these', 'words' ],
            [ '[start]', 'are', 'some', 'words' ],
            [ '[start]', 'some', 'words', '[end]' ],
            [ '[start]', 'these', 'are', '[end]' ],
            [ '[start]', 'these', 'are', 'some' ],
            [ '[start]', 'these', 'are', 'words' ],
            [ '[start]', 'these', 'some', 'words' ],
            [ '[start]', 'these', 'words', '[end]' ],
            [ 'these', 'are', 'some', 'words' ],
            [ 'these', 'some', 'words', '[end]' ],
            [ 'these', 'are', 'words', '[end]' ],
            [ 'these', 'are', 'some', '[end]' ],
            [ 'are', 'some', 'words', '[end]' ],
            [ 'these', 'words', '[end]', '[end]' ],
            [ 'are', 'words', '[end]', '[end]' ],
            [ 'these', 'are', '[end]', '[end]' ],
            [ 'are', 'some', '[end]', '[end]' ],
            [ 'some', 'words', '[end]', '[end]' ],
            [ 'are', '[end]', '[end]', '[end]' ],
            [ 'some', '[end]', '[end]', '[end]' ],
            [ 'words', '[end]', '[end]', '[end]' ] ];
        expect(computed).toEqual(expected);
    });

    it('should 4-gram a string with start and end symbols, skip = 1', function() {

        const computed = SkipNGrams.skip_ngrams('a b c', 4, 1, '[start]', '[end]');
        const expected = [
            ['[start]', '[start]', '[start]', 'a'],
            ['[start]', '[start]', '[start]', 'b'],
            ['[start]', '[start]', 'a', 'b'],
            ['[start]', '[start]', 'a', 'c'],
            ['[start]', '[start]', 'b', 'c'],
            ['[start]', 'a', 'b', '[end]'],
            ['[start]', 'a', 'b', 'c'],
            ['[start]', 'a', 'c', '[end]'],
            ['[start]', 'b', 'c', '[end]'],
            ['a', 'b', 'c', '[end]'],
            ['a', 'c', '[end]', '[end]'],
            ['a', 'b', '[end]', '[end]' ],
            ['b', 'c', '[end]', '[end]'],
            ['b', '[end]', '[end]', '[end]'],
            ['c', '[end]', '[end]', '[end]']
        ];
        expect(computed).toEqual(expected);
    });
    it('should 3-gram a string with start and end symbols, skip = 3', function() {

        const computed = SkipNGrams.skip_ngrams('a b c', 3, 3, '[start]', '[end]');
        const expected = [
            [ '[start]', '[end]', '[end]' ],
            [ '[start]', '[start]', '[end]' ],
            [ '[start]', '[start]', 'a' ],
            [ '[start]', '[start]', 'b' ],
            [ '[start]', '[start]', 'c' ],
            [ '[start]', 'a', '[end]' ],
            [ '[start]', 'a', 'b' ],
            [ '[start]', 'a', 'c' ],
            [ '[start]', 'b', 'c' ],
            [ '[start]', 'c', '[end]' ],
            [ 'a', 'b', 'c' ],
            [ 'a', 'c', '[end]' ],
            [ 'a', 'b', '[end]' ],
            [ 'b', 'c', '[end]' ],
            [ 'a', '[end]', '[end]' ],
            [ 'b', '[end]', '[end]' ],
            [ 'c', '[end]', '[end]' ] ];
        expect(computed).toEqual(expected);
    });

    it('should 4-gram a string with start and end symbols, skip = 4', function() {

        const computed = SkipNGrams.skip_ngrams('a b c d e f g', 4, 4, '[start]', '[end]');
        const expected = [ [ '[start]', '[start]', '[start]', 'a' ],
        [ '[start]', '[start]', '[start]', 'b' ],
        [ '[start]', '[start]', '[start]', 'c' ],
        [ '[start]', '[start]', '[start]', 'd' ],
        [ '[start]', '[start]', '[start]', 'e' ],
        [ '[start]', '[start]', 'a', 'b' ],
        [ '[start]', '[start]', 'a', 'c' ],
        [ '[start]', '[start]', 'a', 'd' ],
        [ '[start]', '[start]', 'a', 'e' ],
        [ '[start]', '[start]', 'a', 'f' ],
        [ '[start]', '[start]', 'b', 'c' ],
        [ '[start]', '[start]', 'c', 'd' ],
        [ '[start]', '[start]', 'd', 'e' ],
        [ '[start]', '[start]', 'e', 'f' ],
        [ '[start]', 'a', 'b', 'c' ],
        [ '[start]', 'a', 'b', 'd' ],
        [ '[start]', 'a', 'b', 'e' ],
        [ '[start]', 'a', 'b', 'f' ],
        [ '[start]', 'a', 'b', 'g' ],
        [ '[start]', 'a', 'c', 'd' ],
        [ '[start]', 'a', 'd', 'e' ],
        [ '[start]', 'a', 'e', 'f' ],
        [ '[start]', 'a', 'f', 'g' ],
        [ '[start]', 'b', 'c', 'd' ],
        [ '[start]', 'c', 'd', 'e' ],
        [ '[start]', 'd', 'e', 'f' ],
        [ '[start]', 'e', 'f', 'g' ],
        [ 'a', 'b', 'c', 'd' ],
        [ 'a', 'c', 'd', 'e' ],
        [ 'a', 'd', 'e', 'f' ],
        [ 'a', 'e', 'f', 'g' ],
        [ 'a', 'b', 'd', 'e' ],
        [ 'a', 'b', 'e', 'f' ],
        [ 'a', 'b', 'f', 'g' ],
        [ 'a', 'b', 'c', 'e' ],
        [ 'a', 'b', 'c', 'f' ],
        [ 'a', 'b', 'c', 'g' ],
        [ 'b', 'c', 'd', 'e' ],
        [ 'b', 'd', 'e', 'f' ],
        [ 'b', 'e', 'f', 'g' ],
        [ 'b', 'c', 'e', 'f' ],
        [ 'b', 'c', 'f', 'g' ],
        [ 'b', 'c', 'd', 'f' ],
        [ 'b', 'c', 'd', 'g' ],
        [ 'c', 'd', 'e', 'f' ],
        [ 'c', 'e', 'f', 'g' ],
        [ 'c', 'd', 'f', 'g' ],
        [ 'c', 'd', 'e', 'g' ],
        [ 'd', 'e', 'f', 'g' ],
        [ 'a', 'f', 'g', '[end]' ],
        [ 'b', 'f', 'g', '[end]' ],
        [ 'c', 'f', 'g', '[end]' ],
        [ 'd', 'f', 'g', '[end]' ],
        [ 'a', 'b', 'g', '[end]' ],
        [ 'b', 'c', 'g', '[end]' ],
        [ 'c', 'd', 'g', '[end]' ],
        [ 'd', 'e', 'g', '[end]' ],
        [ 'a', 'b', 'c', '[end]' ],
        [ 'b', 'c', 'd', '[end]' ],
        [ 'c', 'd', 'e', '[end]' ],
        [ 'd', 'e', 'f', '[end]' ],
        [ 'e', 'f', 'g', '[end]' ],
        [ 'b', 'g', '[end]', '[end]' ],
        [ 'c', 'g', '[end]', '[end]' ],
        [ 'd', 'g', '[end]', '[end]' ],
        [ 'e', 'g', '[end]', '[end]' ],
        [ 'b', 'c', '[end]', '[end]' ],
        [ 'c', 'd', '[end]', '[end]' ],
        [ 'd', 'e', '[end]', '[end]' ],
        [ 'e', 'f', '[end]', '[end]' ],
        [ 'f', 'g', '[end]', '[end]' ],
        [ 'c', '[end]', '[end]', '[end]' ],
        [ 'd', '[end]', '[end]', '[end]' ],
        [ 'e', '[end]', '[end]', '[end]' ],
        [ 'f', '[end]', '[end]', '[end]' ],
        [ 'g', '[end]', '[end]', '[end]' ] ];
        expect(computed).toEqual(expected);
    });
 
    it('should use french tokenizer', function(){
        var T = require('../lib/natural/tokenizers/aggressive_tokenizer_fr');
        var t = new T();
        SkipNGrams.setTokenizer(t);
        expect(SkipNGrams.skip_ngrams('Un Éléphant rouge', 2, k)).toEqual([['Un', 'Éléphant'],
            ['Un', 'rouge'],
            ['Éléphant', 'rouge' ]]);
    });

    it('should trigram a string via ngrams including statistics', function() {
        var T = require('../lib/natural/tokenizers/aggressive_tokenizer');
        var t = new T();
        SkipNGrams.setTokenizer(t);
        text.sentences.forEach(sentence => {
            var result = SkipNGrams.skip_ngrams(sentence, 3, k, null, null, true);
            var nrNgrams = 0;

            Object.keys(result.Nr).forEach(function (f) {
                nrNgrams += result.Nr[f] * f;
            });
            expect(nrNgrams).toEqual(result.numberOfNgrams);
        });
    });

});
