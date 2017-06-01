/*
  Rule Template Class
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

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.setLevel('DEBUG');

var TransformationRule = require("./TransformationRule");

var predicates = require("./PredicateMapping");

// A rule template is the same as a predicate extended with some metadata
// First version supports only one parameter
function RuleTemplate(predicateName) {
  this.predicateName = predicateName;
  this.meta = predicates[predicateName];
  if (!this.meta) {
    this.meta = predicates["DEFAULT"];
  }
}

module.exports = RuleTemplate;
