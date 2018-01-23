/*
    Element class for elements in the event space
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

var Feature = require('./Feature');

// a is class and b is context
function Element(a, b) {
  this.a = a;
  this.b = b;
}

Element.prototype.toString = function() {
  if (!this.key) {
    this.key =  this.a + this.b.toString();
  }
  return this.key;
};

module.exports = Element;
