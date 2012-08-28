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

var StemmerJa = require('lib/natural/stemmers/stemmer_ja');
var stemmer = new StemmerJa();

var test = ['コピー', 'コーヒー', 'タクシー', 'パーティー', 'パーティ', 'センター'];
var testResult = ['コピー', 'コーヒ', 'タクシ', 'パーティ', 'パーティ', 'センタ'];
var text = '明後日パーティーに行く予定がある。図書館で資料をコピーしました。';

describe('StemmerJa', function() {
  it('should stem words', function() {
    for (var i = 0; i < test.length; i++) {
      expect(stemmer.stem(test[i])).toBe(testResult[i]);
    }
  });

  it('should not tokenize halfwidth katakana', function() {
    expect(stemmer.stem('ﾀｸｼｰ')).toEqual('ﾀｸｼｰ');
  });

  it('should tokenize, stem and exclude stop words (default behavior)', function() {
    var tokens = [
      '明後日', 'パーティ', '行く', '予定',   // パーティー should be stemmed
      '図書館', '資料', 'コピー', 'まし'];
    expect(stemmer.tokenizeAndStem(text)).toEqual(tokens);
    expect(stemmer.tokenizeAndStem(text, false)).toEqual(tokens);
  });

  it('should tokenize, stem and keep stop words', function() {
    expect(stemmer.tokenizeAndStem(text, true)).toEqual([
      '明後日', 'パーティ', 'に', '行く', '予定', 'が', 'ある',
      '図書館', 'で', '資料', 'を', 'コピー', 'し', 'まし', 'た']);
  });

  it('should attach new methods to String', function() {
    stemmer.attach();
    expect('コーヒー'.stem()).toEqual('コーヒ');
    expect('コピー'.stem()).toEqual('コピー');
    expect('図書館で資料をコピーしました。'.tokenizeAndStem()).toEqual([
      '図書館', '資料', 'コピー', 'まし']);
    expect('図書館で資料をコピーしました。'.tokenizeAndStem(false)).toEqual([
      '図書館', '資料', 'コピー', 'まし']);
    expect('図書館で資料をコピーしました。'.tokenizeAndStem(true)).toEqual([
      '図書館', 'で', '資料', 'を', 'コピー', 'し', 'まし', 'た']);
  });
});
