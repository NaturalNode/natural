/*
  Simple Example Element class
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

var util = require('util');

var Element = require('../Element');
var Feature = require('../Feature');

function SE_Element(a, b) {
   SE_Element.super_.call(this, a, b);
}

util.inherits(SE_Element, Element);

SE_Element.prototype.generateFeatures = function(featureSet) {

  function isZero(x) {
    if ((x.a === "x") && (x.b.data === "0")) {
      return 1;
    }
    return 0;
  }
  featureSet.addFeature(new Feature(isZero, "isZero", ["0"]));

  function isOne(x) {
    if ((x.a === "y") && (x.b.data === "1")) {
      return 1;
    }
    return 0;
  }
  featureSet.addFeature(new Feature(isOne, "isOne", ["1"]));
};

module.exports = SE_Element;
