var normalizeJapanese = require('lib/natural/normalizers/normalizer_ja').normalizeJapanese;
var replacers = require('lib/natural/normalizers/normalizer_ja').replacers;

describe('normalizeJapanese', function() {
  it('should fix badly formatted hiragana', function() {
    expect(normalizeJapanese('う゛か゛き゛く゛は゜ひ゜ふ゜')).toEqual('ゔがぎぐぱぴぷ');
    expect(normalizeJapanese('うﾞかﾞきﾞくﾞはﾟひﾟふﾟ')).toEqual('ゔがぎぐぱぴぷ');
  });

  it('should fix badly formatted fullwidth katakana', function() {
    expect(normalizeJapanese('ウ゛カ゛キ゛ク゛ハ゜ヒ゜フ゜')).toEqual('ヴガギグパピプ');
    expect(normalizeJapanese('ウﾞカﾞキﾞクﾞハﾟヒﾟフﾟ')).toEqual('ヴガギグパピプ');
  });

  it('should fix badly formatted halfwidth katakana', function() {
    expect(normalizeJapanese('ｳ゛ｶ゛ｷ゛ｸ゛ﾊ゜ﾋ゜ﾌ゜')).toEqual('ヴガギグパピプ');
    expect(normalizeJapanese('ｳﾞｶﾞｷﾞｸﾞﾊﾟﾋﾟﾌﾟ')).toEqual('ヴガギグパピプ');
  });

  it('should transform halfwidth katakana to fullwidth', function() {
    expect(normalizeJapanese('ｶﾀｶﾅ')).toEqual('カタカナ');
  });

  it('should transform fullwidth alphanumerical characters to halfwidth', function() {
    expect(normalizeJapanese('ＡＢＣ１２３')).toEqual('ABC123');
  });

  it('should transform fullwidth spaces to halfwidth', function() {
    expect(normalizeJapanese('空　空　空')).toEqual('空 空 空');
  });

  it('should transform halfwidth punctuation to fullwidth', function() {
    // Taken from http://unicode.org/cldr/trac/browser/trunk/common/main/ja.xml
    expect(normalizeJapanese('‾ _＿ -－ ‐ — ― 〜 ・ ･ ,， 、､ ;； :： !！ ?？ .． ‥ … 。｡ ＇＼ ‘ ’ "＂ “ ” (（ )） [［ ]］ {｛ }｝ 〈 〉 《 》 「｢ 」｣ 『 』 【 】 〔 〕 ‖ § ¶ @＠ *＊ /／ ＼\\ &＆ #＃ %％ ‰ † ‡ ′ ″ 〃 ※'))
      .toEqual('‾ ＿＿ ─－ ‐ — ― 〜 ・ ・ ，， 、、 ；； ：： ！！ ？？ ．． ‥ … 。。 ＇＼ ‘ ’ ＂＂ “ ” （（ ）） ［［ ］］ ｛｛ ｝｝ 〈 〉 《 》 ｢｢ ｣｣ 『 』 【 】 〔 〕 ‖ § ¶ ＠＠ ＊＊ ／／ ＼＼ ＆＆ ＃＃ ％％ ‰ † ‡ ′ ″ 〃 ※');
  });
});
