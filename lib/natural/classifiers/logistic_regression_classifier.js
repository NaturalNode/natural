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

var sylvester = require('sylvester'),
Matrix = sylvester.Matrix,
Vector = sylvester.Vector;

function sigmoid(z) {
    return 1 / (1 + Math.pow(Math.E, (0 - z)));
}

function h(theta, X) {
    return X.x(theta).map(sigmoid);
}

function J(theta, X, y) {
    var m = X.rows();
    var _h = h(theta, X);

    var ones = Vector.One(m);
    var j_one = Vector.Zero(m).subtract(y).elementMultiply(_h.log());
    var j_zero = ones.subtract(y).elementMultiply(ones.subtract(_h).log());

    return (1 / m) * j_one.subtract(j_zero).sum();
}

function descendGradient(theta, X, y) {
    var maxIt = 500;
    var last;
    var current;
    var m = X.rows();
    var alpha = 3;
    var alphaFound = false;

    X = Matrix.One(m, 1).augment(X);
    theta = theta.augment([0]);

    while(!alphaFound) {
	var i = 0;
	last = null;

	while(true) {
	    var _h = h(theta, X);	
	    theta = theta.subtract(X.transpose().x(_h.subtract(y)).x(1 / m).x(alpha));
	    current = J(theta, X, y);
	    
	    i++;
	    
	    if(last) {
		if(current < last)
		    alphaFound = true;
		else
		    break;
		
		if(last - current < 0.0001)
		    break;
	    }

	    if(i >= maxIt)
		throw 'unable to find minimum';

	    last = current;
	}

	alpha /= 3;
    }
    
    return theta.chomp(1);
}

var LogisticRegressionClassifier = function(stemmer) {
    Classifier.call(this, stemmer);
    this.docs = {};
    this.features = [];
    this.classifications = [];
    this.m = 0;
};

sys.inherits(LogisticRegressionClassifier, Classifier);

function extractFeatures() {
    this.features = [];

    for(var classification in this.docs) {
	for(var i = 0; i < this.docs[classification].length; i++) {
	    var doc = this.docs[classification][i];

	    for(var j = 0; j < doc.length; j++) {
		var word = doc[j];
		if(this.features.indexOf(word) < 0)
		    this.features.push(word);
	    }
	}
    }
}

function  extractDocumentFeatures(doc) {
    var x = this.features.map(function() { return 0});

    for(var j = 0; j < doc.length; j++) {
	var word = doc[j];

	if(this.features.indexOf(word) > 0)
	    x[this.features.indexOf(word)]++;
    }

    return x;
}

function  createY() {
    var Y = [];

    for(var i = 0; i < this.m; i++) {
	var y = [];

	for(var classification in this.docs)
	    y.push(0);

	Y.push(y);
    }

    return Y;
}

function  computeThetas(X, Y) {
    for(var i = 0; i < this.classifications.length; i++) {
	var theta = this.features.map(function() { return 0; });
	this.theta.push(descendGradient($V(theta), X, Y.column(i + 1)));
    }
}

function train(docs) {
    if(docs)
	Classifier.prototype.train.call(this, docs);
    
    this.extractFeatures();
    this.theta = [];

    var X = [];
    var Y = this.createY();
    var d = 0, c = 0;

    for(var classification in this.docs) {
	for(var i = 0; i < this.docs[classification].length; i++) {
	    var doc = this.docs[classification][i];
	    var x = this.extractDocumentFeatures(doc);
	    
	    X.push(x);
	    Y[d][c] = 1;
	    d++;
	}

	c++;
    }

    this.computeThetas($M(X), $M(Y));
}

function addDocument(text, classification) {    
    if(!this.docs[classification]) {
	this.docs[classification] = [];
	this.classifications.push(classification);
    }

    this.docs[classification].push(this.textToTokens(text));
    this.m++;
}

function classify(text) {
    var tokens = this.stemmer.tokenizeAndStem(text);
    var results = [];
    var maxIndex = -1;
    var maxClass = 0;

    for(var i = 0; i < this.theta.length; i++) {
	var result = sigmoid($V(
	    this.extractDocumentFeatures(tokens)).dot(this.theta[i]));
    
	if(result > maxClass) {
	    maxIndex = i;
	    maxClass = result;
	}
    }

    return this.classifications[maxIndex];
}

function load(filename, callback) {
     Classifier.load(filename, function(err, classifier) {
          callback(err, LogisticRegressionClassifier.restore(classifier));
     });
}

function restore(classifier, stemmer) {
    classifier = Classifier.restore(classifier, stemmer);
    classifier.__proto__ = LogisticRegressionClassifier.prototype;

    return classifier;
}

LogisticRegressionClassifier.prototype.classify = classify;
LogisticRegressionClassifier.prototype.addDocument = addDocument;
LogisticRegressionClassifier.prototype.load = load;
LogisticRegressionClassifier.prototype.restore = restore;
LogisticRegressionClassifier.prototype.train = train;
LogisticRegressionClassifier.prototype.extractFeatures = extractFeatures;
LogisticRegressionClassifier.prototype.extractDocumentFeatures = extractDocumentFeatures;
LogisticRegressionClassifier.prototype.createY = createY;
LogisticRegressionClassifier.prototype.computeThetas = computeThetas;

LogisticRegressionClassifier.load = load;
LogisticRegressionClassifier.restore = restore;

module.exports = LogisticRegressionClassifier;
