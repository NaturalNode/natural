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

  var Stemmer     = require('./stemmer_pt'),
    Token         = require('./token'),
    PorterStemmer = new Stemmer();

  /**
   * Marks a region after the first non-vowel following a vowel, or the
   * null region at the end of the word if there is no such non-vowel.
   *
   * @param {Object} token Token to stem.
   * @param {Number} start Start index (defaults to 0).
   * @param {Number}       Region start index.
   */
   var markRegionN = function (start) {
    var index = start || 0,
      length = this.string.length,
      region = length;

    while (index < length - 1 && region === length) {
      if (this.hasVowelAtIndex(index) && !this.hasVowelAtIndex(index + 1)) {
        region = index + 2;
      }
      index++;
    }

    return region;
  };

  /**
   * Mark RV.
   *
   * @param  {Object} token Token to stem.
   * @return {Number}       Region start index.
   */
  var markRegionV = function () {
    var rv = this.string.length;

    if (rv > 3) {
      if (!this.hasVowelAtIndex(1)) {
        rv = this.nextVowelIndex(2) + 1;

      } else if (this.hasVowelAtIndex(0) && this.hasVowelAtIndex(1)) {
        rv = this.nextConsonantIndex(2) + 1;

      } else {
        rv = 3;
      }
    }

    return rv;
  };

  /**
   * Prelude.
   *
   * Nasalised vowel forms should be treated as a vowel followed by a consonant.
   *
   * @param  {String} token Word to stem.
   * @return {String}       Stemmed token.
   */
  function prelude (token) {
    return token
    .replaceAll('ã', 'a~')
    .replaceAll('õ', 'o~');
  }

  /**
   * Step 1: Standard suffix removal.
   *
   * This step should always be performed.
   *
   * @param  {Token} token Word to stem.
   * @return {Token}       Stemmed token.
   */
  function standardSuffix (token) {

    token.replaceSuffixInRegion([
      'amentos', 'imentos', 'aço~es', 'adoras', 'adores', 'amento', 'imento',

      'aça~o', 'adora', 'ância', 'antes', 'ismos', 'istas',

      'ador', 'ante', 'ável', 'ezas', 'icas', 'icos', 'ismo', 'ista', 'ível',
      'osas', 'osos',

      'eza', 'ica', 'ico', 'osa', 'oso'

      ], '', 'r2');

    token.replaceSuffixInRegion(['logias', 'logia'], 'log', 'r2');

    // token.replaceSuffixInRegion(['uço~es', 'uça~o'], 'u', 'r1');

    token.replaceSuffixInRegion(['ências', 'ência'], 'ente', 'r2');

    token.replaceSuffixInRegion([
      'ativamente', 'icamente', 'ivamente', 'osamente', 'adamente'
    ], '', 'r2');

    token.replaceSuffixInRegion('amente', '', 'r1');

    token.replaceSuffixInRegion([
      'antemente', 'avelmente', 'ivelmente', 'mente'
    ], '', 'r2');

    token.replaceSuffixInRegion([
      'abilidades', 'abilidade',
      'icidades', 'icidade',
      'ividades', 'ividade',
      'idades', 'idade'
    ], '', 'r2');

    token.replaceSuffixInRegion([
      'ativas', 'ativos', 'ativa', 'ativo',
      'ivas', 'ivos', 'iva', 'ivo'
    ], '', 'r2');

    if (token.hasSuffix('eiras') || token.hasSuffix('eira')) {
      token.replaceSuffixInRegion(['iras', 'ira'], 'ir', 'rv');
    }

    return token;
  }

  /**
   * Step 2: Verb suffix removal.
   *
   * Perform this step if no ending was removed in step 1.
   *
   * @param  {Token} token   Token to stem.
   * @return {Token}         Stemmed token.
   */
  function verbSuffix (token) {

    token.replaceSuffixInRegion([
      'aríamos', 'ássemos', 'eríamos', 'êssemos', 'iríamos', 'íssemos',

      'áramos', 'aremos', 'aríeis', 'ásseis', 'ávamos', 'éramos', 'eremos',
      'eríeis', 'ésseis', 'íramos', 'iremos', 'iríeis', 'ísseis',

      'ara~o', 'ardes', 'areis', 'áreis', 'ariam', 'arias', 'armos', 'assem',
      'asses', 'astes', 'áveis', 'era~o', 'erdes', 'ereis', 'éreis', 'eriam',
      'erias', 'ermos', 'essem', 'esses', 'estes', 'íamos', 'ira~o', 'irdes',
      'ireis', 'íreis', 'iriam', 'irias', 'irmos', 'issem', 'isses', 'istes',

      'adas', 'ados', 'amos', 'ámos', 'ando', 'aram', 'aras', 'arás', 'arei',
      'arem', 'ares', 'aria', 'asse', 'aste', 'avam', 'avas', 'emos', 'endo',
      'eram', 'eras', 'erás', 'erei', 'erem', 'eres', 'eria', 'esse', 'este',
      'idas', 'idos', 'íeis', 'imos', 'indo', 'iram', 'iras', 'irás', 'irei',
      'irem', 'ires', 'iria', 'isse', 'iste',

      'ada', 'ado', 'ais', 'ara', 'ará', 'ava', 'eis', 'era', 'erá', 'iam',
      'ias', 'ida', 'ido', 'ira', 'irá',

      'am', 'ar', 'as', 'ei', 'em', 'er', 'es', 'eu', 'ia', 'ir', 'is', 'iu', 'ou'

    ], '', 'rv');

    return token;
  }

  /**
   * Step 3: Delete suffix i.
   *
   * Perform this step if the word was changed, in RV and preceded by c.
   *
   * @param  {Token} token   Token to stem.
   * @return {Token}         Stemmed token.
   */
  function iPrecededByCSuffix (token) {

    if (token.hasSuffix('ci')) {
      token.replaceSuffixInRegion('i', '', 'rv');
    }

    return token;
  }

  /**
   * Step 4: Residual suffix.
   *
   * Perform this step if steps 1 and 2 did not alter the word.
   *
   * @param  {Token} token Token to stem.
   * @return {Token}       Stemmed token.
   */
  function residualSuffix (token) {

    token.replaceSuffixInRegion(['os', 'a', 'i', 'o', 'á', 'í', 'ó'], '', 'rv');

    return token;
  }

  /**
   * Step 5: Residual form.
   *
   * This step should always be performed.
   *
   * @param  {Token} token Token to stem.
   * @return {Token}       Stemmed token.
   */
  function residualForm (token) {

    var tokenString = token.string;

    if (token.hasSuffix('gue') || token.hasSuffix('gué') || token.hasSuffix('guê')) {
      token.replaceSuffixInRegion(['ue', 'ué', 'uê'], '', 'rv');
    }

    if (token.hasSuffix('cie') || token.hasSuffix('cié') || token.hasSuffix('ciê')) {
      token.replaceSuffixInRegion(['ie', 'ié', 'iê'], '', 'rv');
    }

    if (tokenString === token.string) {
      token.replaceSuffixInRegion(['e', 'é', 'ê'], '', 'rv');
    }

    token.replaceSuffixInRegion('ç', 'c', 'all');

    return token;
  }

  /**
   * Postlude.
   *
   * Turns a~, o~ back into ã, õ.
   *
   * @param  {String} token Word to stem.
   * @return {String}       Stemmed token.
   */
  function postlude (token) {
    return token
      .replaceAll('a~', 'ã')
      .replaceAll('o~', 'õ');
  }

  /**
   * Stems a word using a Porter stemmer algorithm.
   *
   * @param  {String} word Word to stem.
   * @return {String}      Stemmed token.
   */
  PorterStemmer.stem = function (word) {
    var token = new Token(word.toLowerCase()),
      original;

    token = prelude(token);

    token.usingVowels('aeiouáéíóúâêôàãõ')
      .markRegion('all', 0)
      .markRegion('r1', null, markRegionN)
      .markRegion('r2', token.regions.r1, markRegionN)
      .markRegion('rv', null, markRegionV);

    original = token.string;

    // Always do step 1.
    token = standardSuffix(token);

    // Do step 2 if no ending was removed by step 1.
    if (token.string === original) {
      token = verbSuffix(token);
    }

    // If the last step to be obeyed — either step 1 or 2 — altered the word,
    // do step 3. Alternatively, if neither steps 1 nor 2 altered the word, do
    // step 4.
    token = token.string !== original ? iPrecededByCSuffix(token) : residualSuffix(token);

    // Always do step 5.
    token = residualForm(token);

    token = postlude(token);

    return token.string;
  };

  return PorterStemmer;
})();
