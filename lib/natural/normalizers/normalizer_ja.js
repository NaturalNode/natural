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

/**
 * Normalize Japanese inputs and expose function to perform several conversions.
 *
 * Note: The space character is treated like a roman character as it usually
 *   has the same width as them in Japanese texts.
 *
 * \@todo Replace characters range from ㈠ to ㉃, ㊀ to ㊰ and ㇰ to ㇿ.
 * \@todo Lazy initializations of conversionTables and converters.
 * \@todo Would fixHalfwidthKana be useful?
 *
 * Descriptions of functions exposed:
 * normalizeJapanese 「全角」英字・数字を「半角」、「半角」記・カタカナを「全角」に変換
 * converters.fullwidthToHalfwidth.alphabet    「全角」英字を「半角」に変換
 * converters.halfwidthToFullwidth.alphabet    「半角」英字を「全角」に変換
 * converters.fullwidthToHalfwidth.numbers     「全角」数字を「半角」に変換
 * converters.halfwidthToFullwidth.numbers     「半角」数字を「全角」に変換 「全角」スペースを「半角」
 * converters.fullwidthToHalfwidth.punctuation 「全角」記号を「半角」に変換 「半角」スペースを「全角」
 * converters.halfwidthToFullwidth.punctuation 「半角」記号を「全角」に変換
 * converters.fullwidthToHalfwidth.katakana    「全角カタカナ」を「半角カタカナ」に変換
 * converters.halfwidthToFullwidth.katakana    「半角カタカナ」を「全角カタカナ」に変換
 * converters.hiraganaToKatakana               「カタカナ」を「ひらがな」に変換
 * converters.katakanaToHiragana               「ひらがな」を「カタカナ」に変換
 */

const flip = require('../util/utils.js').flip
const merge = require('../util/utils.js').merge
const replacer = require('../util/utils.js').replacer

