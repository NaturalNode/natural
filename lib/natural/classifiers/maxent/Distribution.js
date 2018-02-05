/*
    Distribution class for probability distributions
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

var Element = require('./Element');

function Distribution(alpha, featureSet, sample) {
  this.alpha = alpha;
  this.featureSet = featureSet;
  this.sample = sample;
}

// Returns the distribution as a string that can be stored for later usage
Distribution.prototype.toString = function() {

}

Distribution.prototype.weight = function(x) {
  var product = 1;
  var that = this;

  this.alpha.forEach(function(alpha_j, j) {
    product *= Math.pow(alpha_j, that.featureSet.getFeatures()[j].apply(x));
  });
  return product;
};

Distribution.prototype.calculateAPriori = function(x) {
  if (!this.aPriorisBeforeNormalisation[x.toString()]) {
    this.aPriorisBeforeNormalisation[x.toString()] = this.weight(x);
  }
  return this.aPriorisBeforeNormalisation[x.toString()];// / this.aPrioriNormalisationConstant;
};

// Memoize a priori probabilities of sample elements
Distribution.prototype.prepareWeights = function() {
  this.aPriorisBeforeNormalisation = {};
  this.aPrioriNormalisationConstant = 0;
  var sum = 0;
  var that = this;
  this.sample.elements.forEach(function(x) {
    that.aPriorisBeforeNormalisation[x.toString()] = that.weight(x);
    sum += that.aPriorisBeforeNormalisation[x.toString()];
  });
  this.aPrioriNormalisationConstant = sum;
};

Distribution.prototype.calculateAPosteriori = function(x) {
  if (!this.aPriorisBeforeNormalisation[x.toString()]) {
    this.aPriorisBeforeNormalisation[x.toString()] = this.weight(x);
  }
  if (!this.aPosterioriNormalisationConstants[x.b.toString()]) {
    this.aPosterioriNormalisationConstants[x.b.toString()] = this.aPosterioriNormalisation(x.b);
  }
  return this.aPriorisBeforeNormalisation[x] / this.aPosterioriNormalisationConstants[x.b.toString()];
};

Distribution.prototype.aPosterioriNormalisation = function(b) {
  var sum = 0;

  var that = this;
  this.sample.getClasses().forEach(function(a) {
    sum += that.weight(new Element(a, b));
  });

  return(sum);
};

// Memoize a posteriori probabilities of sample elements
Distribution.prototype.prepareAPosterioris = function() {
  this.aPosterioriNormalisationConstants = {};

  var contextSeen = {};
  var that = this;
  this.sample.elements.forEach(function(sampleElement) {
    var context = sampleElement.b;
    if (!contextSeen[context]) {
      contextSeen[context] = true;
      that.aPosterioriNormalisationConstants[context] =
        that.aPosterioriNormalisation(context);
    }
  });
};

// Memoize all probabilities of sample elements
Distribution.prototype.prepare = function() {
  this.prepareWeights();
  //console.log("Weights prepared");
  this.prepareAPosterioris();
};

// Relative entropy between observered distribution and derived distribution
Distribution.prototype.KullbackLieblerDistance = function() {
  var sum = 0;
  var that = this;
  this.sample.elements.forEach(function(x) {
    sum += that.sample.observedProbability(x) * Math.log(that.sample.observedProbability(x) / that.calculateAPriori(x));
  });
  return sum;
};

Distribution.prototype.logLikelihood = function() {
  var sum = 0;
  var that = this;
  this.sample.elements.forEach(function(x) {
    sum += that.sample.observedProbability(x) * Math.log(that.calculateAPriori(x));
  });
  return sum;
};

Distribution.prototype.entropy = function() {
  var sum = 0;
  var that = this;
  this.sample.elements.forEach(function(x) {
    var p = that.calculateAPriori(x);
    sum += p * Math.log(p);
  });
  return sum;
};

Distribution.prototype.checkSum = function() {
  var sum = 0;
  var that = this;
  this.sample.elements.forEach(function(x) {
      sum += that.calculateAPriori(x);
  });
  //console.log("Distribution.checkSum is " + sum);
  return sum;
}

module.exports = Distribution;
