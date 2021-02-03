/*
    GISScaler class that finds parameters of features
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

'use strict'

const Feature = require('./Feature')
const Distribution = require('./Distribution')

// classes is an array of classes
// features is an array of feature functions
function GISScaler (featureSet, sample) {
  this.featureSet = featureSet
  this.sample = sample
}

// Returns true if a correction feature is necessary
GISScaler.prototype.calculateMaxSumOfFeatures = function () {
  const that = this
  this.C = 0
  this.featureSums = {}
  const listOfSumValues = []

  // Since feature functions are derived from the sample
  // we can use the sample to calculate the max sum
  // We look at each sample element only once
  this.sample.elements.forEach(function (x) {
    if (!that.featureSums[x.toString()]) {
      let sum = 0
      that.featureSet.getFeatures().forEach(function (f) {
        sum += f.apply(x)
      })
      if (sum > that.C) {
        that.C = sum
      }
      that.featureSums[x.toString()] = sum
      listOfSumValues.push(sum)
    }
  })
  // console.log("GISScaler:calculateMaxSumOfFeatures:maxSum is " + this.C);

  // Check if a correction feature is necessary
  listOfSumValues.sort(function (a, b) {
    return a - b
  })
  return (listOfSumValues[0] !== listOfSumValues[listOfSumValues.length - 1])
}

GISScaler.prototype.addCorrectionFeature = function () {
  if (this.calculateMaxSumOfFeatures()) {
    // console.log("GISScaler:addCorrectionFeature:C is " + this.C);
    const that = this

    function f (x) {
      if (that.featureSums[x.toString()] !== undefined) {
        return that.C - that.featureSums[x.toString()]
      }
      return 0
    }

    const correctionFeature = new Feature(f, 'Correction feature', [])
    // console.log("GISScaler:addCorrectionFeature:correctionFeature " + JSON.stringify(correctionFeature));
    this.featureSet.addFeature(correctionFeature)
  } else {
    // console.log("Correction feature not needed");
  }
}

// This is the Generalised Iterative Scaling algorithm
// It ends if the improvement in likelihood of the distribution does not
// improve more than minImprovement or if the maximum number of iterations is
// reached.
GISScaler.prototype.run = function (maxIterations, minImprovement) {
  this.iteration = 0
  this.improvement = 0

  this.addCorrectionFeature()
  // Build up the distribution p
  const alpha = new Array(this.featureSet.size())
  for (let i = 0; i < alpha.length; i++) {
    alpha[i] = 1
  }
  const p = new Distribution(alpha, this.featureSet, this.sample)
  // console.log("Distribution created");
  p.prepare()
  // console.log("Distribution prepared");
  let KLDistance = p.KullbackLieblerDistance()

  const newAlpha = new Array(this.featureSet.size())
  let observedExpectation = 0
  let expectationApprox = 0
  do {
    // console.log("Iteration " + this.iteration + " - Log likelihood of sample: " + likelihood + " - Entropy: " + p.entropy());
    for (let i = 0; i < this.featureSet.size(); i++) {
      observedExpectation = this.featureSet.getFeatures()[i].observedExpectation(this.sample)
      expectationApprox = this.featureSet.getFeatures()[i].expectationApprox(p, this.sample)
      // console.log("Iteration " + this.iteration + " - Feature " + i);
      newAlpha[i] = p.alpha[i] * Math.pow(observedExpectation / expectationApprox, 1 / this.C)

      // console.log("GISScaler.run: old alpha[" + i + "]: " + p.alpha[i]);
      // console.log("GISScaler.run: new alpha[" + i + "]: " + newAlpha[i]);
    }

    // Make the newly calculated parameters current parameters
    newAlpha.forEach(function (newAlphaj, j) {
      p.alpha[j] = newAlphaj
    })
    // Recalculate a priori and a posteriori probabilities
    p.prepare()

    this.iteration++
    const newKLDistance = p.KullbackLieblerDistance()
    this.improvement = KLDistance - newKLDistance
    // console.log("Iteration " + this.iteration + " - Old likelihood: " + likelihood + " - New likelihood: " + newLikelihood);
    // console.log("Iteration " + this.iteration + " - Old KL: " + KLDistance + " - New KL: " + newKLDistance);

    KLDistance = newKLDistance
  } while ((this.iteration < maxIterations) && (this.improvement > minImprovement))
  // } while (iteration < maxIterations);
  /*
  var that = this;
  this.featureSet.getFeatures().forEach(function(f, j) {
    console.log("Observed expectation of feature " + j + ": " + f.observedExpectation(that.sample) +
      " - Expection of feature according to p: " + f.expectationApprox(p, that.sample));
  });
  */

  return p
}

module.exports = GISScaler