// From http://fernweh.jp/b/mb_convert_kana_js/
const conversionTables = {
  fullwidthToHalfwidth: {
    alphabet: {
      ａ: 'a',
      ｂ: 'b',
      ｃ: 'c',
      ｄ: 'd',
      ｅ: 'e',
      ｆ: 'f',
      ｇ: 'g',
      ｈ: 'h',
      ｉ: 'i',
      ｊ: 'j',
      ｋ: 'k',
      ｌ: 'l',
      ｍ: 'm',
      ｎ: 'n',
      ｏ: 'o',
      ｐ: 'p',
      ｑ: 'q',
      ｒ: 'r',
      ｓ: 's',
      ｔ: 't',
      ｕ: 'u',
      ｖ: 'v',
      ｗ: 'w',
      ｘ: 'x',
      ｙ: 'y',
      ｚ: 'z',
      Ａ: 'A',
      Ｂ: 'B',
      Ｃ: 'C',
      Ｄ: 'D',
      Ｅ: 'E',
      Ｆ: 'F',
      Ｇ: 'G',
      Ｈ: 'H',
      Ｉ: 'I',
      Ｊ: 'J',
      Ｋ: 'K',
      Ｌ: 'L',
      Ｍ: 'M',
      Ｎ: 'N',
      Ｏ: 'O',
      Ｐ: 'P',
      Ｑ: 'Q',
      Ｒ: 'R',
      Ｓ: 'S',
      Ｔ: 'T',
      Ｕ: 'U',
      Ｖ: 'V',
      Ｗ: 'W',
      Ｘ: 'X',
      Ｙ: 'Y',
      Ｚ: 'Z',
      '　': ' ' // Fullwidth space
    },

    numbers: {
      '０': '0',
      '１': '1',
      '２': '2',
      '３': '3',
      '４': '4',
      '５': '5',
      '６': '6',
      '７': '7',
      '８': '8',
      '９': '9'
    },

    symbol: {
      '＿': '_',
      '－': '-',
      '，': ',',
      '；': ';',
      '：': ':',
      '！': '!',
      '？': '?',
      '．': '.',
      '（': '(',
      '）': ')',
      '［': '[',
      '］': ']',
      '｛': '{',
      '｝': '}',
      '＠': '@',
      '＊': '*',
      '＼': '\\',
      '／': '/',
      '＆': '&',
      '＃': '#',
      '％': '%',
      '｀': '`',
      '＾': '^',
      '＋': '+',
      '＜': '<',
      '＝': '=',
      '＞': '>',
      '｜': '|',
      // Never converted: '～': '~',
      '≪': '«',
      '≫': '»',
      '─': '-',
      '＄': '$',
      '＂': '"'
    },

    purePunctuation: {
      '、': '､',
      '。': '｡',
      '・': '･',
      '「': '｢',
      '」': '｣'
    },

    punctuation: {},

    katakana: {
      ゛: 'ﾞ',
      ゜: 'ﾟ',
      ー: 'ｰ',

      ヴ: 'ｳﾞ',
      ガ: 'ｶﾞ',
      ギ: 'ｷﾞ',
      グ: 'ｸﾞ',
      ゲ: 'ｹﾞ',
      ゴ: 'ｺﾞ',
      ザ: 'ｻﾞ',
      ジ: 'ｼﾞ',
      ズ: 'ｽﾞ',
      ゼ: 'ｾﾞ',
      ゾ: 'ｿﾞ',
      ダ: 'ﾀﾞ',
      ヂ: 'ﾁﾞ',
      ヅ: 'ﾂﾞ',
      デ: 'ﾃﾞ',
      ド: 'ﾄﾞ',
      バ: 'ﾊﾞ',
      パ: 'ﾊﾟ',
      ビ: 'ﾋﾞ',
      ピ: 'ﾋﾟ',
      ブ: 'ﾌﾞ',
      プ: 'ﾌﾟ',
      ベ: 'ﾍﾞ',
      ペ: 'ﾍﾟ',
      ボ: 'ﾎﾞ',
      ポ: 'ﾎﾟ',

      ァ: 'ｧ',
      ア: 'ｱ',
      ィ: 'ｨ',
      イ: 'ｲ',
      ゥ: 'ｩ',
      ウ: 'ｳ',
      ェ: 'ｪ',
      エ: 'ｴ',
      ォ: 'ｫ',
      オ: 'ｵ',
      カ: 'ｶ',
      キ: 'ｷ',
      ク: 'ｸ',
      ケ: 'ｹ',
      コ: 'ｺ',
      サ: 'ｻ',
      シ: 'ｼ',
      ス: 'ｽ',
      セ: 'ｾ',
      ソ: 'ｿ',
      タ: 'ﾀ',
      チ: 'ﾁ',
      ッ: 'ｯ',
      ツ: 'ﾂ',
      テ: 'ﾃ',
      ト: 'ﾄ',
      ナ: 'ﾅ',
      ニ: 'ﾆ',
      ヌ: 'ﾇ',
      ネ: 'ﾈ',
      ノ: 'ﾉ',
      ハ: 'ﾊ',
      ヒ: 'ﾋ',
      フ: 'ﾌ',
      ヘ: 'ﾍ',
      ホ: 'ﾎ',
      マ: 'ﾏ',
      ミ: 'ﾐ',
      ム: 'ﾑ',
      メ: 'ﾒ',
      モ: 'ﾓ',
      ャ: 'ｬ',
      ヤ: 'ﾔ',
      ュ: 'ｭ',
      ユ: 'ﾕ',
      ョ: 'ｮ',
      ヨ: 'ﾖ',
      ラ: 'ﾗ',
      リ: 'ﾘ',
      ル: 'ﾙ',
      レ: 'ﾚ',
      ロ: 'ﾛ',
      ワ: 'ﾜ',
      ヲ: 'ｦ',
      ン: 'ﾝ'
    }
  },

  halfwidthToFullwidth: {}
}

