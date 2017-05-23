/**
 * Created by hugo on 14-5-17.
 */

var p = require('./Predicate');
var Lexicon = require('./Lexicon');

var fs = require('fs');
var Corpus = require('./Corpus');
var Trainer = require('./Brill_POS_Trainer');
var RuleTemplate = require('./RuleTemplate');

var brownCorpusFile = '/home/hugo/Workspace/natural/spec/test_data/browntag_nolines_excerpt.txt';
var base_folder_rules = '/home/hugo/Workspace/natural/lib/natural/brill_pos_tagger/data';

var en_lexicon_file = base_folder_rules + '/English/lexicon_from_posjs.json';


var text = fs.readFileSync(brownCorpusFile, 'utf8');

// Process corpus
var corpus = new Corpus(text, 1);
console.log(corpus.sentences);
console.log(corpus.sentences.length);

// Load the lexicon
lexicon = new Lexicon(en_lexicon_file, 'NN');
console.log(lexicon);

// Set rule templates
var templates = [
  new RuleTemplate("NEXT-TAG"),
  new RuleTemplate("NEXT-WORD-IS-CAP"),
  new RuleTemplate("PREV-1-OR-2-OR-3-TAG"),
  new RuleTemplate("PREV-1-OR-2-TAG"),
  new RuleTemplate("NEXT-WORD-IS-TAG"),
  new RuleTemplate("PREV-TAG"),
  new RuleTemplate("PREV-TAG")
];
console.log(templates);

// Train
var trainer = new Trainer();
trainer.train(corpus, templates, lexicon);

trainer.printRules();






/*
var p1 = new p("NEXT-TAG", "CAT");
console.log(p1);
var s = [["word1", "CAT"], ["word2", "CAT"]];
var pos = 0;
console.log(p1.evaluate(s, pos));
*/
