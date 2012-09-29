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

var normalize_ja = require('lib/natural/normalizers/normalizer_ja').normalize_ja;
var converters = require('lib/natural/normalizers/normalizer_ja').converters;

describe('normalize_ja', function() {
  it('should fix badly formed hiragana', function() {
    expect(normalize_ja('う゛か゛き゛く゛は゜ひ゜ふ゜')).toEqual('ゔがぎぐぱぴぷ');
    expect(normalize_ja('うﾞかﾞきﾞくﾞはﾟひﾟふﾟ')).toEqual('ゔがぎぐぱぴぷ');
    expect(normalize_ja('まっなか')).toEqual('まんなか');
  });

  it('should fix badly formed fullwidth katakana', function() {
    expect(normalize_ja('ウ゛カ゛キ゛ク゛ハ゜ヒ゜フ゜')).toEqual('ヴガギグパピプ');
    expect(normalize_ja('ウﾞカﾞキﾞクﾞハﾟヒﾟフﾟ')).toEqual('ヴガギグパピプ');
  });

  it('should fix badly formed halfwidth katakana', function() {
    expect(normalize_ja('ｳ゛ｶ゛ｷ゛ｸ゛ﾊ゜ﾋ゜ﾌ゜')).toEqual('ヴガギグパピプ');
    expect(normalize_ja('ｳﾞｶﾞｷﾞｸﾞﾊﾟﾋﾟﾌﾟ')).toEqual('ヴガギグパピプ');
  });

  it('should transform halfwidth katakana to fullwidth', function() {
    expect(normalize_ja('ｶﾀｶﾅ')).toEqual('カタカナ');
  });

  it('should transform fullwidth alphanumerical characters to halfwidth', function() {
    expect(normalize_ja('ＡＢＣ１２３')).toEqual('ABC123');
  });

  it('should transform fullwidth spaces to halfwidth', function() {
    expect(normalize_ja('空　空　空')).toEqual('空 空 空');
  });

  it('should transform halfwidth punctuation signs to fullwidth', function() {
    // Taken from http://unicode.org/cldr/trac/browser/trunk/common/main/ja.xml
    expect(normalize_ja('‾ _＿ -－ ‐ — ― 〜 ・ ･ ,， 、､ ;； :： !！ ?？ .． ‥ … 。｡ ＇＼ ‘ ’ "＂ “ ” (（ )） [［ ]］ {｛ }｝ 〈 〉 《 》 「｢ 」｣ 『 』 【 】 〔 〕 ‖ § ¶ @＠ +＋ ^＾ $＄ *＊ /／ ＼\\ &＆ #＃ %％ ‰ † ‡ ′ ″ 〃 ※'))
      .toEqual('‾ ＿＿ ─－ ‐ — ― 〜 ・ ・ ，， 、、 ；； ：： ！！ ？？ ．． ‥ … 。。 ＇＼ ‘ ’ ＂＂ “ ” （（ ）） ［［ ］］ ｛｛ ｝｝ 〈 〉 《 》 「「 」」 『 』 【 】 〔 〕 ‖ § ¶ ＠＠ ＋＋ ＾＾ ＄＄ ＊＊ ／／ ＼＼ ＆＆ ＃＃ ％％ ‰ † ‡ ′ ″ 〃 ※');
  });

  it('should replace repeat characters', function() {
    expect(normalize_ja('時々刻々')).toEqual('時時刻刻');
    expect(normalize_ja('甲斐々々しい')).toEqual('甲斐甲斐しい');
  });

  it('should replace composite symbols', function() {
    expect(normalize_ja('㍼54年㋃㏪')).toEqual('昭和54年4月11日');
    expect(normalize_ja('㍧~㍬')).toEqual('15点～20点');
    expect(normalize_ja('カンパニー㍿')).toEqual('カンパニー株式会社');
    expect(normalize_ja('100㌫')).toEqual('100パーセント');
    expect(normalize_ja('70㌔')).toEqual('70キロ');
    expect(normalize_ja('㍇')).toEqual('マンション');
  });
});

var sample = 'ABC ＡＢＣ　123１２３.,-．，-ゔあいうえおはばぱｶｷｸｹｺﾊﾊﾞﾊﾟヴカキクケコハバパ';

