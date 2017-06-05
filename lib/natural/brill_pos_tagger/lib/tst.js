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
var Tagger = require('./Brill_POS_Tagger');
var Tester = require('./Brill_POS_Tester');
var RuleTemplate = require('./RuleTemplate');
var ruleTemplates = require('./RuleTemplates');

logger.setLevel('INFO');

var brownCorpusFile = '/home/hugo/Workspace/natural/spec/test_data/browntag_nolines_excerpt.txt';
//var brownCorpusFile = '/Workspace/natural/spec/test_data/browntag_nolines_excerpt.txt';
var base_folder_rules = '/home/hugo/Workspace/natural/lib/natural/brill_pos_tagger/data';

function selectRuleTemplates(templateNames) {
  var templates = [];
  templateNames.forEach(function(name) {
    if (ruleTemplates[name]) {
      template = new RuleTemplate(name, ruleTemplates[name]);
      templates.push(template);
    }
  });
  return templates;
}

// Read file with corpus
var data = fs.readFileSync(brownCorpusFile, 'utf8');

// Process corpus
var BrownCorpus = 1;
var corpus = new Corpus(data, BrownCorpus);
var corpora = corpus.splitInTrainAndTest(50);
var trainCorpus = corpora[0];
var testCorpus = corpora[1];
logger.info("Training corpus: ", trainCorpus.nrSentences() + " lines");
logger.info("Testing corpus: ", testCorpus.nrSentences() + " lines");

// Build a lexicon from the training corpus
var trainLexicon = trainCorpus.buildLexicon();
// Set default category to noun (NN)
// And default category for capitalised words to proper noun (NP)
trainLexicon .setDefaultCategories("NN", "NP");
logger.info("Training corpus lexicon: number of entries " + trainLexicon.nrEntries());

// Set rule templates
var templates = selectRuleTemplates([
  "NEXT-TAG",
  "PREV-TAG",
  "PREV-1-OR-2-OR-3-TAG",
  "PREV-1-OR-2-TAG",
  "NEXT1OR2TAG",
  "NEXT1OR2OR3TAG",
  "SURROUNDTAG",
  "PREV2TAG",
  "NEXT2TAG"
]);
logger.info("Number of templates: " + templates.length);

// Train
var trainer = new Trainer();
var ruleSet = trainer.train(trainCorpus, templates, trainLexicon);
//logger.info(ruleSet.prettyPrint());
logger.info(trainer.printRulesWithScores());

// Test
var tester = new Tester();
var tagger = new Tagger(trainLexicon, ruleSet);
var percentageRight = tester.test(testCorpus, tagger);
logger.info("Test score lexicon " + percentageRight[0]);
logger.info("Test score after applying rules " + percentageRight[1]);
