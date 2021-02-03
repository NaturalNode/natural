/*
    Feature class for features that fire (or don't) on combinations of context
    and class
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
