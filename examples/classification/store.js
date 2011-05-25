var natural = require('natural'),
    classifier = new natural.BayesClassifier();

classifier.train([
		  {classification: 'software', text: ['unit', 'test']},
		  {classification: 'software', text: ['bug', 'program']},
		  {classification: 'hardware', text: ['drive', 'capacity']},
		  {classification: 'hardware', text: ['power', 'supply']}
		  ]);

classifier.save('classifier.json', function(err, classifier) {
	// the classifier is saved to the classifier.json file!
    });

