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

var util = require('util'),
    Classifier = require('./classifier'),
    ApparatusBayesClassifier = require('apparatus').BayesClassifier;

var BayesClassifier = function(stemmer, smoothing) {
    var abc = new ApparatusBayesClassifier();
    if (smoothing && isFinite(smoothing)) {
        abc = new ApparatusBayesClassifier(smoothing);
    }
    Classifier.call(this, abc, stemmer);
};

util.inherits(BayesClassifier, Classifier);

function restore(classifier, stemmer) {
    classifier = Classifier.restore(classifier, stemmer);
    classifier.__proto__ = BayesClassifier.prototype;
    classifier.classifier = ApparatusBayesClassifier.restore(classifier.classifier);

    return classifier;
}

function load(filename, stemmer, callback) {
    Classifier.load(filename, function(err, classifier) {
        if (err) {
            callback(err);
        }
        else {
            callback(err, restore(classifier, stemmer));
        }
    });
}

BayesClassifier.restore = restore;
BayesClassifier.load = load;

module.exports = BayesClassifier;
