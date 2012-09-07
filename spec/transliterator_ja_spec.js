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

var transliterate_ja = require('lib/natural/transliterators/ja');

describe('transliterate_ja', function() {
  it('should transliterate hiragana', function() {
    expect(transliterate_ja('あいうえお かきくけこ')).toEqual('aiueo kakikukeko');
    expect(transliterate_ja('さしすせそ たちつてと')).toEqual('sashisuseso tachitsuteto');
  });

  it('should transliterate katakana', function() {
    expect(transliterate_ja('アイウエオ カキクケコ')).toEqual('aiueo kakikukeko');
    expect(transliterate_ja('サシスセソ タチツテト')).toEqual('sashisuseso tachitsuteto');
  });

  it('should transliterate small tsu differently depending on context', function() {
    expect(transliterate_ja('まっか ざっし たった はっぱ')).toEqual('makka zasshi tatta happa');
    expect(transliterate_ja('マッカ ザッシ タッタ ハッパ')).toEqual('makka zasshi tatta happa');
  });

  it('should transliterate final small tsu', function() {
    expect(transliterate_ja('ああっ')).toEqual('aat');
    expect(transliterate_ja('アアッ')).toEqual('aat');
  });

  it('should transliterate n differently depending on context', function() {
    expect(transliterate_ja('まんと ばんび ほんや')).toEqual("manto bambi hon'ya");
    expect(transliterate_ja('マント バンビ ホンヤ')).toEqual("manto bambi hon'ya");
  });

  it('should transliterate long vowels', function() {
    expect(transliterate_ja('ああ　いい　うう　ええ　おお　おう')).toEqual('aa　ii　ū　ee　oo　ō');
    expect(transliterate_ja('あー　いー　うー　えー　おー')).toEqual('ā　ī　ū　ē　ō');
    expect(transliterate_ja('アア　イイ　ウウ　エエ　オオ　オウ')).toEqual('aa　ii　ū　ee　oo　ō');
    expect(transliterate_ja('アー　イー　ウー　エー　オー')).toEqual('ā　ī　ū　ē　ō');
  });

  it('should leave non fullwidth kana unchanged', function() {
    expect(transliterate_ja('abc ABC 漢字 (.)')).toEqual('abc ABC 漢字 (.)');
    expect(transliterate_ja('ｱｲｳｴｵ ｶｷｸｹｺ')).toEqual('ｱｲｳｴｵ ｶｷｸｹｺ');
  });
});
