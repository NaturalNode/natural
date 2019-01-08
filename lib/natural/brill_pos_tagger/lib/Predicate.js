/*
  Predicates for the Brill tagger
  Copyright (C) 2019 Hugo W.L. ter Doest

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

const DEBUG = false;

var predicates = require("./RuleTemplates");
DEBUG && console.log('RuleSet loaded predicates: ' + predicates);

function Predicate(name, parameter1, parameter2) {
  this.name = name;
  this.meta = predicates[name];
  if (!this.meta) {
    this.meta = predicates["DEFAULT"];
  }
  //if (this.meta.nrParameters > 0) {
    this.parameter1 = parameter1;
  //}
  //if (this.meta.nrParameters > 1) {
    this.parameter2 = parameter2;
  //}
  DEBUG && console.log('Predicate\n' + JSON.toString(this.meta, null, 2));
}

Predicate.prototype.evaluate = function(sentence, position) {
  DEBUG && console.log('Predicate.evalute: ' + this.name);
  var predicate = this.meta.function;
  return (predicate(sentence, position, this.parameter1, this.parameter2));
};

module.exports = Predicate;
