/*
Copyright (c) 2011, Rob Ellis, Chris Umbel

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

var NGrams = require('../lib/natural/ngrams/ngrams');

describe('ngrams', function() {
    it('should bigram a string via ngrams', function() {
        expect(NGrams.ngrams('these are some words', 2)).toEqual([['these', 'are'],
            ['are', 'some' ], ['some', 'words']]);
    });
    
    it('should bigram an array via ngrams', function() {
        expect(NGrams.ngrams(['these', 'are', 'some', 'words'], 2)).toEqual([['these', 'are'],
            ['are', 'some' ], ['some', 'words']]);   
    });
    
    it('should trigram a string via ngrams', function() {
        expect(NGrams.ngrams('these are some words', 3)).toEqual([['these', 'are', 'some'],
                ['are', 'some', 'words']]);
    });    
    
    it('should trigram an array via ngrams', function() {
        expect(NGrams.ngrams(['these', 'are', 'some', 'words'], 3)).toEqual([['these', 'are', 'some'],
                ['are', 'some', 'words']]);
    });    

    describe('bigrams', function() {
        it('should bigram a string', function() {
            expect(NGrams.bigrams('these are some words')).toEqual([['these', 'are'],
                ['are', 'some' ], ['some', 'words']]);
        });
        
        it('should bigram an array', function() {
            expect(NGrams.bigrams(['these', 'are', 'some', 'words'])).toEqual([['these', 'are'],
                ['are', 'some' ], ['some', 'words']]);   
        });        
    });

    describe('trigrams', function() {
        it('should bigram a string', function() {
            expect(NGrams.trigrams('these are some words')).toEqual([['these', 'are', 'some'],
                ['are', 'some', 'words']]);
        });
        
        it('should bigram an array', function() {
            expect(NGrams.trigrams(['these', 'are', 'some', 'words'])).toEqual([['these', 'are', 'some'],
                ['are', 'some', 'words']]);
        });        
    });

    // New Start/End Symbols Feature
    it('should bigram a string with start and end symbols', function() {
        expect(NGrams.ngrams('these are some words', 2, "[start]", "[end]")).toEqual([
            ['[start]', 'these'], 
            ['these', 'are'],
            ['are', 'some' ], 
            ['some', 'words'], 
            ['words', '[end]']
        ]);
    });

    it('should bigram a string with start symbols only', function() {
        expect(NGrams.ngrams('these are some words', 2, "[start]")).toEqual([
            ['[start]', 'these'], 
            ['these', 'are'],
            ['are', 'some' ], 
            ['some', 'words']
        ]);
    });


    it('should bigram a string with end symbols only', function() {
        expect(NGrams.ngrams('these are some words', 2, null, "[end]")).toEqual([
            ['these', 'are'],
            ['are', 'some' ], 
            ['some', 'words'],
            ['words', '[end]']
        ]);
    });

    it('should trigram a string with start and end symbols', function() {
        expect(NGrams.ngrams('these are some words', 3, '[start]', '[end]')).toEqual([
            ['[start]', '[start]', 'these'],
            ['[start]', 'these', 'are'], 
            ['these', 'are', 'some'],
            ['are', 'some', 'words'], 
            ['some', 'words', '[end]'],
            ['words', '[end]', '[end]']
        ]);
    });

    it('should 4-gram a string with start and end symbols', function() {
        expect(NGrams.ngrams('these are some words', 4, '[start]', '[end]')).toEqual([
            ['[start]', '[start]', '[start]', 'these'],
            ['[start]', '[start]', 'these', 'are'],
            ['[start]', 'these', 'are', 'some'],
            ['these', 'are', 'some', 'words'], 
            ['are', 'some', 'words', '[end]'],
            ['some', 'words', '[end]', '[end]'],
            ['words', '[end]', '[end]', '[end]']
        ]);
    });
    
    it('should use french tokenizer', function(){
        var T = require('../lib/natural/tokenizers/aggressive_tokenizer_fr');
        var t = new T();
        NGrams.setTokenizer(t);
        expect(NGrams.ngrams('Un Éléphant rouge', 2)).toEqual([['Un', 'Éléphant'],
            ['Éléphant', 'rouge' ]]);
    });
});
