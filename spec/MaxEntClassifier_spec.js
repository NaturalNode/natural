/*
    Unit test of Classifier
    Copyright (C) 2018 Hugo W.L. ter Doest

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var natural = require('../lib/natural');

var SE_Element = require('./SE_Element')
var Context = natural.Context;
var Feature = natural.Feature;
var FeatureSet = natural.FeatureSet;
var Sample = natural.Sample;
var Scaler = natural.GISScaler;
var Classifier = natural.MaxEntClassifier;

var classifierFilename = "classifier.json";
var minImprovement = 0.01;
var nrIterations = 20;

var sample = null;
var featureSet = null;
var classifier = null;

describe("The MaxEnt module", function() {

  it("The Sample class creates a sample", function() {
    sample = new Sample();
    sample.addElement(new SE_Element("x", new Context("0")));
    sample.addElement(new SE_Element("x", new Context("0")));
    sample.addElement(new SE_Element("x", new Context("0")));
    sample.addElement(new SE_Element("y", new Context("0")));
    sample.addElement(new SE_Element("y", new Context("0")));
    sample.addElement(new SE_Element("y", new Context("0")));

    sample.addElement(new SE_Element("x", new Context("1")));
    sample.addElement(new SE_Element("y", new Context("1")));
    sample.addElement(new SE_Element("y", new Context("1")));
    sample.addElement(new SE_Element("y", new Context("1")));

    expect(sample.size()).toBe(10);
  });

  it("The FeatureSet class creates a feature set", function() {
    featureSet = new FeatureSet();
    sample.generateFeatures(featureSet);

    expect(featureSet.size()).toBe(2);
  });

  it("The Classifier class creates a classifier", function() {
    // Create a classifier
    classifier = new Classifier(featureSet, sample);

    expect(classifier).not.toBe(undefined);
  });

  it("Classifier does not need a correction feature", function() {

  });

  it("The classifier stops training after a specified number or iterations " +
    "or when the minimum improvement in likelihood is reached", function() {
    classifier.train(nrIterations, minImprovement);

    expect(classifier.scaler.iteration).toBeLessThan(nrIterations + 1);
    if (classifier.scaler.iteration < nrIterations) {
      expect(classifier.scaler.improvement).toBeLessThan(minImprovement);
    }
  });

  it("Save classifer to a file", function(done) {
    classifier.save(classifierFilename, function(err, c) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("Classifier saved to "  + classifierFilename);
      }
      done();
    });
  });

  var newClassifier = null;
  it("Load classifer", function(done) {
    classifier.load(classifierFilename, SE_Element, function(err, c) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("Classifier loaded from " + classifierFilename);
        newClassifier = c;
      }
      done();
    });
    if (newClassifier) {
      classifier = newClassifier;
    }
  });

  it("The classifier classifies events", function() {
    var context = new Context("0");
    console.log("Classes plus scores " + JSON.stringify(classifier.getClassifications(context)));
    var classification = classifier.classify(context);
    expect(classification).toBe("x");

    var context = new Context("1");
    console.log("Classes plus scores " + JSON.stringify(classifier.getClassifications(context)));
    var classification = classifier.classify(context);
    expect(classification).toBe("y");
  });

});
