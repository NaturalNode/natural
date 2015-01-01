/*
Copyright (c) 2015, Luís Rodrigues

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

module.exports = (function () {
  'use strict';

  /**
   * [Token description]
   * @param {[type]} token [description]
   */
  var Token = function (string) {
    this.vowels  = '';
    this.regions = {};
    this.string  = string;
  }

  /**
   * Set vowels.
   *
   * @param {[type]} vowels [description]
   */
  Token.prototype.usingVowels = function (vowels) {
    this.vowels = vowels;
    return this;
  };

  /**
   * Marks a region by defining its starting index or providing a callback
   * function that does.
   *
   * @param {[type]}       region   Region name.
   * @param {Array|Number} args     Callback arguments or region start index.
   * @param {Function}     callback Function that determines the start index (optional).
   * @param {Object}       context  Callback context (optional, defaults to this).
   */
  Token.prototype.markRegion = function (region, args, callback, context) {
    if (typeof callback === 'function') {
      this.regions[region] = callback.apply(context || this, [].concat(args));

    } else if (!isNaN(args)) {
      this.regions[region] = args;
    }
    
    return this;
  };

  /**
   * [replaceAll description]
   * @param {[type]} find    [description]
   * @param {[type]} replace [description]
   */
  Token.prototype.replaceAll = function (find, replace) {
    this.string = this.string.split(find).join(replace);
    return this;
  };

  Token.prototype.replaceSuffixInRegion = function (region, suffix, replace) {
    var regionStart = this.regions[region];
    // TODO
    return this;
  };

  /**
   * Determines whether the token has a vowel at the provided index.
   *
   * @param  {Number}  index Character index.
   * @return {Boolean}       Whether the token has a vowel at the provided index.
   */
  Token.prototype.hasVowelAtIndex = function (index) {
    return this.vowels.indexOf(this.string[index]) !== -1;
  };

  /**
   * [nextVowelIndex description]
   * @param {[type]} start [description]
   */
  Token.prototype.nextVowelIndex = function (start) {
    var index = (start >= 0 && start < this.string.length) ? start : this.string.length;
    while (index < this.string.length && !this.hasVowelAtIndex(index)) {
      index++;
    }
    return index;
  };

  /**
   * [nextConsonantIndex description]
   * @param {[type]} start [description]
   */
  Token.prototype.nextConsonantIndex = function (start) {
    var index = (start >= 0 && start < this.string.length) ? start : this.string.length;
    while (index < this.string.length && this.hasVowelAtIndex(index)) {
      index++;
    }
    return index;
  };

  /**
   * Token comparison.
   * @param  {Token}    that Token for comparison.
   * @return {Booklean}      Whether tokens are equal.
   */
  Token.prototype.isEqual = function (that) {
    return this.string === that.string;
  };

  return Token;
})();
