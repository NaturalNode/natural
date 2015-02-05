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
   * Stemmer token constructor.
   *
   * @param {String} string Token string.
   */
  var Token = function (string) {
    this.vowels   = '';
    this.regions  = {};
    this.string   = string;
    this.original = string;
  }

  /**
   * Set vowels.
   *
   * @param  {String|Array} vowels List of vowels.
   * @return {Token}               Token instance.
   */
  Token.prototype.usingVowels = function (vowels) {
    this.vowels = vowels;
    return this;
  };

  /**
   * Marks a region by defining its starting index or providing a callback
   * function that does.
   *
   * @param  {String}       region   Region name.
   * @param  {Array|Number} args     Callback arguments or region start index.
   * @param  {Function}     callback Function that determines the start index (optional).
   * @param  {Object}       context  Callback context (optional, defaults to this).
   * @return {Token}                 Token instance.
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
   * Replaces all instances of a string with another.
   *
   * @param  {String} find    String to be replaced.
   * @param  {String} replace Replacement string.
   * @return {Token}          Token instance.
   */
  Token.prototype.replaceAll = function (find, replace) {
    this.string = this.string.split(find).join(replace);
    return this;
  };

  /**
   * Replaces the token suffix if in a region.
   *
   * @param  {String} suffix  Suffix to replace.
   * @param  {String} replace Replacement string.
   * @param  {String} region  Region name.
   * @return {Token}          Token instance.
   */
  Token.prototype.replaceSuffixInRegion = function (suffix, replace, region) {
    var suffixes = [].concat(suffix);
    for (var i = 0; i < suffixes.length; i++) {
      if (this.hasSuffixInRegion(suffixes[i], region)) {
        this.string = this.string.slice(0, -suffixes[i].length) + replace;
        return this;
      }
    }
    return this;
  };

  /**
   * Determines whether the token has a vowel at the provided index.
   *
   * @param  {Integer} index Character index.
   * @return {Boolean}       Whether the token has a vowel at the provided index.
   */
  Token.prototype.hasVowelAtIndex = function (index) {
    return this.vowels.indexOf(this.string[index]) !== -1;
  };

  /**
   * Finds the next vowel in the token.
   *
   * @param  {Integer} start Starting index offset.
   * @return {Integer}       Vowel index, or the end of the string.
   */
  Token.prototype.nextVowelIndex = function (start) {
    var index = (start >= 0 && start < this.string.length) ? start : this.string.length;
    while (index < this.string.length && !this.hasVowelAtIndex(index)) {
      index++;
    }
    return index;
  };

  /**
   * Finds the next consonant in the token.
   *
   * @param  {Integer} start Starting index offset.
   * @return {Integer}       Consonant index, or the end of the string.
   */
  Token.prototype.nextConsonantIndex = function (start) {
    var index = (start >= 0 && start < this.string.length) ? start : this.string.length;
    while (index < this.string.length && this.hasVowelAtIndex(index)) {
      index++;
    }
    return index;
  };

  /**
   * Determines whether the token has the provided suffix.
   * @param  {String}  suffix Suffix to match.
   * @return {Boolean}        Whether the token string ends in suffix.
   */
  Token.prototype.hasSuffix = function (suffix) {
    return this.string.slice(-suffix.length) === suffix;
  };

  /**
   * Determines whether the token has the provided suffix within the specified
   * region.
   *
   * @param  {String}  suffix Suffix to match.
   * @param  {String}  region Region name.
   * @return {Boolean}        Whether the token string ends in suffix.
   */
  Token.prototype.hasSuffixInRegion = function (suffix, region) {
    var regionStart = this.regions[region] || 0,
      suffixStart   = this.string.length - suffix.length;
    return this.hasSuffix(suffix) && suffixStart >= regionStart;
  };

  return Token;
})();
