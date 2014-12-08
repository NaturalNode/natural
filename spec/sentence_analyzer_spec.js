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

var SentenceAnalyzer = require('../lib/natural/analyzers/sentence_analyzer');

describe('sentence analyzer', function() {
    it('should load', function() {
        var analyzer = new SentenceAnalyzer(null, function() { });
    });

    it('should determine PP and SP, given a POS', function () {
        var sentenceTags = [
            {token: 'The', pos: 'DT'},
            {token: 'angry', pos: 'JJ'},
            {token: 'bear', pos: 'NN'},
            {token: 'chased', pos: 'VB'},
            {token: 'the', pos: 'DT'},
            {token: 'frightened', pos: 'JJ'},
            {token: 'little', pos: 'JJ'},
            {token: 'squirrel', pos: 'NN'}
        ];
        new SentenceAnalyzer({tags: sentenceTags}, function (analyzer) {
            analyzer.part(function (part) {
                var posTags = part.posObj.tags;
                for (var tagNum = 0; tagNum < posTags.length; tagNum++) {
                    if (posTags.token === 'angry') {
                        expect(posTags[tagNum].spos).toEqual('SP');
                    } else if (posTags.token === 'squirrel') {
                        expect(posTags[tagNum].spos).toEqual('PP');
                    }
                }
                expect(analyzer.subjectToString().trim()).toEqual('The angry bear');
                expect(analyzer.predicateToString().trim()).toEqual('chased the frightened little squirrel');
                expect(analyzer.toString().trim()).toEqual('The angry bear chased the frightened little squirrel');
                expect(analyzer.implicitYou()).toEqual(false);
            });
        });
    });

    it('should determine PP and SP given a POS that begins with a verb', function () {
        var sentenceTags = [
            {token: 'Vote', pos: 'VB'},
            {token: 'for', pos: 'IN'},
            {token: 'me', pos: 'PRP'}
        ];
        new SentenceAnalyzer({tags: sentenceTags}, function (analyzer) {
            analyzer.part(function (part) {
                var posTags = part.posObj.tags;
                for (var tagNum = 0; tagNum < posTags.length; tagNum++) {
                    if (posTags.token === 'Vote') {
                        expect(posTags[tagNum].spos).toEqual('PP');
                    } else if (posTags.token === 'me') {
                        expect(posTags[tagNum].spos).toEqual('PP');
                    }
                }
                // Adds implicit you.
                var lastTagNum = posTags.length - 1;
                expect(posTags[lastTagNum].token).toEqual('You');
                expect(posTags[lastTagNum].pos).toEqual('PRP');
                expect(posTags[lastTagNum].added).toEqual(true);
                expect(analyzer.implicitYou()).toEqual(true);
            });
        });
    });

    it('should look for EX before VB', function () {
        var sentenceTags = [
            {token: 'There', pos: 'EX'},
            {token: 'is', pos: 'VB'},
            {token: 'a', pos: 'DT'},
            {token: 'house', pos: 'NN'},
            {token: 'in', pos: 'IN'},
            {token: 'the', pos: 'DT'},
            {token: 'valley', pos: 'DT'}
        ];
        new SentenceAnalyzer({tags: sentenceTags}, function (analyzer) {
            analyzer.part(function (part) {
                var posTags = part.posObj.tags;
                for (var tagNum = 0; tagNum < posTags.length; tagNum++) {
                    if (posTags.token === 'There') {
                        expect(posTags.spos.toEqual('SP'));
                    } else if (posTags.token === 'is') {
                        expect(postTags.spost.toEqual('PP'));
                    }
                }
                expect(analyzer.subjectToString().trim()).toEqual('There is a house');
                expect(analyzer.predicateToString().trim()).toEqual('');
                expect(analyzer.toString().trim()).toEqual('There is a house in the valley');
                expect(analyzer.implicitYou()).toEqual(false);
            });
        });
    });
});
