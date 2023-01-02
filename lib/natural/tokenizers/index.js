/*
Copyright (c) 2011, Chris Umbel

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

exports.AggressiveTokenizerNl = require('./aggressive_tokenizer_nl')
exports.AggressiveTokenizerFa = require('./aggressive_tokenizer_fa')
exports.AggressiveTokenizerFr = require('./aggressive_tokenizer_fr')
exports.AggressiveTokenizerDe = require('./aggressive_tokenizer_de')
exports.AggressiveTokenizerRu = require('./aggressive_tokenizer_ru')
exports.AggressiveTokenizerEs = require('./aggressive_tokenizer_es')
exports.AggressiveTokenizerIt = require('./aggressive_tokenizer_it')
exports.AggressiveTokenizerPl = require('./aggressive_tokenizer_pl')
exports.AggressiveTokenizerPt = require('./aggressive_tokenizer_pt')
exports.AggressiveTokenizerNo = require('./aggressive_tokenizer_no')
exports.AggressiveTokenizerSv = require('./aggressive_tokenizer_sv')
exports.AggressiveTokenizerVi = require('./aggressive_tokenizer_vi')
exports.AggressiveTokenizerId = require('./aggressive_tokenizer_id')
exports.AggressiveTokenizer = require('./aggressive_tokenizer')
exports.CaseTokenizer = require('./tokenizer_case')
exports.RegexpTokenizer = require('./regexp_tokenizer').RegexpTokenizer
exports.OrthographyTokenizer = require('./regexp_tokenizer').OrthographyTokenizer
exports.WordTokenizer = require('./regexp_tokenizer').WordTokenizer
exports.WordPunctTokenizer = require('./regexp_tokenizer').WordPunctTokenizer
exports.TreebankWordTokenizer = require('./treebank_word_tokenizer')
exports.TokenizerJa = require('./tokenizer_ja')
exports.SentenceTokenizer = require('./sentence_tokenizer')
exports.SentenceTokenizerNew = require('./sentence_tokenizer_parser')
