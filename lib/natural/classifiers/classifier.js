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
sys = require('sys');

var Classifier = function(classifier, stemmer) {
    this.classifier = classifier;
    this.docs = {};
    this.features = {};
    this.stemmer = stemmer || PorterStemmer;
};

function addDocument(text, classification) {
    if(this.docs[classification] == null)
	this.docs[classification] = [];

    this.docs[classification].push(text);

    for(var i = 0; i < text.length; i++) {
	this.features[text[i]] = 1;
    }
}

function textToFeatures(observation) {
    var features = [];

    for(var feature in this.features) {
        if(observation.indexOf(feature) > -1)
            features.push(1);
        else
            features.push(0);
    }

    return features;
}

function train() {
    for(var classification in this.docs) {
	for(var i = 0; i < this.docs[classification].length; i++) {
	    var features = this.textToFeatures(this.docs[classification][i]);
	    this.classifier.addExample(features, classification);	  
	}
    }

    this.classifier.train();
}

/*
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
*/

function classify(observation) {
    return this.classifier.classify(this.textToFeatures(observation));
}

Classifier.prototype.addDocument = addDocument;
Classifier.prototype.train = train;
Classifier.prototype.classify = classify;
Classifier.prototype.textToFeatures = textToFeatures;

//Classifier.load = load;
//Classifier.restore = restore;

module.exports = Classifier;
