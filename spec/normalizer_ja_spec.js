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
      .toEqual('‾ ＿＿ ─－ ‐ — ― 〜 ・ ・ ，， 、、 ；； ：： ！！ ？？ ．． ‥ … 。。 ＇＼ ‘ ’ ＂＂ “ ” （（ ）） ［［ ］］ ｛｛ ｝｝ 〈 〉 《 》 ｢｢ ｣｣ 『 』 【 】 〔 〕 ‖ § ¶ ＠＠ ＋＋ ＾＾ ＄＄ ＊＊ ／／ ＼＼ ＆＆ ＃＃ ％％ ‰ † ‡ ′ ″ 〃 ※');
  });
});

var sample = 'ABC ＡＢＣ　123１２３.,-．，-あいうえおはばぱｶｷｸｹｺﾊﾊﾞﾊﾟカキクケコハバパ';

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
        expect(converters.fullwidthToHalfwidth.alphabet(sample)).toEqual('ABC ABC 123１２３.,-．，-あいうえおはばぱｶｷｸｹｺﾊﾊﾞﾊﾟカキクケコハバパ');
      });
    });

    describe('.numbers', function() {
      it('should transform fullwidth numerical characters to halfwidth', function() {
        expect(converters.fullwidthToHalfwidth.numbers(sample)).toEqual('ABC ＡＢＣ　123123.,-．，-あいうえおはばぱｶｷｸｹｺﾊﾊﾞﾊﾟカキクケコハバパ');
      });
    });

    describe('.punctuation', function() {
      it('should transform fullwidth punctuation signs to halfwidth', function() {
        expect(converters.fullwidthToHalfwidth.punctuation(sample)).toEqual('ABC ＡＢＣ　123１２３.,-.,-あいうえおはばぱｶｷｸｹｺﾊﾊﾞﾊﾟカキクケコハバパ');
      });
    });

    describe('.katakana', function() {
      it('should transform fullwidth katakana to halfwidth', function() {
        expect(converters.fullwidthToHalfwidth.katakana(sample)).toEqual('ABC ＡＢＣ　123１２３.,-．，-あいうえおはばぱｶｷｸｹｺﾊﾊﾞﾊﾟｶｷｸｹｺﾊﾊﾞﾊﾟ');
      });
    });
  });

  describe('.halfwidthToFullwidth', function() {
    describe('.alphabet', function() {
      it('should transform halfwidth roman characters and space to fullwidth', function() {
        expect(converters.halfwidthToFullwidth.alphabet(sample)).toEqual('ＡＢＣ　ＡＢＣ　123１２３.,-．，-あいうえおはばぱｶｷｸｹｺﾊﾊﾞﾊﾟカキクケコハバパ');
      });
    });

    describe('.numbers', function() {
      it('should transform halfwidth numerical characters to fullwidth', function() {
        expect(converters.halfwidthToFullwidth.numbers(sample)).toEqual('ABC ＡＢＣ　１２３１２３.,-．，-あいうえおはばぱｶｷｸｹｺﾊﾊﾞﾊﾟカキクケコハバパ');
      });
    });

    describe('.punctuation', function() {
      it('should transform halfwidth punctuation signs to fullwidth', function() {
        expect(converters.halfwidthToFullwidth.punctuation(sample)).toEqual('ABC ＡＢＣ　123１２３．，─．，─あいうえおはばぱｶｷｸｹｺﾊﾊﾞﾊﾟカキクケコハバパ');
      });
    });

    describe('.katakana', function() {
      it('should transform halfwidth katakana to fullwidth', function() {
        expect(converters.halfwidthToFullwidth.katakana(sample)).toEqual('ABC ＡＢＣ　123１２３.,-．，-あいうえおはばぱカキクケコハバパカキクケコハバパ');
      });
    });
  });
});
