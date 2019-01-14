const { src, dest } = require('gulp');
var jasmineBrowser = require('gulp-jasmine-browser');
var webpackStream = require('webpack-stream');

var specs = [
  "spec/aggressive_tokenizer_es_spec.js",
  "spec/aggressive_tokenizer_fr_spec.js",
  "spec/aggressive_tokenizer_nl_spec.js",
  "spec/aggressive_tokenizer_pt_spec.js",
  "spec/aggressive_tokenizer_spec.js",
  "spec/aggressive_tokenizer_sv_spec.js",
  "spec/aggressive_tokenizer_vi_spec.js",
  //"spec/bayes_classifier_spec.js",
  "spec/brill_pos_tagger_spec.js",
  "spec/brill_pos_trainer_spec.js",
  "spec/count_inflector_fr_spec.js",
  "spec/count_inflector_spec.js",
  "spec/damerau_levenshtein_spec.js",
  "spec/dice_coefficient_spec.js",
  "spec/double_metaphone_spec.js",
  "spec/hamming_distance_spec.js",
  "spec/jaro-winkler_spec.js",
  "spec/lancaster_stemmer_spec.js",
  "spec/levenshtein_spec.js",
  //"spec/logistic_regression_classifier_spec.js",
  "spec/longest_path_tree_spec.js",
  "spec/MaxEntAppliedToPOSTagging_spec.js",
  "spec/MaxEntClassifier_spec.js",
  "spec/metaphone_spec.js",
  //"spec/ngram_spec.js",
  "spec/ngram_zh_spec.js",
  "spec/normalizer_ja_spec.js",
  "spec/normalizer_no_spec.js",
  "spec/normalizer_spec.js",
  "spec/noun_inflector_fr_spec.js",
  "spec/noun_inflector_ja_spec.js",
  "spec/noun_inflector_spec.js",
  "spec/orthography_tokenizer_spec.js",
  "spec/porter_stemmer_es_spec.js",
  "spec/porter_stemmer_fr_spec.js",
  "spec/porter_stemmer_it_spec.js",
  //"spec/porter_stemmer_nl_spec.js",
  //"spec/porter_stemmer_no_spec.js",
  //"spec/porter_stemmer_pt_spec.js",
  "spec/porter_stemmer_ru_spec.js",
  //"spec/porter_stemmer_spec.js",
  "spec/porter_stemmer_sv_spec.js",
  "spec/present_verb_inflector_spec.js",
  "spec/remove_diacritics_spec.js",
  "spec/sentence_analyzer_spec.js",
  "spec/sentence_tokenizer_spec.js",
  "spec/SentimentAnalyzer_spec.js",
  "spec/shortest_path_tree_spec.js",
  "spec/soundex_spec.js",
  "spec/spellcheck_spec.js",
  "spec/stemmer_id_spec.js",
  "spec/stemmer_ja_spec.js",
  "spec/stemmer_token_spec.js",
  //"spec/tfidf_spec.js",
  "spec/tokenizer_case_spec.js",
  "spec/tokenizer_ja_spec.js",
  "spec/transliterator_ja_spec.js",
  "spec/treebank_word_tokenizer_spec.js",
  "spec/trie_spec.js",
  "spec/wordnet_index_spec.js",
  "spec/WordPunctTokenizer_spec.js",

]

exports.default = function() {
  //return src(['spec/*_spec.js'])
  return src(specs)
    .pipe(webpackStream(require('webpack.config')))
    //.pipe(dest('.'))
    .pipe(jasmineBrowser.specRunner({}))
    //.pipe(jasmineBrowser.headless({driver: "chrome", random: false}));
    .pipe(jasmineBrowser.server())
};