const fixFullwidthKana = {
  ゝ゛: 'ゞ',
  ヽ゛: 'ヾ',

  う゛: 'ゔ',
  か゛: 'が',
  き゛: 'ぎ',
  く゛: 'ぐ',
  け゛: 'げ',
  こ゛: 'ご',
  さ゛: 'ざ',
  し゛: 'じ',
  す゛: 'ず',
  せ゛: 'ぜ',
  そ゛: 'ぞ',
  た゛: 'だ',
  ち゛: 'ぢ',
  つ゛: 'づ',
  て゛: 'で',
  と゛: 'ど',
  は゛: 'ば',
  は゜: 'ぱ',
  ひ゛: 'び',
  ひ゜: 'ぴ',
  ふ゛: 'ぶ',
  ふ゜: 'ぷ',
  へ゛: 'べ',
  へ゜: 'ぺ',
  ほ゛: 'ぼ',
  ほ゜: 'ぽ',
  っな: 'んな',
  っに: 'んに',
  っぬ: 'んぬ',
  っね: 'んね',
  っの: 'んの',

  ウ゛: 'ヴ',
  カ゛: 'ガ',
  キ゛: 'ギ',
  ク゛: 'グ',
  ケ゛: 'ゲ',
  コ゛: 'ゴ',
  サ゛: 'ザ',
  シ゛: 'ジ',
  ス゛: 'ズ',
  セ゛: 'ゼ',
  ソ゛: 'ゾ',
  タ゛: 'ダ',
  チ゛: 'ヂ',
  ツ゛: 'ヅ',
  テ゛: 'デ',
  ト゛: 'ド',
  ハ゛: 'バ',
  ハ゜: 'パ',
  ヒ゛: 'ビ',
  ヒ゜: 'ピ',
  フ゛: 'ブ',
  フ゜: 'プ',
  ヘ゛: 'ベ',
  ヘ゜: 'ペ',
  ホ゛: 'ボ',
  ホ゜: 'ポ',
  ッナ: 'ンナ',
  ッニ: 'ンニ',
  ッヌ: 'ンヌ',
  ッネ: 'ンネ',
  ッノ: 'ンノ'
}

