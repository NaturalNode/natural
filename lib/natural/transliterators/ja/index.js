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
 * A transliteration of Katakana & Hiragana to roman characters using the
 * modified Hepburn system.
 * Rules based on CLDR transform rule set `Katakana-Latin-BGN.xml` but with
 * several bugs fixed:
 *  * Missing ū
 *  * Missing tsu + voiced kana
 *  * typos on my~ transliterations
 *  * support for long vowel sign
 *  * support for final small tsu
 *  * support for u + small vowels
 *  * support for su/shi/ji + small vowels
 *  * support for tchi/tsu/te/to + small vowels
 *  * support for fu + small vowels
 *  * support for katakana middle dot
 *
 * \@todo Take iteration marks into account.
 */

const replacer = require('../../util/utils').replacer

const transliterationTable1 = {
  ウァ: 'wa', // KATAKANA LETTER U + SMALL A
  ウィ: 'wi', // KATAKANA LETTER U + SMALL I
  ウェ: 'we', // KATAKANA LETTER U + SMALL E
  ウォ: 'wo', // KATAKANA LETTER U + SMALL O
  ウー: 'ū', // KATAKANA LETTER VU + PROLONGED SOUND MARK

  ヴァ: 'va', // KATAKANA LETTER VU + SMALL A
  ヴィ: 'vi', // KATAKANA LETTER VU + SMALL I
  ヴェ: 've', // KATAKANA LETTER VU + SMALL E
  ヴォ: 'vo', // KATAKANA LETTER VU + SMALL O
  ヴュ: 'vyu', // KATAKANA LETTER VU + SMALL YU

  うぁ: 'wa', // HIRAGANA LETTER U + SMALL A
  うぃ: 'wi', // HIRAGANA LETTER U + SMALL I
  うぇ: 'we', // HIRAGANA LETTER U + SMALL E
  うぉ: 'wo', // HIRAGANA LETTER U + SMALL O
  うー: 'ū', // HIRAGANA LETTER VU + PROLONGED SOUND MARK

  ゔぁ: 'va', // HIRAGANA LETTER VU + SMALL A
  ゔぃ: 'vi', // HIRAGANA LETTER VU + SMALL I
  ゔぇ: 've', // HIRAGANA LETTER VU + SMALL E
  ゔぉ: 'vo', // HIRAGANA LETTER VU + SMALL O
  ゔゅ: 'vyu' // HIRAGANA LETTER VU + SMALL YU
}

