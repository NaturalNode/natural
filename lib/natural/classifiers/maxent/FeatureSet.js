/*
Feature set class for administrating a set of unique feature
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

function FeatureSet () {
  this.features = []
  this.map = {}
}

// Returns true if the feature did not exist and was added
FeatureSet.prototype.addFeature = function (feature) {
  if (!this.featureExists(feature)) {
    this.map[feature.name + ' | ' + feature.parametersKey] = true
    this.features.push(feature)
    // console.log("FeatureSet.addFeature: feature added: " + feature.name + " - " + feature.parametersKey);
    return true
  } else {
    return false
  }
}

FeatureSet.prototype.featureExists = function (feature) {
  if (this.map[feature.name + ' | ' + feature.parametersKey]) {
    // console.log("FeatureSet.featureExists: feature already exists: " +
    //  feature.name + " - " + feature.parameters);
    return true
  } else {
    return false
  }
}

// Returns an array of features
// If the available array this.features is up to date it is returned immediately
FeatureSet.prototype.getFeatures = function () {
  return this.features
}

FeatureSet.prototype.size = function () {
  return this.features.length
}

FeatureSet.prototype.prettyPrint = function () {
  let s = ''
  Object.keys(this.map).forEach(function (key) {
    s += key + '\n'
  })
  return s
}

module.exports = FeatureSet
