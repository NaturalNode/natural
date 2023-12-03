/*
GISScaler class that finds parameters of features
Copyright (C) 2017, 2023 Hugo W.L. ter Doest

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

'use strict'

const Feature = require('./Feature')
const Distribution = require('./Distribution')

class GISScaler {
  // features is an array of feature functions
  constructor (featureSet, sample) {
    this.featureSet = featureSet
    this.sample = sample
  }

  // Returns true if a correction feature is necessary
  calculateMaxSumOfFeatures () {
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

  addCorrectionFeature () {
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
  run (maxIterations, minImprovement) {
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
        " - Expectation of feature according to p: " + f.expectationApprox(p, that.sample));
    });
    */

    return p
  }
}

module.exports = GISScaler
