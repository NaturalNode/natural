/*
Distribution class for probability distributions
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

const Element = require('./Element')

class Distribution {
  constructor (alpha, featureSet, sample) {
    this.alpha = alpha
    this.featureSet = featureSet
    this.sample = sample
  }

  // Returns the distribution as a string that can be stored for later usage
  toString () {

  }

  weight (x) {
    let product = 1
    const that = this

    this.alpha.forEach(function (alphaj, j) {
      product *= Math.pow(alphaj, that.featureSet.getFeatures()[j].apply(x))
    })
    return product
  }

  calculateAPriori (x) {
    if (!this.aPriorisBeforeNormalisation[x.toString()]) {
      this.aPriorisBeforeNormalisation[x.toString()] = this.weight(x)
    }
    return this.aPriorisBeforeNormalisation[x.toString()]// / this.aPrioriNormalisationConstant;
  }

  // Memoize a priori probabilities of sample elements
  prepareWeights () {
    this.aPriorisBeforeNormalisation = {}
    this.aPrioriNormalisationConstant = 0
    let sum = 0
    const that = this
    this.sample.elements.forEach(function (x) {
      that.aPriorisBeforeNormalisation[x.toString()] = that.weight(x)
      sum += that.aPriorisBeforeNormalisation[x.toString()]
    })
    this.aPrioriNormalisationConstant = sum
  }

  calculateAPosteriori (x) {
    if (!this.aPriorisBeforeNormalisation[x.toString()]) {
      this.aPriorisBeforeNormalisation[x.toString()] = this.weight(x)
    }
    if (!this.aPosterioriNormalisationConstants[x.b.toString()]) {
      this.aPosterioriNormalisationConstants[x.b.toString()] = this.aPosterioriNormalisation(x.b)
    }
    return this.aPriorisBeforeNormalisation[x] / this.aPosterioriNormalisationConstants[x.b.toString()]
  }

  aPosterioriNormalisation (b) {
    let sum = 0

    const that = this
    this.sample.getClasses().forEach(function (a) {
      sum += that.weight(new Element(a, b))
    })

    return (sum)
  }

  // Memoize a posteriori probabilities of sample elements
  prepareAPosterioris () {
    this.aPosterioriNormalisationConstants = {}

    const contextSeen = {}
    const that = this
    this.sample.elements.forEach(function (sampleElement) {
      const context = sampleElement.b
      if (!contextSeen[context]) {
        contextSeen[context] = true
        that.aPosterioriNormalisationConstants[context] =
          that.aPosterioriNormalisation(context)
      }
    })
  }

  // Memoize all probabilities of sample elements
  prepare () {
    this.prepareWeights()
    // console.log("Weights prepared");
    this.prepareAPosterioris()
  }

  // Relative entropy between observered distribution and derived distribution
  KullbackLieblerDistance () {
    let sum = 0
    const that = this
    this.sample.elements.forEach(function (x) {
      sum += that.sample.observedProbability(x) * Math.log(that.sample.observedProbability(x) / that.calculateAPriori(x))
    })
    return sum
  }

  logLikelihood () {
    let sum = 0
    const that = this
    this.sample.elements.forEach(function (x) {
      sum += that.sample.observedProbability(x) * Math.log(that.calculateAPriori(x))
    })
    return sum
  }

  entropy () {
    let sum = 0
    const that = this
    this.sample.elements.forEach(function (x) {
      const p = that.calculateAPriori(x)
      sum += p * Math.log(p)
    })
    return sum
  }

  checkSum () {
    let sum = 0
    const that = this
    this.sample.elements.forEach(function (x) {
      sum += that.calculateAPriori(x)
    })
    // console.log("Distribution.checkSum is " + sum);
    return sum
  }
}

module.exports = Distribution
