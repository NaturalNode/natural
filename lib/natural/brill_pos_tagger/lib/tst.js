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

function splitInTrainAndTest(data, percentageTrain) {
  var corpusTrain = [];
  var corpusTest = [];

  var lines = data.split('\n');
  var p = percentageTrain / 100;
  lines.forEach(function(line, i) {
    if (Math.random() < p) {
      corpusTrain.push(line);
    }
    else {
      corpusTest.push(line);
    }
  });

  return [corpusTrain, corpusTest];
};

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
var text = fs.readFileSync(brownCorpusFile, 'utf8');
// Split in two corpora
var corpusTexts = splitInTrainAndTest(text, 80);

// Process corpus
var trainCorpus = new Corpus(corpusTexts[0], 1);
var testCorpus = new Corpus(corpusTexts[1], 1);
logger.info("Training corpus: ", trainCorpus.sentences.length + " lines");
logger.info("Testing corpus: ", testCorpus.sentences.length + " lines");

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
//logger.info(trainer.printRulesWithScores());

// Test
var tester = new Tester();
var tagger = new Tagger(trainLexicon, ruleSet);
var percentageRight = tester.test(testCorpus, tagger);
logger.info("Test score lexicon " + percentageRight[0]);
logger.info("Test score after applying rules " + percentageRight[1]);
