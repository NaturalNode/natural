var natural = require('natural'),
    classifier = new natural.BayesClassifier();

classifier.train([
		  {classification: 'software', text: "my unit-tests failed."},
		  {classification: 'software', text: "tried the program, but it was buggy."},
		  {classification: 'hardware', text: "the drive has a 2TB capacity."},
		  {classification: 'hardware', text: "i need a new power supply."}
		  ]);

console.log(classifier.classify('did the tests pass?'));
console.log(classifier.classify('did you buy a new drive?'));
