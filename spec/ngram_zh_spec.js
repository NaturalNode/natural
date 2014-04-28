/*
Copyright (c) 2014, Lee Wenzhu

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

var NGramsZH = require('../lib/natural/ngrams/ngrams_zh');

describe('ngrams', function() {
    it('should bigram a string via ngrams', function() {
        expect(NGramsZH.ngrams('中文文本测试', 2)).toEqual([['中', '文'],
            ['文', '文' ], ['文', '本'], ['本','测'], ['测', '试']]);
    });
    
    it('should bigram an array via ngrams', function() {
        expect(NGramsZH.ngrams(['中','文','文','本','测','试'], 2)).toEqual([['中', '文'],
            ['文', '文' ], ['文', '本'], ['本','测'], ['测', '试']]);
    });
    
    it('should trigram a string via ngrams', function() {
        expect(NGramsZH.ngrams('中文文本测试', 3)).toEqual([['中', '文', '文'],
                ['文', '文', '本'],['文','本','测'],['本','测','试']]);
    });    
    
    it('should trigram an array via ngrams', function() {
        expect(NGramsZH.ngrams(['中','文','文','本','测','试'], 3)).toEqual([['中', '文', '文'],
                ['文', '文', '本'],['文','本','测'],['本','测','试']]);
    });    

    describe('bigrams', function() {
        it('should bigram a string', function() {
            expect(NGramsZH.bigrams('中文文本测试')).toEqual([['中', '文'],
                   ['文', '文' ], ['文', '本'], ['本','测'], ['测', '试']]);
        });
        
        it('should bigram an array', function() {
            expect(NGramsZH.bigrams(['中','文','文','本','测','试'])).toEqual([['中', '文'],
                    ['文', '文' ], ['文', '本'], ['本','测'], ['测', '试']]);
        });        
    });

    describe('trigrams', function() {
        it('should trigram a string', function() {
            expect(NGramsZH.ngrams('中文文本测试', 3)).toEqual([['中', '文', '文'],
                    ['文', '文', '本'],['文','本','测'],['本','测','试']]);
        });
        
        it('should bigram an array', function() {
            expect(NGramsZH.ngrams(['中','文','文','本','测','试'], 3)).toEqual([['中', '文', '文'],
                    ['文', '文', '本'],['文','本','测'],['本','测','试']]);
        });        
    });

    it('should bigram a string with start and end symbols', function() {
        expect(NGramsZH.ngrams('中文测试', 2, "[start]", "[end]")).toEqual([
            ['[start]', '中'], 
            ['中', '文'],
            ['文', '测' ], 
            ['测', '试'], 
            ['试', '[end]']
        ]);
    });

    it('should bigram a string with start symbols only', function() {
        expect(NGramsZH.ngrams('中文测试', 2, "[start]")).toEqual([
            ['[start]', '中'], 
            ['中', '文'],
            ['文', '测' ], 
            ['测', '试'] 
        ]);
    });


    it('should bigram a string with end symbols only', function() {
        expect(NGramsZH.ngrams('中文测试', 2, null, "[end]")).toEqual([
            ['中', '文'],
            ['文', '测' ], 
            ['测', '试'], 
            ['试', '[end]']
        ]);
    });

    it('should trigram a string with start and end symbols', function() {
        expect(NGramsZH.ngrams('中文测试', 3, '[start]', '[end]')).toEqual([
            ['[start]', '[start]', '中'],
            ['[start]', '中', '文'], 
            ['中', '文', '测'],
            ['文', '测', '试'], 
            ['测', '试', '[end]'],
            ['试', '[end]', '[end]']
        ]);
    });

    it('should 4-gram a string with start and end symbols', function() {
        expect(NGramsZH.ngrams('中文测试', 4, '[start]', '[end]')).toEqual([
            ['[start]', '[start]', '[start]', '中'],
            ['[start]', '[start]', '中', '文'],
            ['[start]', '中', '文', '测'],
            ['中', '文', '测', '试'], 
            ['文', '测', '试', '[end]'],
            ['测', '试', '[end]', '[end]'],
            ['试', '[end]', '[end]', '[end]']
        ]);
    });
    
});
