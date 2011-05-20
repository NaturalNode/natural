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

var natural = new require('lib/natural');

describe('bayes classifier', function() {
    describe('classifier', function() {
        var classifier = new natural.BayesClassifier();
        
        classifier.train([{classification: 'buy', text: ['long', 'qqqq']},
                      {classification: 'buy', text: "buy the q's"},
                      {classification: 'sell', text: "short gold"},
                      {classification: 'sell', text: ['sell', 'gold']}
        ]);
    
        it('should classify strings', function() {
            expect(classifier.classify('i am short silver')).toBe('sell');
            expect(classifier.classify('i am long silver')).toBe('buy');        
        });
            
        it('should classify arrays', function() {
            expect(classifier.classify(['short', 'silver'])).toBe('sell');
            expect(classifier.classify(['long', 'silver'])).toBe('buy');        
        });
        
        it('should perform successive training', function() {
            var classifier = new natural.BayesClassifier();
            
            classifier.train([{classification: 'buy', text: ['long', 'qqqq']},
                          {classification: 'buy', text: "buy the q's"}
            ]);

            classifier.train([{classification: 'sell', text: "short gold"},
                          {classification: 'sell', text: ['sell', 'gold']}
            ]);

            expect(classifier.classify('i am short silver')).toBe('sell');
            expect(classifier.classify('i am long silver')).toBe('buy');        
        });        
    });
    
    describe('persistence', function() {
        it('should save a classifier', function() {
            var classifier = new natural.BayesClassifier();
            
            classifier.train([{classification: 'buy', text: ['long', 'qqqq']},
                          {classification: 'buy', text: "buy the q's"},
                          {classification: 'sell', text: "short gold"},
                          {classification: 'sell', text: ['sell', 'gold']}
            ]);
            
            classifier.save('classifier.json', function(err, classifier) {
                    var fs = require('fs');                    
                    expect(fs.statSync('classifier.json')).toBeDefined();                    
                    asyncSpecDone();
                });
            asyncSpecWait();
        });
        
        it('should load a saved classifier', function() {
            natural.BayesClassifier.load('classifier.json', function(err, classifier) {
                expect(classifier.classify('long SUNW')).toBe('buy');
                expect(classifier.classify('short SUNW')).toBe('sell');
                asyncSpecDone();
            });
            asyncSpecWait();
        });
    });
});
