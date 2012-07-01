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

var NGrams = require('lib/natural/ngrams/ngrams');

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
});
