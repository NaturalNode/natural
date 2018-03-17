/*
    Classifier class that provides functionality for training and
    classification
    Copyright (C) 2017 Hugo W.L. ter Doest

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

var fs = require('fs');

var Context = require('./Context');
var Element = require('./Element');
var Sample = require('./Sample');
var Scaler = require('./GISScaler');
var FeatureSet = require('./FeatureSet');

function Classifier(features, sample) {
  if (features) {
    this.features = features;
  }
  else {
    this.features = new featureSet();
  }
  this.features = features;
  if (sample) {
    this.sample = sample;
  }
  else {
    this.sample = new Sample();
  }
}

// Loads a classifier from file.
// Caveat: feature functions are generated from the sample elements. You need
// to create your own specialisation of the Element class that can generate
// your own specific feature functions
Classifier.prototype.load = function(filename, elementClass, callback) {
  fs.readFile(filename, 'utf8', function(err, data) {

    if(!err) {
        classifierData = JSON.parse(data);
        var sample = new Sample();
        classifierData.sample.elements.forEach(function(elementData) {
          var elt = new elementClass(elementData.a, new Context(elementData.b.data));
          sample.addElement(elt);
        });
        var featureSet = new FeatureSet();
        sample.generateFeatures(featureSet);
        var classifier = new Classifier(featureSet, sample);
        callback(err, classifier);
    }
    else {
      if(callback) {
        callback(err);
      }
    }
  });
};

Classifier.prototype.save = function(filename, callback) {
  var data = JSON.stringify(this, null, 2);
  var classifier = this;
  fs.writeFile(filename, data, 'utf8', function(err) {
      if(callback) {
          callback(err, err ? null : classifier);
      }
  });
};

Classifier.prototype.addElement = function(x) {
  this.sample.addElement(x);
};

Classifier.prototype.addDocument = function(context, classification, elementClass) {
  Classifier.prototype.addElement(new elementClass(classification, context));
};

Classifier.prototype.train = function(maxIterations, minImprovement, approxExpectation) {
  this.scaler = new Scaler(this.features, this.sample);
  this.p = this.scaler.run(maxIterations, minImprovement, approxExpectation);
};

Classifier.prototype.getClassifications = function(b) {
  var scores = [];
  var that = this;
  this.sample.getClasses().forEach(function(a) {
    var x = new Element(a, b);
    scores.push({
      "label": a,
      "value": that.p.calculateAPriori(x)
    });
  });
  return scores;
};

Classifier.prototype.classify = function(b) {
  var scores = this.getClassifications(b);
  // Sort the scores in an array
  scores.sort(function(a, b) {
    return b.value - a.value;
  });
  // Check if the classifier discriminates
  var min = scores[scores.length - 1].value;
  var max = scores[0].value;
  if (min === max) {
      return "";
  }
  else {
    // Return the highest scoring classes
    return scores[0].label;
  }
};

module.exports = Classifier;