const transliterationTable2 = {
  イェ: 'ye', // KATAKANA LETTER I + SMALL E

  ア: 'a', // KATAKANA LETTER A
  イ: 'i', // KATAKANA LETTER I
  ウウ: 'ū', // KATAKANA LETTER U + U
  ウ: 'u', // KATAKANA LETTER U
  エ: 'e', // KATAKANA LETTER E
  オウ: 'ō', // KATAKANA LETTER O + U
  オ: 'o', // KATAKANA LETTER O

  クァ: 'kwa', // KATAKANA LETTER KU + SMALL A
  クィ: 'kwi', // KATAKANA LETTER KU + SMALL I
  クェ: 'kwe', // KATAKANA LETTER KU + SMALL E
  クォ: 'kwo', // KATAKANA LETTER KU + SMALL O

  カ: 'ka', // KATAKANA LETTER KA
  キョウ: 'kyō', // KATAKANA LETTER KI + SMALL YO + U
  キュウ: 'kyū', // KATAKANA LETTER KI + SMALL YU + U
  キャ: 'kya', // KATAKANA LETTER KI + SMALL YA
  キョ: 'kyo', // KATAKANA LETTER KI + SMALL YO
  キュ: 'kyu', // KATAKANA LETTER KI + SMALL YU
  キ: 'ki', // KATAKANA LETTER KI
  ク: 'ku', // KATAKANA LETTER KU
  ケ: 'ke', // KATAKANA LETTER KE
  コウ: 'kō', // KATAKANA LETTER KO + U
  コ: 'ko', // KATAKANA LETTER KO

  シェ: 'she', // KATAKANA LETTER SI + SMALL E
  スィ: 'si', // KATAKANA LETTER SU + SMALL I

  サ: 'sa', // KATAKANA LETTER SA
  ショウ: 'shō', // KATAKANA LETTER SI + SMALL YO + U
  シュウ: 'shū', // KATAKANA LETTER SI + SMALL YU + U
  シャ: 'sha', // KATAKANA LETTER SI + SMALL YA
  ショ: 'sho', // KATAKANA LETTER SI + SMALL YO
  シュ: 'shu', // KATAKANA LETTER SI + SMALL YU
  シ: 'shi', // KATAKANA LETTER SI
  スウ: 'sū', // KATAKANA LETTER SU + U
  ス: 'su', // KATAKANA LETTER SU
  セ: 'se', // KATAKANA LETTER SE
  ソウ: 'sō', // KATAKANA LETTER SO + U
  ソ: 'so', // KATAKANA LETTER SO

  チェ: 'che', // KATAKANA LETTER TI + SMALL E
  ツァ: 'tsa', // KATAKANA LETTER TU + SMALL A
  ツィ: 'tsi', // KATAKANA LETTER TU + SMALL I
  ツェ: 'tse', // KATAKANA LETTER TU + SMALL E
  ツォ: 'tso', // KATAKANA LETTER TU + SMALL O
  ティ: 'ti', // KATAKANA LETTER TE + SMALL I
  ディ: 'di', // KATAKANA LETTER DE + SMALL I
  テュ: 'tyu', // KATAKANA LETTER TE + SMALL YU
  デュ: 'dyu', // KATAKANA LETTER DE + SMALL YU
  トィ: 'twi', // KATAKANA LETTER TO + SMALL I
  トゥ: 'tu', // KATAKANA LETTER TO + SMALL U
  ドィ: 'dwi', // KATAKANA LETTER DO + SMALL I
  ドゥ: 'du', // KATAKANA LETTER DO + SMALL U

  タ: 'ta', // KATAKANA LETTER TA
  チョウ: 'chō', // KATAKANA LETTER TI + SMALL YO + U
  チュウ: 'chū', // KATAKANA LETTER TI + SMALL YU + U
  チャ: 'cha', // KATAKANA LETTER TI + SMALL YA
  チョ: 'cho', // KATAKANA LETTER TI + SMALL YO
  チュ: 'chu', // KATAKANA LETTER TI + SMALL YU
  チ: 'chi', // KATAKANA LETTER TI
  ツウ: 'tsū', // KATAKANA LETTER TU + U
  ツ: 'tsu', // KATAKANA LETTER TU
  テ: 'te', // KATAKANA LETTER TE
  トウ: 'tō', // KATAKANA LETTER TO + U
  ト: 'to', // KATAKANA LETTER TO

  ナ: 'na', // KATAKANA LETTER NA
  ニョウ: 'nyō', // KATAKANA LETTER NI + SMALL YO + U
  ニュウ: 'nyū', // KATAKANA LETTER NI + SMALL YU + U
  ニャ: 'nya', // KATAKANA LETTER NI + SMALL YA
  ニョ: 'nyo', // KATAKANA LETTER NI + SMALL YO
  ニュ: 'nyu', // KATAKANA LETTER NI + SMALL YU
  ニ: 'ni', // KATAKANA LETTER NI
  ヌウ: 'nū', // KATAKANA LETTER NU + U
  ヌ: 'nu', // KATAKANA LETTER NU
  ネ: 'ne', // KATAKANA LETTER NE
  ノウ: 'nō', // KATAKANA LETTER NO + U
  ノ: 'no', // KATAKANA LETTER NO

  ファ: 'fa', // KATAKANA LETTER HU + SMALL A
  フィ: 'fi', // KATAKANA LETTER HU + SMALL I
  // 'フゥ': 'fu', // KATAKANA LETTER HU + SMALL U
  フェ: 'fe', // KATAKANA LETTER HU + SMALL E
  フォ: 'fo', // KATAKANA LETTER HU + SMALL O
  フュ: 'fyu', // KATAKANA LETTER HU + SMALL YU
  ホェ: 'hwe', // KATAKANA LETTER HO + SMALL E

  ハ: 'ha', // KATAKANA LETTER HA
  ヒョウ: 'hyō', // KATAKANA LETTER HI + SMALL YO + U
  ヒュウ: 'hyū', // KATAKANA LETTER HI + SMALL YU + U
  ヒャ: 'hya', // KATAKANA LETTER HI + SMALL YA
  ヒョ: 'hyo', // KATAKANA LETTER HI + SMALL YO
  ヒュ: 'hyu', // KATAKANA LETTER HI + SMALL YU
  ヒ: 'hi', // KATAKANA LETTER HI
  フウ: 'fū', // KATAKANA LETTER HU + U
  フ: 'fu', // KATAKANA LETTER HU
  ヘ: 'he', // KATAKANA LETTER HE
  ホウ: 'hō', // KATAKANA LETTER HO + U
  ホ: 'ho', // KATAKANA LETTER HO

  マ: 'ma', // KATAKANA LETTER MA
  ミョウ: 'myō', // KATAKANA LETTER MI + SMALL YO + U
  ミュウ: 'myū', // KATAKANA LETTER MI + SMALL YU + U
  ミャ: 'mya', // KATAKANA LETTER MI + SMALL YA
  ミョ: 'myo', // KATAKANA LETTER MI + SMALL YO
  ミュ: 'myu', // KATAKANA LETTER MI + SMALL YU
  ミ: 'mi', // KATAKANA LETTER MI
  ムウ: 'mū', // KATAKANA LETTER MU + U
  ム: 'mu', // KATAKANA LETTER MU
  メ: 'me', // KATAKANA LETTER ME
  モウ: 'mō', // KATAKANA LETTER MO + U
  モ: 'mo', // KATAKANA LETTER MO

  ヤ: 'ya', // KATAKANA LETTER YA
  ユウ: 'yū', // KATAKANA LETTER YU + U
  ユ: 'yu', // KATAKANA LETTER YU
  ヨウ: 'yō', // KATAKANA LETTER YO + U
  ヨ: 'yo', // KATAKANA LETTER YO

  リェ: 'rye', // KATAKANA LETTER RI + SMALL E

  ラ: 'ra', // KATAKANA LETTER RA
  リョウ: 'ryō', // KATAKANA LETTER RI + SMALL YO + U
  リュウ: 'ryū', // KATAKANA LETTER RI + SMALL YU + U
  リャ: 'rya', // KATAKANA LETTER RI + SMALL YA
  リョ: 'ryo', // KATAKANA LETTER RI + SMALL YO
  リュ: 'ryu', // KATAKANA LETTER RI + SMALL YU
  リ: 'ri', // KATAKANA LETTER RI
  ルウ: 'rū', // KATAKANA LETTER RU + U
  ル: 'ru', // KATAKANA LETTER RU
  レ: 're', // KATAKANA LETTER RE
  ロウ: 'rō', // KATAKANA LETTER RO + U
  ロ: 'ro', // KATAKANA LETTER RO

  ワ: 'wa', // KATAKANA LETTER WA
  ヰ: 'i', // KATAKANA LETTER WI
  ヱ: 'e', // KATAKANA LETTER WE
  ヲ: 'o', // KATAKANA LETTER WO

  ン: 'n', // KATAKANA LETTER N

  グァ: 'gwa', // KATAKANA LETTER GU + SMALL A
  グィ: 'gwi', // KATAKANA LETTER GU + SMALL I
  グェ: 'gwe', // KATAKANA LETTER GU + SMALL E
  グォ: 'gwo', // KATAKANA LETTER GU + SMALL O

  ガ: 'ga', // KATAKANA LETTER GA
  ギョウ: 'gyō', // KATAKANA LETTER GI + SMALL YO + U
  ギュウ: 'gyū', // KATAKANA LETTER GI + SMALL YU + U
  ギャ: 'gya', // KATAKANA LETTER GI + SMALL YA
  ギョ: 'gyo', // KATAKANA LETTER GI + SMALL YO
  ギュ: 'gyu', // KATAKANA LETTER GI + SMALL YU
  ギ: 'gi', // KATAKANA LETTER GI
  グウ: 'gū', // KATAKANA LETTER GU + U
  グ: 'gu', // KATAKANA LETTER GU
  ゲ: 'ge', // KATAKANA LETTER GE
  ゴウ: 'gō', // KATAKANA LETTER GO + U
  ゴ: 'go', // KATAKANA LETTER GO

  ジェ: 'je', // KATAKANA LETTER ZI + SMALL E
  ズィ: 'zi', // KATAKANA LETTER ZU + SMALL I

  ザ: 'za', // KATAKANA LETTER ZA
  ジョウ: 'jō', // KATAKANA LETTER ZI + SMALL YO + U
  ジュウ: 'jū', // KATAKANA LETTER ZI + SMALL YU + U
  ジャ: 'ja', // KATAKANA LETTER ZI + SMALL YA
  ジョ: 'jo', // KATAKANA LETTER ZI + SMALL YO
  ジュ: 'ju', // KATAKANA LETTER ZI + SMALL YU
  ジ: 'ji', // KATAKANA LETTER ZI
  ズウ: 'zū', // KATAKANA LETTER ZU + U
  ズ: 'zu', // KATAKANA LETTER ZU
  ゼ: 'ze', // KATAKANA LETTER ZE
  ゾウ: 'zō', // KATAKANA LETTER ZO + U
  ゾ: 'zo', // KATAKANA LETTER ZO

  ダ: 'da', // KATAKANA LETTER DA
  ヂ: 'ji', // KATAKANA LETTER DI
  ヅウ: 'zū', // KATAKANA LETTER DU + U
  ヅ: 'zu', // KATAKANA LETTER DU
  デ: 'de', // KATAKANA LETTER DE
  ドウ: 'dō', // KATAKANA LETTER DO + U
  ド: 'do', // KATAKANA LETTER DO

  ブュ: 'byu', // KATAKANA LETTER BU + SMALL YU

  バ: 'ba', // KATAKANA LETTER BA
  ビョウ: 'byō', // KATAKANA LETTER BI + SMALL YO + U
  ビュウ: 'byū', // KATAKANA LETTER BI + SMALL YU + U
  ビャ: 'bya', // KATAKANA LETTER BI + SMALL YA
  ビョ: 'byo', // KATAKANA LETTER BI + SMALL YO
  ビュ: 'byu', // KATAKANA LETTER BI + SMALL YU
  ビ: 'bi', // KATAKANA LETTER BI
  ブウ: 'bū', // KATAKANA LETTER BU + U
  ブ: 'bu', // KATAKANA LETTER BU
  ベ: 'be', // KATAKANA LETTER BE
  ボウ: 'bō', // KATAKANA LETTER BO + U
  ボ: 'bo', // KATAKANA LETTER BO

  パ: 'pa', // KATAKANA LETTER PA
  ピョウ: 'pyō', // KATAKANA LETTER PI + SMALL YO + U
  ピュウ: 'pyū', // KATAKANA LETTER PI + SMALL YU + U
  ピャ: 'pya', // KATAKANA LETTER PI + SMALL YA
  ピョ: 'pyo', // KATAKANA LETTER PI + SMALL YO
  ピュ: 'pyu', // KATAKANA LETTER PI + SMALL YU
  ピ: 'pi', // KATAKANA LETTER PI
  プウ: 'pū', // KATAKANA LETTER PU + U
  プ: 'pu', // KATAKANA LETTER PU
  ペ: 'pe', // KATAKANA LETTER PE
  ポウ: 'pō', // KATAKANA LETTER PO + U
  ポ: 'po', // KATAKANA LETTER PO

  ヴ: 'v', // KATAKANA LETTER VU

  '・': ' ', // KATAKANA MIDDLE DOT

  いぇ: 'ye', // HIRAGANA LETTER I + SMALL E

  あ: 'a', // HIRAGANA LETTER A
  い: 'i', // HIRAGANA LETTER I
  うう: 'ū', // HIRAGANA LETTER U + U
  う: 'u', // HIRAGANA LETTER U
  え: 'e', // HIRAGANA LETTER E
  おう: 'ō', // HIRAGANA LETTER O + U
  お: 'o', // HIRAGANA LETTER O

  くぁ: 'kwa', // HIRAGANA LETTER KU + SMALL A
  くぃ: 'kwi', // HIRAGANA LETTER KU + SMALL I
  くぇ: 'kwe', // HIRAGANA LETTER KU + SMALL E
  くぉ: 'kwo', // HIRAGANA LETTER KU + SMALL O

  か: 'ka', // HIRAGANA LETTER KA
  きょう: 'kyō', // HIRAGANA LETTER KI + SMALL YO + U
  きゅう: 'kyū', // HIRAGANA LETTER KI + SMALL YU + U
  きゃ: 'kya', // HIRAGANA LETTER KI + SMALL YA
  きょ: 'kyo', // HIRAGANA LETTER KI + SMALL YO
  きゅ: 'kyu', // HIRAGANA LETTER KI + SMALL YU
  き: 'ki', // HIRAGANA LETTER KI
  くう: 'kū', // HIRAGANA LETTER KU + U
  く: 'ku', // HIRAGANA LETTER KU
  け: 'ke', // HIRAGANA LETTER KE
  こう: 'kō', // HIRAGANA LETTER KO + U
  こ: 'ko', // HIRAGANA LETTER KO

  しぇ: 'she', // HIRAGANA LETTER SI + SMALL E
  すぃ: 'si', // HIRAGANA LETTER SU + SMALL I

  さ: 'sa', // HIRAGANA LETTER SA
  しょう: 'shō', // HIRAGANA LETTER SI + SMALL YO + U
  しゅう: 'shū', // HIRAGANA LETTER SI + SMALL YU + U
  しゃ: 'sha', // HIRAGANA LETTER SI + SMALL YA
  しょ: 'sho', // HIRAGANA LETTER SI + SMALL YO
  しゅ: 'shu', // HIRAGANA LETTER SI + SMALL YU
  し: 'shi', // HIRAGANA LETTER SI
  すう: 'sū', // HIRAGANA LETTER SU + U
  す: 'su', // HIRAGANA LETTER SU
  せ: 'se', // HIRAGANA LETTER SE
  そう: 'sō', // HIRAGANA LETTER SO + U
  そ: 'so', // HIRAGANA LETTER SO

  ちぇ: 'che', // HIRAGANA LETTER TI + SMALL E
  つぁ: 'tsa', // HIRAGANA LETTER TU + SMALL A
  つぃ: 'tsi', // HIRAGANA LETTER TU + SMALL I
  つぇ: 'tse', // HIRAGANA LETTER TU + SMALL E
  つぉ: 'tso', // HIRAGANA LETTER TU + SMALL O
  てぃ: 'ti', // HIRAGANA LETTER TE + SMALL I
  でぃ: 'di', // HIRAGANA LETTER DE + SMALL I
  てゅ: 'tyu', // HIRAGANA LETTER TE + SMALL YU
  でゅ: 'dyu', // HIRAGANA LETTER DE + SMALL YU
  とぃ: 'twi', // HIRAGANA LETTER TO + SMALL I
  とぅ: 'tu', // HIRAGANA LETTER TO + SMALL U
  どぃ: 'dwi', // HIRAGANA LETTER DO + SMALL I
  どぅ: 'du', // HIRAGANA LETTER DO + SMALL U

  た: 'ta', // HIRAGANA LETTER TA
  ちょう: 'chō', // HIRAGANA LETTER TI + SMALL YO + U
  ちゅう: 'chū', // HIRAGANA LETTER TI + SMALL YU + U
  ちゃ: 'cha', // HIRAGANA LETTER TI + SMALL YA
  ちょ: 'cho', // HIRAGANA LETTER TI + SMALL YO
  ちゅ: 'chu', // HIRAGANA LETTER TI + SMALL YU
  ち: 'chi', // HIRAGANA LETTER TI
  つう: 'tsū', // HIRAGANA LETTER TU + U
  つ: 'tsu', // HIRAGANA LETTER TU
  て: 'te', // HIRAGANA LETTER TE
  とう: 'tō', // HIRAGANA LETTER TO + U
  と: 'to', // HIRAGANA LETTER TO

  な: 'na', // HIRAGANA LETTER NA
  にょう: 'nyō', // HIRAGANA LETTER NI + SMALL YO + U
  にゅう: 'nyū', // HIRAGANA LETTER NI + SMALL YU + U
  にゃ: 'nya', // HIRAGANA LETTER NI + SMALL YA
  にょ: 'nyo', // HIRAGANA LETTER NI + SMALL YO
  にゅ: 'nyu', // HIRAGANA LETTER NI + SMALL YU
  に: 'ni', // HIRAGANA LETTER NI
  ぬう: 'nū', // HIRAGANA LETTER NU + U
  ぬ: 'nu', // HIRAGANA LETTER NU
  ね: 'ne', // HIRAGANA LETTER NE
  のう: 'nō', // HIRAGANA LETTER NO + U
  の: 'no', // HIRAGANA LETTER NO

  ふぁ: 'fa', // HIRAGANA LETTER HU + SMALL A
  ふぃ: 'fi', // HIRAGANA LETTER HU + SMALL I
  // 'ふぅ': 'fu', // HIRAGANA LETTER HU + SMALL U
  ふぇ: 'fe', // HIRAGANA LETTER HU + SMALL E
  ふぉ: 'fo', // HIRAGANA LETTER HU + SMALL O
  ふゅ: 'fyu', // HIRAGANA LETTER HU + SMALL YU
  ほぇ: 'hwe', // HIRAGANA LETTER HO + SMALL E

  は: 'ha', // HIRAGANA LETTER HA
  ひょう: 'hyō', // HIRAGANA LETTER HI + SMALL YO + U
  ひゅう: 'hyū', // HIRAGANA LETTER HI + SMALL YU + U
  ひゃ: 'hya', // HIRAGANA LETTER HI + SMALL YA
  ひょ: 'hyo', // HIRAGANA LETTER HI + SMALL YO
  ひゅ: 'hyu', // HIRAGANA LETTER HI + SMALL YU
  ひ: 'hi', // HIRAGANA LETTER HI
  ふう: 'fū', // HIRAGANA LETTER HU + U
  ふ: 'fu', // HIRAGANA LETTER HU
  へ: 'he', // HIRAGANA LETTER HE
  ほう: 'hō', // HIRAGANA LETTER HO + U
  ほ: 'ho', // HIRAGANA LETTER HO

  ま: 'ma', // HIRAGANA LETTER MA
  みょう: 'myō', // HIRAGANA LETTER MI + SMALL YO + U
  みゅう: 'myū', // HIRAGANA LETTER MI + SMALL YU + U
  みゃ: 'mya', // HIRAGANA LETTER MI + SMALL YA
  みょ: 'myo', // HIRAGANA LETTER MI + SMALL YO
  みゅ: 'myu', // HIRAGANA LETTER MI + SMALL YU
  み: 'mi', // HIRAGANA LETTER MI
  むう: 'mū', // HIRAGANA LETTER MU + U
  む: 'mu', // HIRAGANA LETTER MU
  め: 'me', // HIRAGANA LETTER ME
  もう: 'mō', // HIRAGANA LETTER MO + U
  も: 'mo', // HIRAGANA LETTER MO

  や: 'ya', // HIRAGANA LETTER YA
  ゆう: 'yū', // HIRAGANA LETTER YU + U
  ゆ: 'yu', // HIRAGANA LETTER YU
  よう: 'yō', // HIRAGANA LETTER YO + U
  よ: 'yo', // HIRAGANA LETTER YO

  りぇ: 'rye', // HIRAGANA LETTER RI + SMALL E

  ら: 'ra', // HIRAGANA LETTER RA
  りょう: 'ryō', // HIRAGANA LETTER RI + SMALL YO + U
  りゅう: 'ryū', // HIRAGANA LETTER RI + SMALL YU + U
  りゃ: 'rya', // HIRAGANA LETTER RI + SMALL YA
  りょ: 'ryo', // HIRAGANA LETTER RI + SMALL YO
  りゅ: 'ryu', // HIRAGANA LETTER RI + SMALL YU
  り: 'ri', // HIRAGANA LETTER RI
  るう: 'rū', // HIRAGANA LETTER RU + U
  る: 'ru', // HIRAGANA LETTER RU
  れ: 're', // HIRAGANA LETTER RE
  ろう: 'rō', // HIRAGANA LETTER RO + U
  ろ: 'ro', // HIRAGANA LETTER RO

  わ: 'wa', // HIRAGANA LETTER WA
  ゐ: 'i', // HIRAGANA LETTER WI
  ゑ: 'e', // HIRAGANA LETTER WE
  を: 'o', // HIRAGANA LETTER WO

  ん: 'n', // HIRAGANA LETTER N

  ぐぁ: 'gwa', // HIRAGANA LETTER GU + SMALL A
  ぐぃ: 'gwi', // HIRAGANA LETTER GU + SMALL I
  ぐぇ: 'gwe', // HIRAGANA LETTER GU + SMALL E
  ぐぉ: 'gwo', // HIRAGANA LETTER GU + SMALL O

  が: 'ga', // HIRAGANA LETTER GA
  ぎょう: 'gyō', // HIRAGANA LETTER GI + SMALL YO + U
  ぎゅう: 'gyū', // HIRAGANA LETTER GI + SMALL YU + U
  ぎゃ: 'gya', // HIRAGANA LETTER GI + SMALL YA
  ぎょ: 'gyo', // HIRAGANA LETTER GI + SMALL YO
  ぎゅ: 'gyu', // HIRAGANA LETTER GI + SMALL YU
  ぎ: 'gi', // HIRAGANA LETTER GI
  ぐう: 'gū', // HIRAGANA LETTER GU + U
  ぐ: 'gu', // HIRAGANA LETTER GU
  げ: 'ge', // HIRAGANA LETTER GE
  ごう: 'gō', // HIRAGANA LETTER GO + U
  ご: 'go', // HIRAGANA LETTER GO

  じぇ: 'je', // HIRAGANA LETTER ZI + SMALL E
  ずぃ: 'zi', // HIRAGANA LETTER ZU + SMALL I

  ざ: 'za', // HIRAGANA LETTER ZA
  じょう: 'jō', // HIRAGANA LETTER ZI + SMALL YO + U
  じゅう: 'jū', // HIRAGANA LETTER ZI + SMALL YU + U
  じゃ: 'ja', // HIRAGANA LETTER ZI + SMALL YA
  じょ: 'jo', // HIRAGANA LETTER ZI + SMALL YO
  じゅ: 'ju', // HIRAGANA LETTER ZI + SMALL YU
  じ: 'ji', // HIRAGANA LETTER ZI
  ずう: 'zū', // HIRAGANA LETTER ZU + U
  ず: 'zu', // HIRAGANA LETTER ZU
  ぜ: 'ze', // HIRAGANA LETTER ZE
  ぞう: 'zō', // HIRAGANA LETTER ZO + U
  ぞ: 'zo', // HIRAGANA LETTER ZO

  だ: 'da', // HIRAGANA LETTER DA
  ぢ: 'ji', // HIRAGANA LETTER DI
  づう: 'zū', // HIRAGANA LETTER DU + U
  づ: 'zu', // HIRAGANA LETTER DU
  で: 'de', // HIRAGANA LETTER DE
  どう: 'dō', // HIRAGANA LETTER DO + U
  ど: 'do', // HIRAGANA LETTER DO

  ぶゅ: 'byu', // HIRAGANA LETTER BU + SMALL YU

  ば: 'ba', // HIRAGANA LETTER BA
  びょう: 'byō', // HIRAGANA LETTER BI + SMALL YO + U
  びゅう: 'byū', // HIRAGANA LETTER BI + SMALL YU + U
  びゃ: 'bya', // HIRAGANA LETTER BI + SMALL YA
  びょ: 'byo', // HIRAGANA LETTER BI + SMALL YO
  びゅ: 'byu', // HIRAGANA LETTER BI + SMALL YU
  び: 'bi', // HIRAGANA LETTER BI
  ぶう: 'bū', // HIRAGANA LETTER BU + U
  ぶ: 'bu', // HIRAGANA LETTER BU
  べ: 'be', // HIRAGANA LETTER BE
  ぼう: 'bō', // HIRAGANA LETTER BO + U
  ぼ: 'bo', // HIRAGANA LETTER BO

  ぱ: 'pa', // HIRAGANA LETTER PA
  ぴょう: 'pyō', // HIRAGANA LETTER PI + SMALL YO + U
  ぴゅう: 'pyū', // HIRAGANA LETTER PI + SMALL YU + U
  ぴゃ: 'pya', // HIRAGANA LETTER PI + SMALL YA
  ぴょ: 'pyo', // HIRAGANA LETTER PI + SMALL YO
  ぴゅ: 'pyu', // HIRAGANA LETTER PI + SMALL YU
  ぴ: 'pi', // HIRAGANA LETTER PI
  ぷう: 'pū', // HIRAGANA LETTER PU + U
  ぷ: 'pu', // HIRAGANA LETTER PU
  ぺ: 'pe', // HIRAGANA LETTER PE
  ぽう: 'pō', // HIRAGANA LETTER PO + U
  ぽ: 'po', // HIRAGANA LETTER PO

  ゔ: 'v' // HIRAGANA LETTER VU
}