const fixCompositeSymbolsTable = {
  '㋀': '1月',
  '㋁': '2月',
  '㋂': '3月',
  '㋃': '4月',
  '㋄': '5月',
  '㋅': '6月',
  '㋆': '7月',
  '㋇': '8月',
  '㋈': '9月',
  '㋉': '10月',
  '㋊': '11月',
  '㋋': '12月',

  '㏠': '1日',
  '㏡': '2日',
  '㏢': '3日',
  '㏣': '4日',
  '㏤': '5日',
  '㏥': '6日',
  '㏦': '7日',
  '㏧': '8日',
  '㏨': '9日',
  '㏩': '10日',
  '㏪': '11日',
  '㏫': '12日',
  '㏬': '13日',
  '㏭': '14日',
  '㏮': '15日',
  '㏯': '16日',
  '㏰': '17日',
  '㏱': '18日',
  '㏲': '19日',
  '㏳': '20日',
  '㏴': '21日',
  '㏵': '22日',
  '㏶': '23日',
  '㏷': '24日',
  '㏸': '25日',
  '㏹': '26日',
  '㏺': '27日',
  '㏻': '28日',
  '㏼': '29日',
  '㏽': '30日',
  '㏾': '31日',

  '㍘': '0点',
  '㍙': '1点',
  '㍚': '2点',
  '㍛': '3点',
  '㍜': '4点',
  '㍝': '5点',
  '㍞': '6点',
  '㍟': '7点',
  '㍠': '8点',
  '㍡': '9点',
  '㍢': '10点',
  '㍣': '11点',
  '㍤': '12点',
  '㍥': '13点',
  '㍦': '14点',
  '㍧': '15点',
  '㍨': '16点',
  '㍩': '17点',
  '㍪': '18点',
  '㍫': '19点',
  '㍬': '20点',
  '㍭': '21点',
  '㍮': '22点',
  '㍯': '23点',
  '㍰': '24点',

  '㍻': '平成',
  '㍼': '昭和',
  '㍽': '大正',
  '㍾': '明治',
  '㍿': '株式会社',

  '㌀': 'アパート',
  '㌁': 'アルファ',
  '㌂': 'アンペア',
  '㌃': 'アール',
  '㌄': 'イニング',
  '㌅': 'インチ',
  '㌆': 'ウオン',
  '㌇': 'エスクード',
  '㌈': 'エーカー',
  '㌉': 'オンス',
  '㌊': 'オーム',
  '㌋': 'カイリ', // 海里
  '㌌': 'カラット',
  '㌍': 'カロリー',
  '㌎': 'ガロン',
  '㌏': 'ガンマ',
  '㌐': 'ギガ',
  '㌑': 'ギニー',
  '㌒': 'キュリー',
  '㌓': 'ギルダー',
  '㌔': 'キロ',
  '㌕': 'キログラム',
  '㌖': 'キロメートル',
  '㌗': 'キロワット',
  '㌘': 'グラム',
  '㌙': 'グラムトン',
  '㌚': 'クルゼイロ',
  '㌛': 'クローネ',
  '㌜': 'ケース',
  '㌝': 'コルナ',
  '㌞': 'コーポ',
  '㌟': 'サイクル',
  '㌠': 'サンチーム',
  '㌡': 'シリング',
  '㌢': 'センチ',
  '㌣': 'セント',
  '㌤': 'ダース',
  '㌥': 'デシ',
  '㌦': 'ドル',
  '㌧': 'トン',
  '㌨': 'ナノ',
  '㌩': 'ノット',
  '㌪': 'ハイツ',
  '㌫': 'パーセント',
  '㌬': 'パーツ',
  '㌭': 'バーレル',
  '㌮': 'ピアストル',
  '㌯': 'ピクル',
  '㌰': 'ピコ',
  '㌱': 'ビル',
  '㌲': 'ファラッド',
  '㌳': 'フィート',
  '㌴': 'ブッシェル',
  '㌵': 'フラン',
  '㌶': 'ヘクタール',
  '㌷': 'ペソ',
  '㌸': 'ペニヒ',
  '㌹': 'ヘルツ',
  '㌺': 'ペンス',
  '㌻': 'ページ',
  '㌼': 'ベータ',
  '㌽': 'ポイント',
  '㌾': 'ボルト',
  '㌿': 'ホン',
  '㍀': 'ポンド',
  '㍁': 'ホール',
  '㍂': 'ホーン',
  '㍃': 'マイクロ',
  '㍄': 'マイル',
  '㍅': 'マッハ',
  '㍆': 'マルク',
  '㍇': 'マンション',
  '㍈': 'ミクロン',
  '㍉': 'ミリ',
  '㍊': 'ミリバール',
  '㍋': 'メガ',
  '㍌': 'メガトン',
  '㍍': 'メートル',
  '㍎': 'ヤード',
  '㍏': 'ヤール',
  '㍐': 'ユアン',
  '㍑': 'リットル',
  '㍒': 'リラ',
  '㍓': 'ルピー',
  '㍔': 'ルーブル',
  '㍕': 'レム',
  '㍖': 'レントゲン',
  '㍗': 'ワット'
}

// punctuation is pure_punctuation
conversionTables.fullwidthToHalfwidth.punctuation = merge(
  conversionTables.fullwidthToHalfwidth.symbol,
  conversionTables.fullwidthToHalfwidth.purePunctuation
)

// Fill in the conversion tables with the flipped tables.
conversionTables.halfwidthToFullwidth.alphabet = flip(conversionTables.fullwidthToHalfwidth.alphabet)
conversionTables.halfwidthToFullwidth.numbers = flip(conversionTables.fullwidthToHalfwidth.numbers)
conversionTables.halfwidthToFullwidth.symbol = flip(conversionTables.fullwidthToHalfwidth.symbol)
conversionTables.halfwidthToFullwidth.purePunctuation = flip(conversionTables.fullwidthToHalfwidth.purePunctuation)
conversionTables.halfwidthToFullwidth.punctuation = flip(conversionTables.fullwidthToHalfwidth.punctuation)
conversionTables.halfwidthToFullwidth.katakana = flip(conversionTables.fullwidthToHalfwidth.katakana)

// Build the normalization table.
conversionTables.normalize = merge(
  conversionTables.fullwidthToHalfwidth.alphabet,
  conversionTables.fullwidthToHalfwidth.numbers,
  conversionTables.fullwidthToHalfwidth.symbol,
  conversionTables.halfwidthToFullwidth.purePunctuation,
  conversionTables.halfwidthToFullwidth.katakana
)

