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

logger.setLevel('DEBUG');

var brownCorpusFile = '/home/hugo/Workspace/natural/spec/test_data/browntag_nolines_excerpt.txt';
var base_folder_rules = '/home/hugo/Workspace/natural/lib/natural/brill_pos_tagger/data';

var en_lexicon_file = base_folder_rules + '/English/lexicon_from_posjs.json';


var text = fs.readFileSync(brownCorpusFile, 'utf8');

// Process corpus
var corpus = new Corpus(text, 1);
corpus.prettyPrint();
logger.debug(corpus.sentences.length);


// Load the lexicon
//lexicon = new Lexicon(en_lexicon_file, 'NN');
var lexicon = corpus.buildLexicon();
logger.debug(lexicon.prettyPrint());

// Set rule templates
var templates = [
  new RuleTemplate("NEXT-TAG"),
  new RuleTemplate("NEXT-WORD-IS-CAP"),
  new RuleTemplate("PREV-1-OR-2-OR-3-TAG"),
  new RuleTemplate("PREV-1-OR-2-TAG"),
  new RuleTemplate("NEXT-WORD-IS-TAG"),
  new RuleTemplate("PREV-TAG")
];
logger.debug(templates);

// Train
var trainer = new Trainer();
trainer.train(corpus, templates, lexicon);

trainer.printRules();
