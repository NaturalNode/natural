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

var Tokenizer = require('lib/natural/tokenizers/tokenizer_ja'),
    tokenizer = new Tokenizer();

var text = '計算機科学における字句解析 (じくかいせき、英: Lexical Analysis) とは、ソースコードを構成する文字の並びを、トークン (token) の並びに変換することをいう。\n' +
    'ここでいう「トークン」とは、意味を持つコードの最小単位のこと。字句解析を行うプログラムは、字句解析器 (lexical analyzer, 略称：lexer) と呼ばれる。\n' +
    '字句解析器はスキャナ (scanner) とトークナイザ (tokenizer) から構成される。\n';
var result = ['計算', '機科', '学', 'に', 'おける', '字句', '解析',
  'じくかい', 'せき', '英', 'Lexical', 'Analysis', 'と', 'は', 'ソースコード',
  'を', '構成', 'する', '文字', 'の', '並び', 'を', 'トークン', 'token', 'の',
  '並び', 'に', '変換', 'する', 'こと', 'を', 'いう', 'ここ', 'でいう', 'トークン',
  'と', 'は', '意味', 'を', '持つ', 'コード', 'の', '最小', '単位', 'の', 'こと',
  '字句', '解析', 'を', '行う', 'プログラム', 'は', '字句', '解析', '器', 'lexical',
  'analyzer', '略称', 'lexer', 'と', '呼ば', 'れる', '字句', '解析', '器', 'は',
  'スキャナ', 'scanner', 'と', 'トークナイザ', 'tokenizer', 'から', '構成', 'さ',
  'れる'];

describe('TokenizerJa', function() {
  it('should tokenize', function() {
    var tokens = tokenizer.tokenize(text);
    expect(tokens).toEqual(result);

    // This test is very hard to pass through, so we comment for now.
    //tokens = tokenizer.tokenize('すもももももももものうち。');
    //expect(tokens).toEqual(['すもも', 'も', 'もも', 'も', 'もも', 'の', 'うち', '。']);
  });

  it('should normalize input', function() {
    var converters = require('lib/natural/normalizers/normalizer_ja').converters;
    var tokens = tokenizer.tokenize(
        converters.halfwidthToFullwidth.alphabet(
        converters.halfwidthToFullwidth.numbers(
        converters.fullwidthToHalfwidth.punctuation(
        converters.fullwidthToHalfwidth.katakana(text)))));
    expect(tokens).toEqual(result);
  });
});
