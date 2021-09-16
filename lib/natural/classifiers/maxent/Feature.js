/*
Feature class for features that fire (or don't) on combinations of context
and class
Copyright (C) 2017 Hugo W.L. ter Doest

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

function Feature (f, name, parameters) {
  this.evaluate = f
  this.name = name
  this.parameters = parameters

  let tmp = ''
  parameters.forEach(function (par) {
    tmp += par + '|'
  })
  this.parametersKey = tmp.substr(0, tmp.length - 1)
}

Feature.prototype.apply = function (x) {
  return this.evaluate(x)
}

Feature.prototype.expectationApprox = function (p, sample) {
  const that = this
  let sum = 0
  const seen = {}
  const A = sample.getClasses()
  sample.elements.forEach(function (sampleElement) {
    const bi = sampleElement.b

    if (!seen[bi.toString()]) {
      seen[bi.toString()] = true

      A.forEach(function (a) {
        const x = new Element(a, bi)
        sum += sample.observedProbabilityOfContext(bi) * p.calculateAPosteriori(x) * that.apply(x)
      })
    }
  })
  return sum
}

// Diect calculation of expected value of this feature according to distribution p
// In real-life applications with a lot of features this is not tractable
Feature.prototype.expectation = function (p, A, B) {
  let sum = 0
  const that = this
  A.forEach(function (a) {
    B.forEach(function (b) {
      const x = new Element(a, b)
      sum += (p.calculateAPriori(x) * that.apply(x))
    })
  })
  return sum
}

// Observed expectation of this feature in the sample
Feature.prototype.observedExpectation = function (sample) {
  if (this.observedExpect) {
    return this.observedExpect
  }
  const N = sample.size()
  let sum = 0
  const that = this
  sample.elements.forEach(function (x) {
    sum += that.apply(x)
  })
  this.observedExpect = sum / N
  return this.observedExpect
}

module.exports = Feature
