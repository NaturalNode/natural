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

exports.PorterStemmer = require('./stemmers/porter_stemmer')
exports.PorterStemmerFa = require('./stemmers/porter_stemmer_fa')
exports.PorterStemmerFr = require('./stemmers/porter_stemmer_fr')
exports.CarryStemmerFr = require('./stemmers/Carry')
exports.PorterStemmerRu = require('./stemmers/porter_stemmer_ru')
exports.PorterStemmerEs = require('./stemmers/porter_stemmer_es')
exports.PorterStemmerIt = require('./stemmers/porter_stemmer_it')
exports.PorterStemmerNo = require('./stemmers/porter_stemmer_no')
exports.PorterStemmerSv = require('./stemmers/porter_stemmer_sv')
exports.PorterStemmerPt = require('./stemmers/porter_stemmer_pt')
exports.PorterStemmerNl = require('./stemmers/porter_stemmer_nl')
exports.LancasterStemmer = require('./stemmers/lancaster_stemmer')
// StemmerFr and StemmerPl are not stemmers. A Polish stemmer is
// not available, and for French PorterStemmerFr should be used.
// exports.StemmerFr = require('./stemmers/stemmer_fr');
// exports.StemmerPl = require('./stemmers/stemmer_pl');
exports.StemmerJa = require('./stemmers/stemmer_ja')
exports.StemmerId = require('./stemmers/indonesian/stemmer_id')
