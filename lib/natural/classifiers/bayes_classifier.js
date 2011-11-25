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
     sys = require('sys'),
     Classifier = require('./classifier');

var BayesClassifier = function(stemmer) {
    Classifier.call(this, stemmer);
    this.classifications = {};
    this.classificationTotals = {};
};

sys.inherits(BayesClassifier, Classifier);

function addDocument(text, classification) {
     var tokens = this.textToTokens(text);
     var classifier = this;
     
     if(!this.classifications[classification]) {
         this.classifications[classification] = {};
         this.classificationTotals[classification] = 0;
     }
     
     tokens.forEach(function(token) {
         classifier.classificationTotals[classification]++;
     
         if(classifier.classifications[classification][token]) {
             classifier.classifications[classification][token]++;
         } else {
             classifier.classifications[classification][token] = 1;
         }
     });
}

function getClassifications(text) {
    var tokens = this.textToTokens(text);
    var classifier = this;
    var score = {};

    for(var classification in this.classifications) {
        score[classification] = 0;

        tokens.forEach(function(token) {
            var count = classifier.classifications[classification][token] || 0.1;
            score[classification] += Math.log(count / classifier.classificationTotals[classification]);
        });
    };

    return score;
}

function classify(text) {
     return this.getClassification(text).className;
}

function getClassification(text) {
    var scores = this.getClassifications(text);
    var category = {};

    for(candidate in scores) {
        if(!category["className"] || scores[candidate] > category["value"]) {
            category = {"className": candidate, "value": scores[candidate]};
        }
    }

    return category;
}

function load(filename, callback) {
     Classifier.load(filename, function(err, classifier) {
          callback(err, restore(classifier));
     });
}

function restore(classifier, stemmer) {
     classifier = Classifier.restore(classifier, stemmer);
     classifier.__proto__ = BayesClassifier.prototype;
     
     return classifier;
}

BayesClassifier.prototype.getClassifications = getClassifications;
BayesClassifier.prototype.classify = classify;
BayesClassifier.prototype.getClassification = getClassification;
BayesClassifier.prototype.addDocument = addDocument;
BayesClassifier.load = load;
BayesClassifier.restore = restore;

module.exports = BayesClassifier;
