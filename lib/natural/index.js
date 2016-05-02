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
exports.PorterStemmerFa = require('./stemmers/porter_stemmer_fa');
exports.PorterStemmerFr = require('./stemmers/porter_stemmer_fr');
exports.PorterStemmerRu = require('./stemmers/porter_stemmer_ru');
exports.PorterStemmerEs = require('./stemmers/porter_stemmer_es');
exports.PorterStemmerIt = require('./stemmers/porter_stemmer_it');
exports.PorterStemmerNo = require('./stemmers/porter_stemmer_no');
exports.PorterStemmerPt = require('./stemmers/porter_stemmer_pt');
exports.LancasterStemmer = require('./stemmers/lancaster_stemmer');
exports.StemmerFr = require('./stemmers/stemmer_fr');
exports.StemmerPl = require('./stemmers/stemmer_pl');
exports.StemmerJa = require('./stemmers/stemmer_ja');
exports.AggressiveTokenizerNl = require('./tokenizers/aggressive_tokenizer_nl');
exports.AggressiveTokenizerFa = require('./tokenizers/aggressive_tokenizer_fa');
exports.AggressiveTokenizerFr = require('./tokenizers/aggressive_tokenizer_fr');
exports.AggressiveTokenizerRu = require('./tokenizers/aggressive_tokenizer_ru');
exports.AggressiveTokenizerEs = require('./tokenizers/aggressive_tokenizer_es');
exports.AggressiveTokenizerIt = require('./tokenizers/aggressive_tokenizer_it');
exports.AggressiveTokenizerPl = require('./tokenizers/aggressive_tokenizer_pl');
exports.AggressiveTokenizerPt = require('./tokenizers/aggressive_tokenizer_pt');
exports.AggressiveTokenizerNo = require('./tokenizers/aggressive_tokenizer_no');
exports.AggressiveTokenizer = require('./tokenizers/aggressive_tokenizer');
exports.CaseTokenizer = require('./tokenizers/tokenizer_case');
exports.RegexpTokenizer = require('./tokenizers/regexp_tokenizer').RegexpTokenizer;
exports.WordTokenizer = require('./tokenizers/regexp_tokenizer').WordTokenizer;
exports.WordPunctTokenizer = require('./tokenizers/regexp_tokenizer').WordPunctTokenizer;
exports.TreebankWordTokenizer = require('./tokenizers/treebank_word_tokenizer');
exports.TokenizerJa = require('./tokenizers/tokenizer_ja');
exports.SentenceTokenizer = require('./tokenizers/sentence_tokenizer');
exports.BayesClassifier = require('./classifiers/bayes_classifier');
exports.LogisticRegressionClassifier = require('./classifiers/logistic_regression_classifier');
exports.NounInflector = require('./inflectors/noun_inflector');
exports.NounInflectorFr = require('./inflectors/fr/noun_inflector');
exports.NounInflectorJa = require('./inflectors/ja/noun_inflector');
exports.PresentVerbInflector = require('./inflectors/present_verb_inflector');
exports.CountInflector = require('./inflectors/count_inflector');
exports.WordNet = require('./wordnet/wordnet');
exports.TfIdf = require('./tfidf/tfidf');
exports.Trie = require('./trie/trie');
exports.SentenceAnalyzer = require('./analyzers/sentence_analyzer');
exports.stopwords = require('./util/stopwords').words;
exports.ShortestPathTree = require('./util/shortest_path_tree');
exports.Spellcheck = require('./spellcheck/spellcheck');
exports.LongestPathTree = require('./util/longest_path_tree');
exports.EdgeWeightedDigraph = require('./util/edge_weighted_digraph');
exports.NGrams = require('./ngrams/ngrams');
exports.NGramsZH = require('./ngrams/ngrams_zh');
exports.JaroWinklerDistance = require('./distance/jaro-winkler_distance');
exports.LevenshteinDistance = require('./distance/levenshtein_distance');
exports.DiceCoefficient = require('./distance/dice_coefficient');
exports.normalize = require('./normalizers/normalizer').normalize_tokens;
exports.normalize_ja = require('./normalizers/normalizer_ja').normalize_ja;
exports.removeDiacritics = require('./normalizers/remove_diacritics');
exports.transliterate_ja = require('./transliterators/ja');
exports.BrillPOSTagger = require('./brill_pos_tagger/lib/Brill_POS_Tagger');
