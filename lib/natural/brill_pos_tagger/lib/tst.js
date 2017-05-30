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
var templates = [
  new RuleTemplate("NEXT-TAG"),
  new RuleTemplate("NEXT-WORD-IS-CAP"),
  new RuleTemplate("PREV-1-OR-2-OR-3-TAG"),
  new RuleTemplate("PREV-1-OR-2-TAG"),
  new RuleTemplate("NEXT-WORD-IS-TAG"),
  new RuleTemplate("PREV-TAG")
];
logger.info(templates);

// Split corpus in train and test set
var corpora  = corpus.splitInTrainAndTest(60);

// Train
var trainer = new Trainer();
var ruleSet = trainer.train(corpora[0], templates, lexicon);
logger.info(ruleSet.prettyPrint());

// Test
var tester = new Tester();
var percentageRight = tester.test(corpora[1], lexicon, ruleSet);
logger.info("Test score " + percentageRight);