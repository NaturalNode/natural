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

var natural = new require('lib/natural'),
    LogisticRegressionClassifier = natural.LogisticRegressionClassifier;

describe('logistic regression', function() {
    it('should classify with individually trained documents', function() {
        var logistic = new LogisticRegressionClassifier();
        
        logistic.addDocument('i have a computer', 'IT');
        logistic.addDocument('this is a phone', 'IT');
        logistic.addDocument('computers suck', 'IT');
        logistic.addDocument('buy this stock', 'finance');
        logistic.addDocument('sell gold', 'finance');
        logistic.addDocument('short silver', 'finance');
        logistic.addDocument('he kicked a field goal', 'sports');
        logistic.addDocument('that team lost', 'sports');
        logistic.addDocument('great footwork, great speed', 'sports');
        
        logistic.train();
        
        expect(logistic.classify('i hate this computer')).toBe('IT');
        expect(logistic.classify('i love gold')).toBe('finance');
        expect(logistic.classify('i kicked things')).toBe('sports');
    });
    
    it('should classify with some examples added in groups', function() {
        var logistic = new LogisticRegressionClassifier();
        
        logistic.addDocument('buy this stock', 'finance');
        logistic.addDocument('sell gold', 'finance');
        logistic.addDocument('short silver', 'finance');
        logistic.addDocument('he kicked a field goal', 'sports');
        logistic.addDocument('that team lost', 'sports');
        logistic.addDocument('great footwork, great speed', 'sports');
        
        logistic.train([{classification: 'IT', text: 'i have a computer'},
            {classification: 'IT', text: 'this is a phone'},
            {classification: 'IT', text: 'computers suck'}]);
        
        expect(logistic.classify('i hate this computer')).toBe('IT');
        expect(logistic.classify('i love gold')).toBe('finance');
        expect(logistic.classify('i kicked things')).toBe('sports');
    });
    
    it('should classify with examples added in groups', function() {
        var logistic = new LogisticRegressionClassifier();
        
        logistic.train([{classification: 'IT', text: 'i have a computer'},
            {classification: 'IT', text: 'this is a phone'},
            {classification: 'IT', text: 'computers suck'},
            {classification: 'finance', text: 'buy this stock'},
            {classification: 'finance', text: 'sell gold'},
            {classification: 'finance', text: 'short silver'},
            {classification: 'sports', text: 'he kicked a field goal'},
            {classification: 'sports', text: 'that team lost'},
            {classification: 'sports', text: 'great footwork, great speed'}]);
        
        expect(logistic.classify('i hate this computer')).toBe('IT');
        expect(logistic.classify('i love gold')).toBe('finance');
        expect(logistic.classify('i kicked things')).toBe('sports');
    });
    
    describe('persistence', function() {
        it('should save a classifier', function() {
            var classifier = new natural.LogisticRegressionClassifier();
            
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
            natural.LogisticRegressionClassifier.load('classifier.json', function(err, classifier) {
                expect(classifier.classify('long SUNW')).toBe('buy');
                expect(classifier.classify('short SUNW')).toBe('sell');
                asyncSpecDone();
            });
            asyncSpecWait();
        });
        
        it('should deserialize a classifier', function() {
          var classifier = new natural.LogisticRegressionClassifier();

          classifier.train([{classification: 'buy', text: ['long', 'qqqq']},
	    {classification: 'buy', text: "buy the q's"},
 	    {classification: 'sell', text: "short gold"},
	    {classification: 'sell', text: ['sell', 'gold']}
	  ]);
         
	  var raw = JSON.stringify(classifier);
	  var restoredClassifier = natural.LogisticRegressionClassifier.restore(raw);
	  expect(restoredClassifier.classify('i am short silver')).toBe('sell');
	  expect(restoredClassifier.classify('i am long silver')).toBe('buy');
        });
    });    
});
