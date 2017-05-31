/**
 * Created by hugo on 14-5-17.
 */

var log4js = require('log4js');
var logger = log4js.getLogger();

var p = require('./Predicate');
var Lexicon = require('./Lexicon');

var fs = require('fs');
var Corpus = require('./Corpus');
var Trainer = require('./Brill_POS_Trainer');
var RuleTemplate = require('./RuleTemplate');
var Tagger = require('./Brill_POS_Tagger');
var Tester = require('./Brill_POS_Tester');

logger.setLevel('INFO');

//var brownCorpusFile = '/home/hugo/Workspace/natural/spec/test_data/browntag_nolines_excerpt.txt';
var brownCorpusFile = '/Workspace/natural/spec/test_data/browntag_nolines_excerpt.txt';
var base_folder_rules = '/home/hugo/Workspace/natural/lib/natural/brill_pos_tagger/data';

var text = fs.readFileSync(brownCorpusFile, 'utf8');

// Process corpus
var corpus = new Corpus(text, 1);
corpus.prettyPrint();
logger.info(corpus.sentences.length);

// Load the lexicon
//lexicon = new Lexicon(en_lexicon_file, 'NN');
var lexicon = corpus.buildLexicon();
logger.info(lexicon.prettyPrint());

// Set rule templates
var templateNames = [
  "NEXT-TAG",
  "NEXT-WORD-IS-CAP",
  "PREV-1-OR-2-OR-3-TAG",
  "PREV-1-OR-2-TAG",
  "PREV-TAG",
  "CURRENT-WORD-IS-TAG",
  "PREV-WORD-IS-CAP",
  "CURRENT-WORD-IS-CAP",
  "CURRENT-WORD-IS-NUMBER",
  "CURRENT-WORD-IS-URL",
  "CURRENT-WORD-ENDS-WITH",
  "PREV-WORD-IS"
];
var templates = templateNames.map(function(name) {
  return new RuleTemplate(name);
});
logger.info(templates);

// Split corpus in train and test set
var corpora  = corpus.splitInTrainAndTest(80);
logger.info("Size of training corpus: " + corpora[0].sentences.length);
logger.info("Size of testing corpus: " + corpora[1].sentences.length);

// Train
var trainer = new Trainer();
var ruleSet = trainer.train(corpora[0], templates, lexicon);
logger.info(ruleSet.prettyPrint());
logger.info(trainer.printRulesWithScores());

// Test
var tester = new Tester();
var tagger = new Tagger(lexicon, ruleSet);
var percentageRight = tester.test(corpora[1], tagger);
logger.info("Test score lexicon " + percentageRight[0]);
logger.info("Test score after applying rules " + percentageRight[1]);
