var natural = require('natural'),
    classifier = new natural.BayesClassifier();

natural.BayesClassifier.load('classifier.json', function(err, classifier) {
	console.log(classifier.classify('did the tests pass?'));
    });
