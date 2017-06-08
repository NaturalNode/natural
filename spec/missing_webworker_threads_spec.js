/*
Copyright (c) 2017, Ryan Witt

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

var sinon = require('sinon');
var proxyquire = require('proxyquire');
var baseClassifier = proxyquire('lib/natural/classifiers/classifier.js', {
    'webworker-threads': null
});

describe('missing webworker-threads', function() {
    describe('classifier', function() {
        it('should refuse to classify with parallel training', function() {
            var classifier = new baseClassifier();
            classifier.addDocument(['foo', 'bar'], 'baz');
            expect(function() {
                classifier.trainParallel(2)
            }).toThrow(new Error('parallel classification requires the optional dependency webworker-threads'));
        });

        it('should refuse to classify with parallel batched training', function() {
            var classifier = new baseClassifier();
            classifier.addDocument(['foo', 'bar'], 'baz');
            classifier.addDocument(['fizz', 'buzz'], 'boo');
            expect(function() {
                classifier.trainParallelBatches({numThreads: 2, batchSize: 2});
            }).toThrow(new Error('parallel classification requires the optional dependency webworker-threads'));
        });
    });
});
