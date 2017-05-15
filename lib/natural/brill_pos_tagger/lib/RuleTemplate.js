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

var TransformationRule = require("./TransformationRule");

var predicates = require("./PredicateMapping");
var availablePOSTags = require("./POS_Tags");

// A rule template is the same as a predicate
// First version supports only one parameter
function RuleTemplate(predicateName) {
  this.predicateName = predicateName;
  this.meta = predicates[predicateName];
  if (!this.meta) {
    this.meta = predicates["DEFAULT"];
  }
}

// Returns a list of applicable rules for the site in the corpus
RuleTemplate.prototype.generateRules = function(corpus, site) {
  var rules = [];

  var sentence = corpus[site.sentence];
  var token = sentence[site.index];
  var tag1 = token.tag;

  availablePOSTags.forEach(function(tag2) {
    if (tag1 !== tag2) {
      if (this.meta.nrParameters == 1) {
        if (this.meta.typeParameter1 === "TAG") {
          availablePOSTags.forEach(function(parameterTag) {
            rules.push(new TransformationRule(tag1, tag2, this.predicateName, parameterTag));
          });
        }
      }
      else {
        if (this.meta.nrParameters === 2) {
          if ((this.meta.typeParameter1 === "TAG") && (this.meta.typeParameter2 === "TAG")) {
            availablePOSTags.forEach(function (parameter1Tag) {
              availablePOSTags.forEach(function (parameter2Tag) {
                rules.push(new TransformationRule(tag1, tag2, this.predicateName, parameter1Tag, parameter2Tag));
              });
            });
          }
        }
        else {
          rules.push(new TransformationRule(tag1, tag2, this.predicateName);
        }
      }
    }
  });
  return(rules);
};
