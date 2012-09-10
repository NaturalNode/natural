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

  it('should transliterate misc. words correctly', function() {
    expect(transliterate_ja('アヴァンギャルド')).toEqual('avangyarudo'); // Avant-garde
    expect(transliterate_ja('アクサン・スィルコンフレックス')).toEqual('akusan sirukonfurekkusu'); // Accent circonflexe
    expect(transliterate_ja('アドレシッング')).toEqual('adoreshinngu'); // Addressing
    expect(transliterate_ja('イェス')).toEqual('yesu'); // Yes
    expect(transliterate_ja('インテリジェンス')).toEqual('interijensu'); // Intelligence
    expect(transliterate_ja('インテルメッツォ')).toEqual('interumettso'); // Intermezzo
    expect(transliterate_ja('グァテマラ')).toEqual('gwatemara'); // Guatemala
    expect(transliterate_ja('クァルテット')).toEqual('kwarutetto'); // Quartet
    expect(transliterate_ja('クィンテット')).toEqual('kwintetto'); // Quintet
    expect(transliterate_ja('クォーター')).toEqual('kwōtā'); // Quarter
    expect(transliterate_ja('サブウーファー')).toEqual('sabuūfā'); // Sub woofer
    expect(transliterate_ja('ソフトウェア')).toEqual('sofutowea'); // Software
    expect(transliterate_ja('ツィーター')).toEqual('tsītā'); // Tweeter
    expect(transliterate_ja('デューティー')).toEqual('dyūtī'); // Duty
    expect(transliterate_ja('ドキュメントィンドウ')).toEqual('dokyumentwindō'); // Document window
    expect(transliterate_ja('ヌーヴェルヴァーグ')).toEqual('nūveruvāgu'); // Nouvelle vague
    expect(transliterate_ja('ハイジャッンプ')).toEqual('haijanmpu'); // High jump
    expect(transliterate_ja('バッファ')).toEqual('baffa'); // Buffer
    expect(transliterate_ja('フーホェア')).toEqual('fūhwea'); // WhoWhere?
    expect(transliterate_ja('フェイズィング')).toEqual('feizingu'); // Phasing
    expect(transliterate_ja('フッロピー')).toEqual('furropī'); // Floppy (alternative transcription)
    expect(transliterate_ja('ブュー')).toEqual('byū'); // View
    expect(transliterate_ja('フューチャー')).toEqual('fyūchā'); // Future
    expect(transliterate_ja('フロッピィ')).toEqual('furoppī'); // Floppy
    expect(transliterate_ja('ボージョレー・ヌーヴォー')).toEqual('bōjorē nūvō'); // Beaujolais nouveau
    expect(transliterate_ja('ボスニア・ヘルツェゴビナ')).toEqual('bosunia herutsegobina'); // Bosnia and Herzegovina
    expect(transliterate_ja('マッハ')).toEqual('mahha'); // Mach
    expect(transliterate_ja('レヴュー')).toEqual('revyū'); // Review
    expect(transliterate_ja('レクリェーション')).toEqual('rekuryēshon'); // Recreation
  });

  it('should use fallback for small vowels on special case', function() {
    // These words use rare combination of small vowels.
    expect(transliterate_ja('アゲィンスト')).toEqual('ageinsuto'); // Against (alternative transcription)
    expect(transliterate_ja('エッセィ')).toEqual('essei'); // Essay (alternative transcription)
    expect(transliterate_ja('ゾゥアラジィ')).toEqual('zouarajī'); // Zoology (alternative transcription)
    expect(transliterate_ja('ゾゥァラジカル')).toEqual('zouarajikaru'); // Zoological (alternative transcription)
    expect(transliterate_ja('ボランテァ')).toEqual('borantea'); // Volunteer (alternative transcription)
  });
});
