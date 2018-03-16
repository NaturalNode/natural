/*
  Feature set class for administrating a set of unique feature
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


function FeatureSet() {
  this.features = [];
  this.map = {};
}

// Returns true if the feature did not exist and was added
FeatureSet.prototype.addFeature = function(feature) {
  if (!this.featureExists(feature)) {
    this.map[feature.name +" | " + feature.parametersKey] = true;
    this.features.push(feature);
    //console.log("FeatureSet.addFeature: feature added: " + feature.name + " - " + feature.parametersKey);
    return true;
  }
  else {
    return false;
  }
};

FeatureSet.prototype.featureExists = function(feature) {
  if (this.map[feature.name +" | " + feature.parametersKey]) {
    //console.log("FeatureSet.featureExists: feature already exists: " +
    //  feature.name + " - " + feature.parameters);
    return true;
  }
  else {
    return false;
  }
};

// Returns an array of features
// If the available array this.features is up to date it is returned immediately
FeatureSet.prototype.getFeatures = function() {
  return this.features;
};

FeatureSet.prototype.size = function() {
  return this.features.length;
};

FeatureSet.prototype.prettyPrint = function() {
  var s = "";
  Object.keys(this.map).forEach(function(key) {
    s += key + "\n";
  });
  return s;
};

module.exports = FeatureSet;