class Converters {
  alphabetFH (str) {
    return replacer(conversionTables.fullwidthToHalfwidth.alphabet)(str)
  }

  numbersFH (str) {
    return replacer(conversionTables.fullwidthToHalfwidth.numbers)(str)
  }

  symbolFH (str) {
    return replacer(conversionTables.fullwidthToHalfwidth.symbol)(str)
  }

  purePunctuationFH (str) {
    return replacer(conversionTables.fullwidthToHalfwidth.purePunctuation)(str)
  }

  punctuationFH (str) {
    return replacer(conversionTables.fullwidthToHalfwidth.punctuation)(str)
  }

  katakanaFH (str) {
    return replacer(conversionTables.fullwidthToHalfwidth.katakana)(str)
  }

  static fixFullwidthKana (str) {
    return replacer(fixFullwidthKana)(str)
  }

  static normalize (str) {
    return replacer(conversionTables.normalize)(str)
  }

  alphabetHF (str) {
    return replacer(conversionTables.halfwidthToFullwidth.alphabet)(str)
  }

  numbersHF (str) {
    return replacer(conversionTables.halfwidthToFullwidth.numbers)(str)
  }

  symbolHF (str) {
    return replacer(conversionTables.halfwidthToFullwidth.symbol)(str)
  }

  purePunctuationHF (str) {
    return replacer(conversionTables.halfwidthToFullwidth.purePunctuation)(str)
  }

  punctuationHF (str) {
    return replacer(conversionTables.halfwidthToFullwidth.punctuation)(str)
  }

  katakanaHF (str) {
    return replacer(conversionTables.halfwidthToFullwidth.katakana)(str)
  }

  static fixCompositeSymbols (str) {
    return replacer(fixCompositeSymbolsTable)(str)
  }

  /**
   * Convert hiragana to fullwidth katakana.
   * According to http://jsperf.com/converting-japanese, these implementations are
   * faster than using lookup tables.
   *
   * @param {string} str A string.
   * @return {string} A string not containing hiragana.
   */
  hiraganaToKatakana (str) {
    str = this.katakanaHF(str)
    str = Converters.fixFullwidthKana(str)

    str = str.replace(/ゝ/g, 'ヽ')
    str = str.replace(/ゞ/g, 'ヾ')
    // str = str.replace(/?/g, '𛀀'); // Letter archaic E

    str = str.replace(/[ぁ-ゖ]/g, function (str) {
      return String.fromCharCode(str.charCodeAt(0) + 96)
    })

    return str
  }

  /**
   * Convert katakana to hiragana.
   *
   * @param {string} str A string.
   * @return {string} A string not containing katakana.
   */
  katakanaToHiragana (str) {
    str = this.katakanaHF(str)
    str = Converters.fixFullwidthKana(str)

    str = str.replace(/ヽ/g, 'ゝ')
    str = str.replace(/ヾ/g, 'ゞ')
    // str = str.replace(/?/g, '𛀁'); // Letter archaic E

    str = str.replace(/[ァ-ヶ]/g, function (str) {
      return String.fromCharCode(str.charCodeAt(0) - 96)
    })

    return str
  }
}

/**
 * Fix kana and apply the following processes;
 * * Replace repeat characters
 * * Alphabet to halfwidth
 * * Numbers to halfwidth
 * * Punctuation to fullwidth
 * * Katakana to fullwidth
 * * Fix fullwidth kana
 * * Replace composite symbols
 *
 * @param {string} str
 * @return {string}
 */
const normalizeJa = function (str) {
  // Replace repeat characters.
  str = str
    .replace(/(..)々々/g, '$1$1')
    .replace(/(.)々/g, '$1$1')

  str = Converters.normalize(str)
  str = Converters.fixFullwidthKana(str)

  // Replace composite symbols.
  str = Converters.fixCompositeSymbols(str)

  return str
}

exports.normalizeJa = normalizeJa
exports.Converters = Converters
