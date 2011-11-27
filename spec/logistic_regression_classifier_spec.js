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
        var classifier = new LogisticRegressionClassifier();
        
        classifier.addDocument(['have', 'computer'], 'IT');
        classifier.addDocument(['have', 'phone'], 'IT');
        classifier.addDocument(['computer', 'suck'], 'IT');
        classifier.addDocument(['field', 'goal'], 'sports');
        classifier.addDocument(['score', 'goal'], 'sports');
        classifier.addDocument(['great', 'speed'], 'sports');
        
        classifier.train();
        
        expect(classifier.classify(['hate', 'computer'])).toBe('IT');
        expect(classifier.classify(['score', 'please'])).toBe('sports');
    });

    it('should classify with arrays', function() {
        var classifier = new natural.LogisticRegressionClassifier();
        classifier.addDocument('i fixed the box', 'computing');
        classifier.addDocument('i write code', 'computing');
        classifier.addDocument('nasty script code', 'computing');
        classifier.addDocument('write a book', 'literature');
        classifier.addDocument('read a book', 'literature');
        classifier.addDocument('study the books', 'literature');

        classifier.train();

        expect(classifier.classify('a bug in the code')).toBe('computing');
        expect(classifier.classify('read all the books')).toBe('literature');
    });
});
