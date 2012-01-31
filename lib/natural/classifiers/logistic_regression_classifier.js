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

var PorterStemmer = require('../stemmers/porter_stemmer'),
util = require('util'),
Classifier = require('./classifier'),
ApparatusLogisticRegressionClassifier = require('apparatus').LogisticRegressionClassifier;

var LogisticRegressionClassifier = function(stemmer) {
    Classifier.call(this, new ApparatusLogisticRegressionClassifier(), stemmer);
};

util.inherits(LogisticRegressionClassifier, Classifier);

function restore(classifier, stemmer) {
    classifier = Classifier.restore(classifier, stemmer);
    classifier.__proto__ = LogisticRegressionClassifier.prototype;
    classifier.classifier = ApparatusLogisticRegressionClassifier.restore(classifier.classifier);

    return classifier;
}

function load(filename, stemmer, callback) {
    Classifier.load(filename, function(err, classifier) {
        callback(err, restore(classifier, stemmer));
    });
}

function train() {
    // we need to reset the traning state because logistic regression
    // needs its matricies to have their widths synced, etc.
    this.lastAdded = 0;
    this.classifier = new ApparatusLogisticRegressionClassifier();
    Classifier.prototype.train.call(this);
}

LogisticRegressionClassifier.prototype.train = train;
LogisticRegressionClassifier.restore = restore;
LogisticRegressionClassifier.load = load;

module.exports = LogisticRegressionClassifier;
