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

exports.SoundEx = require('./phonetics/soundex');
exports.Metaphone = require('./phonetics/metaphone');
exports.DoubleMetaphone = require('./phonetics/double_metaphone');
exports.SoundExDM = require('./phonetics/dm_soundex');
exports.PorterStemmer = require('./stemmers/porter_stemmer');
exports.PorterStemmerRu = require('./stemmers/porter_stemmer_ru');
exports.LancasterStemmer = require('./stemmers/lancaster_stemmer');
exports.StemmerJa = require('./stemmers/stemmer_ja');
exports.AggressiveTokenizerRu = require('./tokenizers/aggressive_tokenizer_ru');
exports.AggressiveTokenizer = require('./tokenizers/aggressive_tokenizer');
exports.RegexpTokenizer = require('./tokenizers/regexp_tokenizer').RegexpTokenizer;
exports.WordTokenizer = require('./tokenizers/regexp_tokenizer').WordTokenizer;
exports.WordPunctTokenizer = require('./tokenizers/regexp_tokenizer').WordPunctTokenizer;
exports.TreebankWordTokenizer = require('./tokenizers/treebank_word_tokenizer');
exports.TokenizerJa = require('./tokenizers/tokenizer_ja');
exports.BayesClassifier = require('./classifiers/bayes_classifier');
exports.LogisticRegressionClassifier = require('./classifiers/logistic_regression_classifier');
exports.NounInflector = require('./inflectors/noun_inflector');
exports.PresentVerbInflector = require('./inflectors/present_verb_inflector');
exports.CountInflector = require('./inflectors/count_inflector');
exports.WordNet = require('./wordnet/wordnet');
exports.TfIdf = require('./tfidf/tfidf');
exports.SentenceAnalyzer = require('./analyzers/sentence_analyzer');
exports.stopwords = require('./util/stopwords').words;
exports.NGrams = require('./ngrams/ngrams');
exports.JaroWinklerDistance = require('./distance/jaro-winkler_distance');
exports.LevenshteinDistance = require('./distance/levenshtein_distance');
exports.DiceCoefficient = require('./distance/dice_coefficient');
exports.normalize_ja = require('./normalizers/normalizer_ja').normalize_ja;
exports.removeDiacritics = require('./normalizers/remove_diacritics');
exports.transliterate_ja = require('./transliterators/ja');