const transliterationTable3 = {
  aァ: 'ā',
  aぁ: 'ā',
  iィー: 'ī',
  iィ: 'ī',
  iぃー: 'ī',
  iぃ: 'ī',
  aー: 'ā',
  iー: 'ī',
  uー: 'ū',
  eー: 'ē',
  oー: 'ō',

  // Fallback for small vowels
  ァ: 'a',
  ィ: 'i',
  ゥ: 'u',
  ェ: 'e',
  ォ: 'o',
  ぁ: 'a',
  ぃ: 'i',
  ぅ: 'u',
  ぇ: 'e',
  ぉ: 'o'
}

const replace1 = replacer(transliterationTable1)
const replace2 = replacer(transliterationTable2)
const replace3 = replacer(transliterationTable3)

module.exports = function (str) {
  str = replace1(str)

  str = str
    .replace(/ッ(?=[ン])/g, 'n')// KATAKANA LETTER SMALL TU
    .replace(/っ(?=[ん])/g, 'n')// HIRAGANA LETTER SMALL TU
    .replace(/ン(?=[バビブベボパピプペポマミムメモ])/g, 'm')// KATAKANA LETTER N
    .replace(/ん(?=[ばびぶべぼぱぴぷぺぽまみむめも])/g, 'm')// HIRAGANA LETTER N
    .replace(/ン(?=[ヤユヨアイウエオ])/g, "n'")// KATAKANA LETTER N
    .replace(/ん(?=[やゆよあいうえお])/g, "n'")// HIRAGANA LETTER N
  str = str
    .replace(/ッ(?=[カキクケコ])/g, 'k')// KATAKANA LETTER SMALL TU
    .replace(/っ(?=[かきくけこ])/g, 'k')// HIRAGANA LETTER SMALL TU
    .replace(/ッ(?=[ガギグゲゴ])/g, 'g')// KATAKANA LETTER SMALL TU
    .replace(/っ(?=[がぎぐげご])/g, 'g')// HIRAGANA LETTER SMALL TU
    .replace(/ッ(?=[サシスセソ])/g, 's')// KATAKANA LETTER SMALL TU
    .replace(/っ(?=[さしすせそ])/g, 's')// HIRAGANA LETTER SMALL TU
    .replace(/ッ(?=[ザズゼゾ])/g, 'z')// KATAKANA LETTER SMALL TU
    .replace(/っ(?=[ざずぜぞ])/g, 'z')// HIRAGANA LETTER SMALL TU
    .replace(/ッ(?=[ジ])/g, 'j')// KATAKANA LETTER SMALL TU
    .replace(/っ(?=[じ])/g, 'j')// HIRAGANA LETTER SMALL TU
    .replace(/ッ(?=[タチツテト])/g, 't')// KATAKANA LETTER SMALL TU
    .replace(/っ(?=[たちつてと])/g, 't')// HIRAGANA LETTER SMALL TU
    .replace(/ッ(?=[ダヂヅデド])/g, 't')// KATAKANA LETTER SMALL TU
    .replace(/っ(?=[だぢづでど])/g, 't')// HIRAGANA LETTER SMALL TU
    .replace(/ッ(?=[ハヒヘホ])/g, 'h')// KATAKANA LETTER SMALL TU
    .replace(/っ(?=[はひへほ])/g, 'h')// HIRAGANA LETTER SMALL TU
    .replace(/ッ(?=[フ])/g, 'f')// KATAKANA LETTER SMALL TU
    .replace(/っ(?=[ふ])/g, 'f')// HIRAGANA LETTER SMALL TU
    .replace(/ッ(?=[バビブベボ])/g, 'b')// KATAKANA LETTER SMALL TU
    .replace(/っ(?=[ばびぶべぼ])/g, 'b')// HIRAGANA LETTER SMALL TU
    .replace(/ッ(?=[パピプペポ])/g, 'p')// KATAKANA LETTER SMALL TU
    .replace(/っ(?=[ぱぴぷぺぽ])/g, 'p')// HIRAGANA LETTER SMALL TU
    .replace(/ッ(?=[ラリルレロ])/g, 'r')// KATAKANA LETTER SMALL TU
    .replace(/っ(?=[らりるれろ])/g, 'r')// HIRAGANA LETTER SMALL TU

  str = replace2(str)
  str = replace3(str)

  str = str
    .replace(/(ッ|っ)\B/g, 't')// FINAL KATAKANA LETTER SMALL TU

  return str
}
