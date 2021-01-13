---
layout: default
title: Bayesian and Logistic Regression Classifiers
nav_order: 6
---

# Bayesian and Logistic Regression Classifiers

Two classifiers are currently supported, [Naive Bayes](http://en.wikipedia.org/wiki/Naive_Bayes_classifier) and [logistic regression](http://en.wikipedia.org/wiki/Logistic_regression).
The following examples use the BayesClassifier class, but the
LogisticRegressionClassifier class could be substituted instead.

```javascript
var natural = require('natural');
var classifier = new natural.BayesClassifier();
```

You can train the classifier on sample text. It will use reasonable defaults to
tokenize and stem the text.

```javascript
classifier.addDocument('i am long qqqq', 'buy');
classifier.addDocument('buy the q\'s', 'buy');
classifier.addDocument('short gold', 'sell');
classifier.addDocument('sell gold', 'sell');

classifier.train();
```

Outputs "sell"

```javascript
console.log(classifier.classify('i am short silver'));
```

Outputs "buy"

```javascript
console.log(classifier.classify('i am long copper'));
```

You have access to the set of matched classes and the associated value from the classifier.

Outputs:

```javascript
[ { label: 'buy', value: 0.39999999999999997 },
  { label: 'sell', value: 0.19999999999999998 } ]
```

From this:

```javascript
console.log(classifier.getClassifications('i am long copper'));
```

The classifier can also be trained with and can classify arrays of tokens, strings, or
any mixture of the two. Arrays let you use entirely custom data with your own
tokenization/stemming, if you choose to implement it.

```javascript
classifier.addDocument(['sell', 'gold'], 'sell');
```

The training process can be monitored by subscribing to the event `trainedWithDocument` that's emitted by the classifier, this event's emitted each time a document is finished being trained against:
```javascript
    classifier.events.on('trainedWithDocument', function (obj) {
       console.log(obj);
       /* {
       *   total: 23 // There are 23 total documents being trained against
       *   index: 12 // The index/number of the document that's just been trained against
       *   doc: {...} // The document that has just been indexed
       *  }
       */
    });
```
A classifier can also be persisted and recalled so you can reuse a training

```javascript
classifier.save('classifier.json', function(err, classifier) {
    // the classifier is saved to the classifier.json file!
});
```

To recall from the classifier.json saved above:

```javascript
natural.BayesClassifier.load('classifier.json', null, function(err, classifier) {
    console.log(classifier.classify('long SUNW'));
    console.log(classifier.classify('short SUNW'));
});
```

A classifier can also be serialized and deserialized like so:

```javascript
var classifier = new natural.BayesClassifier();
classifier.addDocument(['sell', 'gold'], 'sell');
classifier.addDocument(['buy', 'silver'], 'buy');

// serialize
var raw = JSON.stringify(classifier);
// deserialize
var restoredClassifier = natural.BayesClassifier.restore(JSON.parse(raw));
console.log(restoredClassifier.classify('i should sell that'));
```

__Note:__ if using the classifier for languages other than English you may need
to pass in the stemmer to use. In fact, you can do this for any stemmer including
alternate English stemmers. The default is the `PorterStemmer`.

```javascript
const PorterStemmerRu = require('./node_modules/natural/lib/natural/stemmers/porter_stemmer_ru');
var classifier = new natural.BayesClassifier(PorterStemmerRu);
```