describe('converters', function() {
  it('should all be reversible', function() {
    var sample = '半角カナ（はんかくカナ）とは、JIS X 0208など片仮名を含む他の文字集合と同時に運用される場合におけるJIS X 0201の片仮名文字集合の通称である。漢字を含む文字集合で定義された片仮名に対して、半分の文字幅で表示されることが一般的であったためこのように呼ばれる。JIS X 0201で規定される8ビット符号化およびShift_JISにおいて0xA1-0xDFの範囲の1バイト文字がこれにあたる。また、Shift_JISやEUC-JPなどの符号化方式やUnicodeでも互換性の目的でこの文字集合をもっている。';
    expect(converters.halfwidthToFullwidth.alphabet(converters.fullwidthToHalfwidth.alphabet(sample))).toEqual(converters.halfwidthToFullwidth.alphabet(sample));
    expect(converters.fullwidthToHalfwidth.alphabet(converters.halfwidthToFullwidth.alphabet(sample))).toEqual(converters.fullwidthToHalfwidth.alphabet(sample));
    expect(converters.halfwidthToFullwidth.numbers(converters.fullwidthToHalfwidth.numbers(sample))).toEqual(converters.halfwidthToFullwidth.numbers(sample));
    expect(converters.fullwidthToHalfwidth.numbers(converters.halfwidthToFullwidth.numbers(sample))).toEqual(converters.fullwidthToHalfwidth.numbers(sample));
    expect(converters.halfwidthToFullwidth.punctuation(converters.fullwidthToHalfwidth.punctuation(sample))).toEqual(converters.halfwidthToFullwidth.punctuation(sample));
    expect(converters.fullwidthToHalfwidth.punctuation(converters.halfwidthToFullwidth.punctuation(sample))).toEqual(converters.fullwidthToHalfwidth.punctuation(sample));
    expect(converters.halfwidthToFullwidth.katakana(converters.fullwidthToHalfwidth.katakana(sample))).toEqual(converters.halfwidthToFullwidth.katakana(sample));
    expect(converters.fullwidthToHalfwidth.katakana(converters.halfwidthToFullwidth.katakana(sample))).toEqual(converters.fullwidthToHalfwidth.katakana(sample));
  });

  describe('.fullwidthToHalfwidth', function() {
    describe('.alphabet', function() {
      it('should transform fullwidth roman characters and space to halfwidth', function() {
        expect(converters.fullwidthToHalfwidth.alphabet(sample)).toEqual('ABC ABC 123１２３.,-．，-ゔあいうえおはばぱｶｷｸｹｺﾊﾊﾞﾊﾟヴカキクケコハバパ');
      });
    });

    describe('.numbers', function() {
      it('should transform fullwidth numerical characters to halfwidth', function() {
        expect(converters.fullwidthToHalfwidth.numbers(sample)).toEqual('ABC ＡＢＣ　123123.,-．，-ゔあいうえおはばぱｶｷｸｹｺﾊﾊﾞﾊﾟヴカキクケコハバパ');
      });
    });

    describe('.punctuation', function() {
      it('should transform fullwidth punctuation signs to halfwidth', function() {
        expect(converters.fullwidthToHalfwidth.punctuation(sample)).toEqual('ABC ＡＢＣ　123１２３.,-.,-ゔあいうえおはばぱｶｷｸｹｺﾊﾊﾞﾊﾟヴカキクケコハバパ');
      });
    });

    describe('.katakana', function() {
      it('should transform fullwidth katakana to halfwidth', function() {
        expect(converters.fullwidthToHalfwidth.katakana(sample)).toEqual('ABC ＡＢＣ　123１２３.,-．，-ゔあいうえおはばぱｶｷｸｹｺﾊﾊﾞﾊﾟｳﾞｶｷｸｹｺﾊﾊﾞﾊﾟ');
      });
    });
  });

  describe('.halfwidthToFullwidth', function() {
    describe('.alphabet', function() {
      it('should transform halfwidth roman characters and space to fullwidth', function() {
        expect(converters.halfwidthToFullwidth.alphabet(sample)).toEqual('ＡＢＣ　ＡＢＣ　123１２３.,-．，-ゔあいうえおはばぱｶｷｸｹｺﾊﾊﾞﾊﾟヴカキクケコハバパ');
      });
    });

    describe('.numbers', function() {
      it('should transform halfwidth numerical characters to fullwidth', function() {
        expect(converters.halfwidthToFullwidth.numbers(sample)).toEqual('ABC ＡＢＣ　１２３１２３.,-．，-ゔあいうえおはばぱｶｷｸｹｺﾊﾊﾞﾊﾟヴカキクケコハバパ');
      });
    });

    describe('.punctuation', function() {
      it('should transform halfwidth punctuation signs to fullwidth', function() {
        expect(converters.halfwidthToFullwidth.punctuation(sample)).toEqual('ABC ＡＢＣ　123１２３．，─．，─ゔあいうえおはばぱｶｷｸｹｺﾊﾊﾞﾊﾟヴカキクケコハバパ');
      });
    });

    describe('.katakana', function() {
      it('should transform halfwidth katakana to fullwidth', function() {
        expect(converters.halfwidthToFullwidth.katakana(sample)).toEqual('ABC ＡＢＣ　123１２３.,-．，-ゔあいうえおはばぱカキクケコハバパヴカキクケコハバパ');
      });
    });
  });

  describe('.hiraganaToKatakana', function() {
    it('should transform hiragana to katakana', function() {
      expect(converters.hiraganaToKatakana(sample)).toEqual('ABC ＡＢＣ　123１２３.,-．，-ヴアイウエオハバパカキクケコハバパヴカキクケコハバパ');
    });
  });

  describe('.katakanaToHiragana', function() {
    it('should transform katakana to hiragana', function() {
      expect(converters.katakanaToHiragana(sample)).toEqual('ABC ＡＢＣ　123１２３.,-．，-ゔあいうえおはばぱかきくけこはばぱゔかきくけこはばぱ');
    });
  });
});
