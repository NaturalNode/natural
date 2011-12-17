
var natural = require('natural'),
    tokenizer = new natural.WordTokenizer();

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
    var t = h(theta, X);

    var t2_1 = Vector.Zero(m).subtract(y);
    var t2_2 =Vector.One(m).subtract(y);

    console.log(t2_1);
    console.log(t2_2);

    return 0;
}

function Logistic() {
    this.docs = {};

    this.addDocument = function(text, classification) {
	if(!this.docs[classification])
	    this.docs[classification] = [];

	this.docs[classification].push(tokenizer.tokenize(text));
    };
}

var classifier = new Logistic();
classifier.addDocument('my dog has flees', 'animal');
classifier.addDocument('my cat hates dogs', 'animal');
classifier.addDocument('my tree is dead', 'plant');
classifier.addDocument('my flower needs watered', 'plant');


var theta = $V([4, 2, 4]);
var X = $M([[2, 2, 5], [3, 4, 1]]);
var y = $V([1, 0]);

console.log(J(theta, X, y));

