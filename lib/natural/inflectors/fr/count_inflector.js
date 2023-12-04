/*
Copyright (c) 2012, Guillaume Marty

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

/**
 * Numeral inflector for French.
 * @see http://fr.wikipedia.org/wiki/Ier_si%C3%A8cle
 *
 * Also handles roman numerals as a bonus. The rules are the same as for their
 * arabic numerals equivalent.
 *
 * \@todo Add inflector for gender and number. Ex:
 *   * CountInflector(1, MASCULINE, SINGULAR); // "1er" (Default)
 *   * CountInflector(1, MASCULINE, PLURAL);   // "1ers"
 *   * CountInflector(1, FEMINIE, SINGULAR);   // "1re"
 *   * CountInflector(1, FEMINIE, PLURAL);     // "1res"
 * \@todo add alternative form for 2. Ex:
 *   * CountInflector(2, undefined, undefined, ALTERNATIVE); // "2nd"
 */

const CountInflector = function () {
}

/**
 * @param {number|string} i
 * @return {string}
 */
CountInflector.nth = function (i) {
  return i.toString() + nthForm(i)
}

/**
 * @param {number|string} i
 * @return {string}
 */
function nthForm (i) {
  if (i === 1 || i === 'I') {
    return 'er'
  }

  return 'e'
}

module.exports = CountInflector
