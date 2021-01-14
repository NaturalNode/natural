---
layout: default
title: Maximum Entropy Classifier
nav_order: 7
---

# Maximum Entropy Classifier
This module provides a classifier based on maximum entropy modelling. The central idea to maximum entropy modelling is to estimate a probability distribution that that has maximum entropy subject to the evidence that is available. This means that the distribution follows the data it has "seen" but does not make any assumptions beyond that.

The module is not specific to natural language processing, or any other application domain. There are little requirements with regard to the data structure it can be trained on. For training, it needs a sample that consists of elements. These elements have two parts:
* part a: the class of the element
* part b: the context of the element
The classifier will, once trained, return the most probable class for a particular context.

We start with an explanation of samples and elements. You have to create your own specialisation of the Element class. Your element class should implement the generateFeatures method for inferring feature functions from the sample.

## Samples and elements
{:toc}
Elements and contexts are created as follows:

```javascript
var MyElement = require('MyElementClass');
var Context = require('Context');
var Sample = require('Sample');

var x = new MyElementClass("x", new Context("0"));
// A sample is created from an array of elements
var sample = new Sample();
sample.addElement(x);
```
A class is a string, contexts may be as complex as you want (as long as it can be serialised).

A sample can be saved to and loaded from a file:
```javascript
sample.save('sample.json', function(error, sample) {
  ...
});
```
A sample can be read from a file as follows.

```javascript
sample.load('sample.json', MyElementClass, function(err, sample) {

});
```
You have to pass the element class to the load method so that the right element objects can be created from the data.

## Features and feature sets
Features are functions that map elements to zero or one. Features are defined as follows:
```javascript
var Feature = require('Feature');

function f(x) {
  if (x.b === "0") {
    return 1;
  }
  return 0;
}

var feature = new Feature(f, name, parameters);
```
<code>name</code> is a string for the name of the feature function, <code>parameters</code> is an array of strings for the parameters of the feature function. The combination of name and parameters should uniquely distinguish features from each other. Features that are added to a feature set are tested for uniqueness using these properties.

A feature set is created like this
```javascript
var FeatureSet = require('FeatureSet');

var set = new FeatureSet();
set.addFeature(f, "f", ["0"]);
```

In most cases you will generate feature functions using closures. For instance, when you generate feature functions in a loop that iterates through an array
```javascript
var FeatureSet = require('FeatureSet');
var Feature = require('Feature');

var listOfTags = ['NN', 'DET', 'PREP', 'ADJ'];
var featureSet = new FeatureSet();

listofTags.forEach(function(tag) {
  function isTag(x) {
    if (x.b.data.tag === tag) {
      return 1
    }
    return 0;
  }
  featureSet.addFeature(new Feature(isTag, "isTag", [tag]));
});
```
In this example you create feature functions that each have a different value for <code>tag</code> in their closure.

## Setting up and training the classifier
A classifier needs the following parameter:
* Classes: an array of classes (strings)
* Features: an array of feature functions
* Sample: a sample of elements for training the classifier

A classifier can be created as follows:
```javascript
var Classifier = require('Classifier');
var classifier = new Classifier(classes, featureSet, sample);
```
And it starts training with:
```javascript
var maxIterations = 100;
var minImprovement = .01;
var p = classifier.train(maxIterations, minImprovement);
```
Training is finished when either <code>maxIterations</code> is reached or the improvement in likelihood (of the sample) becomes smaller than <code>minImprovement</code>. It returns a probability distribution that can be stored and retrieved for later usage:
```javascript
classifier.save('classifier.json', function(err, c) {
  if (err) {
    console.log(err);
  }
  else {
    // Continue using the classifier
  }
});

classifier.load('classifier.json', function(err, c) {
  if (err) {
    console.log(err);
  }
  else {
    // Use the classifier
  }
});
```

The training algorithm is based on Generalised Iterative Scaling.

## Applying the classifier
The classifier can be used to classify contexts in two ways. To get the probabilities for all classes:
```javascript
var classifications = classifier.getClassifications(context);
classifications.forEach(function(classPlusProbability) {
  console.log('Class ' + classPlusProbability.label + ' has score ' + classPlusProbability.value);
});
```
This returns a map from classes to probabilities.
To get the highest scoring class:
```javascript
var class = classifier.classify(context);
console.log(class);
```

## Simple example of maximum entropy modelling
A  test is added to the spec folder based on simple elements that have contexts that are either "0" or "1", and classes are "x" and "y".
```javascript
{
  "a": "x",
  "b": {
    "data": "0"
  }
}
```
In the SE_Element class that inherits from Element, the method generateFeatures is implemented. It creates a feature function that tests for context "0".

After setting up your own element class, the classifier can be created and trained.

## Application to POS tagging
A more elaborate example of maximum entropy modelling is provided for part of speech tagging. The following steps are taken to create a classifier and apply it to a test set:
* A new element class POS_Element is created that has a word window and a tag window around the word to be tagged.
* From the Brown corpus a sample is generated consisting of POS elements.
* Feature functions are generated from the sample.
* A classifier is created and trained.
* The classifier is applied to a test set. Results are compared to a simple lexicon-based tagger.

## References
* Adwait RatnaParkhi, Maximum Entropy Models For Natural Language Ambiguity Resolution, University of Pennsylvania, 1998, URL: http://repository.upenn.edu/cgi/viewcontent.cgi?article=1061&context=ircs_reports
* Darroch, J.N.; Ratcliff, D. (1972). Generalized iterative scaling for log-linear models, The Annals of Mathematical Statistics, Institute of Mathematical Statistics, 43 (5): 1470–1480.
