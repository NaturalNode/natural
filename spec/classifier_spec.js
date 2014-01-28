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

var natural = require('lib/natural');

describe('classifier', function () {
    describe('events emitters', function () {

        it('should be emitted when a document is classified', function () {
            var classifier = new natural.BayesClassifier();
            classifier.addDocument('i fixed the box', 'computing');
            classifier.addDocument('i write code', 'computing');
            classifier.addDocument('nasty script code', 'computing');
            classifier.addDocument('write a book', 'literature');
            classifier.addDocument('read a book', 'literature');
            classifier.addDocument('study the books', 'literature');

            classifier.train();

            var pushedEvents = [];

            function eventRegister(obj) {
                pushedEvents.push(obj);
            };

            function assertEventResults() {
                teardown();
                expect(pushedEvents[0].index).toBe(0);
                expect(pushedEvents[0].total).toBe(6);
                expect(pushedEvents.length).toBe(6);
            }

            function teardown() {
                classifier.events.removeListener('trainedWithDocument', eventRegister);
                classifier.events.removeListener('doneTraining', assertEventResults);
            }

            classifier.events.on('trainedWithDocument', eventRegister);
            classifier.events.on('doneTraining', assertEventResults);
        });

        it('should emit events only on an instance of Classifier', function () {
            var classifier = new natural.BayesClassifier();
            classifier.addDocument('i fixed the box', 'computing');
            classifier.addDocument('i write code', 'computing');
            classifier.addDocument('write a book', 'literature');
            classifier.addDocument('study the books', 'literature');

            var pushedEvents = [];

            function eventRegister(obj) {
                pushedEvents.push(obj);
            };

            function assertEventResults() {
                teardown();
                expect(pushedEvents.length).toBe(0);
            }

            function teardown() {
                classifier.events.removeListener('trainedWithDocument', eventRegister);
                classifier.events.removeListener('doneTraining', assertEventResults);
            }

            var classifier2 = new natural.BayesClassifier();
            classifier2.events.on('trainedWithDocument', eventRegister);
            classifier.events.on('doneTraining', assertEventResults);
            classifier.train();
        });

    });
});
