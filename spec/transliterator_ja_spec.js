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

const Transliterators = require('../lib/natural/transliterators')
const transliterateJa = Transliterators.TransliterateJa

describe('transliterateJa', function () {
  it('should transliterate hiragana', function () {
    expect(transliterateJa('あいうえお かきくけこ')).toEqual('aiueo kakikukeko')
    expect(transliterateJa('さしすせそ たちつてと')).toEqual('sashisuseso tachitsuteto')
  })

  it('should transliterate katakana', function () {
    expect(transliterateJa('アイウエオ カキクケコ')).toEqual('aiueo kakikukeko')
    expect(transliterateJa('サシスセソ タチツテト')).toEqual('sashisuseso tachitsuteto')
  })

  it('should transliterate small tsu differently depending on context', function () {
    expect(transliterateJa('まっか ざっし たった はっぱ')).toEqual('makka zasshi tatta happa')
    expect(transliterateJa('マッカ ザッシ タッタ ハッパ')).toEqual('makka zasshi tatta happa')
  })

  it('should transliterate final small tsu', function () {
    expect(transliterateJa('ああっ')).toEqual('aat')
    expect(transliterateJa('アアッ')).toEqual('aat')
  })

  it('should transliterate n differently depending on context', function () {
    expect(transliterateJa('まんと ばんび ほんや')).toEqual("manto bambi hon'ya")
    expect(transliterateJa('マント バンビ ホンヤ')).toEqual("manto bambi hon'ya")
  })

  it('should transliterate long vowels', function () {
    expect(transliterateJa('ああ　いい　うう　ええ　おお　おう')).toEqual('aa　ii　ū　ee　oo　ō')
    expect(transliterateJa('あー　いー　うー　えー　おー')).toEqual('ā　ī　ū　ē　ō')
    expect(transliterateJa('アア　イイ　ウウ　エエ　オオ　オウ')).toEqual('aa　ii　ū　ee　oo　ō')
    expect(transliterateJa('アー　イー　ウー　エー　オー')).toEqual('ā　ī　ū　ē　ō')
  })

  it('should leave non fullwidth kana unchanged', function () {
    expect(transliterateJa('abc ABC 漢字 (.)')).toEqual('abc ABC 漢字 (.)')
    expect(transliterateJa('ｱｲｳｴｵ ｶｷｸｹｺ')).toEqual('ｱｲｳｴｵ ｶｷｸｹｺ')
  })

  it('should transliterate misc. words correctly', function () {
    expect(transliterateJa('アヴァンギャルド')).toEqual('avangyarudo') // Avant-garde
    expect(transliterateJa('アクサン・スィルコンフレックス')).toEqual('akusan sirukonfurekkusu') // Accent circonflexe
    expect(transliterateJa('アドレシッング')).toEqual('adoreshinngu') // Addressing
    expect(transliterateJa('イェス')).toEqual('yesu') // Yes
    expect(transliterateJa('インテリジェンス')).toEqual('interijensu') // Intelligence
    expect(transliterateJa('インテルメッツォ')).toEqual('interumettso') // Intermezzo
    expect(transliterateJa('グァテマラ')).toEqual('gwatemara') // Guatemala
    expect(transliterateJa('クァルテット')).toEqual('kwarutetto') // Quartet
    expect(transliterateJa('クィンテット')).toEqual('kwintetto') // Quintet
    expect(transliterateJa('クォーター')).toEqual('kwōtā') // Quarter
    expect(transliterateJa('サブウーファー')).toEqual('sabuūfā') // Sub woofer
    expect(transliterateJa('ソフトウェア')).toEqual('sofutowea') // Software
    expect(transliterateJa('ツィーター')).toEqual('tsītā') // Tweeter
    expect(transliterateJa('デューティー')).toEqual('dyūtī') // Duty
    expect(transliterateJa('ドキュメントィンドウ')).toEqual('dokyumentwindō') // Document window
    expect(transliterateJa('ヌーヴェルヴァーグ')).toEqual('nūveruvāgu') // Nouvelle vague
    expect(transliterateJa('ハイジャッンプ')).toEqual('haijanmpu') // High jump
    expect(transliterateJa('バッファ')).toEqual('baffa') // Buffer
    expect(transliterateJa('フーホェア')).toEqual('fūhwea') // WhoWhere?
    expect(transliterateJa('フェイズィング')).toEqual('feizingu') // Phasing
    expect(transliterateJa('フッロピー')).toEqual('furropī') // Floppy (alternative transcription)
    expect(transliterateJa('ブュー')).toEqual('byū') // View
    expect(transliterateJa('フューチャー')).toEqual('fyūchā') // Future
    expect(transliterateJa('フロッピィ')).toEqual('furoppī') // Floppy
    expect(transliterateJa('ボージョレー・ヌーヴォー')).toEqual('bōjorē nūvō') // Beaujolais nouveau
    expect(transliterateJa('ボスニア・ヘルツェゴビナ')).toEqual('bosunia herutsegobina') // Bosnia and Herzegovina
    expect(transliterateJa('マッハ')).toEqual('mahha') // Mach
    expect(transliterateJa('レヴュー')).toEqual('revyū') // Review
    expect(transliterateJa('レクリェーション')).toEqual('rekuryēshon') // Recreation
  })

  it('should use fallback for small vowels on special case', function () {
    // These words use rare combination of small vowels.
    expect(transliterateJa('アゲィンスト')).toEqual('ageinsuto') // Against (alternative transcription)
    expect(transliterateJa('エッセィ')).toEqual('essei') // Essay (alternative transcription)
    expect(transliterateJa('ゾゥアラジィ')).toEqual('zouarajī') // Zoology (alternative transcription)
    expect(transliterateJa('ゾゥァラジカル')).toEqual('zouarajikaru') // Zoological (alternative transcription)
    expect(transliterateJa('ボランテァ')).toEqual('borantea') // Volunteer (alternative transcription)
  })
})
