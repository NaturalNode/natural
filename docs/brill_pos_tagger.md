---
layout: default
title: Brill's POS Tagger
nav_order: 18
---

# POS Tagger

This is a part-of-speech tagger based on Eric Brill's transformational
algorithm. It needs a lexicon and a set of transformation rules.


## Usage

First a lexicon is created. First parameter is language (<code>EN</code> for English and <code>DU</code> for Dutch), second is default category.
Optionally, a third parameter can be supplied that is the default category for capitalised words.
```javascript
var natural = require("natural");
const language = "EN"
const defaultCategory = 'N';
const defaultCategoryCapitalized = 'NNP';

var lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
var ruleSet = new natural.RuleSet('EN');
var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
```

Then a ruleset is created, as follows. Parameter is the language.
```javascript
var ruleSet = new natural.RuleSet('EN');
```
Now a tagger can be created by passing lexicon and ruleset:
```javascript
var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
var sentence = ["I", "see", "the", "man", "with", "the", "telescope"];
console.log(tagger.tag(sentence));
```

This outputs the following:
```javascript
Sentence {
  taggedWords:
   [ { token: 'I', tag: 'NN' },
     { token: 'see', tag: 'VB' },
     { token: 'the', tag: 'DT' },
     { token: 'man', tag: 'NN' },
     { token: 'with', tag: 'IN' },
     { token: 'the', tag: 'DT' },
     { token: 'telescope', tag: 'NN' } ] }
```

## Lexicon
The lexicon is a JSON file that has the following structure:
```javascript
{
  "word1": ["cat1"],
  "word2": ["cat2", "cat3"],
  ...
}
```

Words may have multiple categories in the lexicon file. The tagger uses only
the first category specified.


## Specifying transformation rules
Transformation rules are specified a JSON file as follows:
```javascript
{
  "rules": [
    "OLD_CAT NEW_CAT PREDICATE PARAMETER",
    ...
  ]
}
```
This particular means that if the category of the current position is OLD_CAT and the predicate is true, the category is replaced by NEW_CAT. The predicate
may use the parameter in different ways: sometimes the parameter is used for
specifying the outcome of the predicate:
```
NN CD CURRENT-WORD-IS-NUMBER YES
```
This means that if the outcome of predicate CURRENT-WORD-IS-NUMBER is YES, the
category is replaced by <code>CD</code>.
The parameter can also be used to check the category of a word in the sentence:
```
VBD NN PREV-TAG DT
```
Here the category of the previous word must be <code>DT</code> for the rule to be applied.


## Algorithm
The tagger applies transformation rules that may change the category of words. The input sentence is a Sentence object with tagged words. The tagged sentence is processed from left to right. At each step all rules are applied once; rules are applied in the order in which they are specified. Algorithm:
```javascript
Brill_POS_Tagger.prototype.applyRules = function(sentence) {
  for (var i = 0, size = sentence.taggedWords.length; i < size; i++) {
    this.ruleSet.getRules().forEach(function(rule) {
      rule.apply(sentence, i);
    });
  }
  return sentence;
};
```
The output is a Sentence object just like the input sentence.


## Adding a predicate
Predicates are defined in module <code>lib/RuleTemplates.js</code>. In that file
predicate names are mapped to metadata for generaring transformation rules. The following properties must be supplied:
* Name of the predicate
* A function that evaluates the predicate (should return a boolean)
* A window <code>[i, j]</code> that defines the span of the predicate in the
sentence relative to the current position
* The number of parameter the predicate needs: 0, 1 or 2
* If relevant, a function for parameter 1 that returns its possible values
at the current position in the sentence (for generating rules in training)
* If relevant, a function for parameter 2 that returns its possible values
at the current position in the sentence (for training)

A typical entry for a rule templates looks like this:
```javascript
"NEXT-TAG": {
    // maps to the predicate function
    "function": next_tag_is,
    // Minimum required window before or after current position to be a relevant predicate
    "window": [0, 1],
    // The number of parameters the predicate takes
    "nrParameters": 1,
    // Function that returns relevant values for parameter 1
    "parameter1Values": nextTagParameterValues
  }
```
A predicate function accepts a Sentence object, the current position in the
sentence that should be tagged, and the outcome(s) of the predicate.
An example of a predicate that checks the category of the current word:
```javascript
function next_tag_is(sentence, i, parameter) {
  if (i < sentence.taggedWords.length - 1) {
    return(sentence.taggedWords[i + 1][1] === parameter);
  }
  else {
    return(false);
  }
}
```

A values function for a parameter returns an array all possible parameter
values given a location in a tagged sentence.
```javascript
function nextTagParameterValues(sentence, i) {
  if (i < sentence.length - 1) {
    return [sentence[i + 1].tag];
  }
  else {
    return [];
  }
}
```

## Training
The trainer allows to learn a new set of transformation rules from a corpus.
It takes as input a tagged corpus and a set of rule templates. The algorithm
generates positive rules (rules that apply at some location in the corpus)
from the templates and iteratively extends and optimises the rule set.

First, a corpus should be loaded. Currently, the format of Brown corpus is supported. Then a lexicon can be created from the corpus. The lexicon is needed for tagging the sentences before the learning algorithm is applied.
```javascript
var natural = require(natural);
const JSON_FLAG = 2;

var brownCorpus = require('../lib/natural/brill_pos_tagger/lib/Corpus');
var corpus = new Corpus(brownCorpus, JSON_FLAG, natural.Sentence);
var lexicon = corpus.buildLexicon();
```
The next step is to create a set of rule templates from which the learning
algorithm can generate transformation rules. Rule templates are defined in
<code>PredicateMapping.js</code>.
```javascript
var templateNames = [
  "NEXT-TAG",
  "NEXT-WORD-IS-CAP",
  "PREV-1-OR-2-OR-3-TAG",
  "...",
];
var templates = templateNames.map(function(name) {
  return new natural.RuleTemplate(name);
});
```
Using lexicon and rule templates we can now start the trainer as follows.
```javascript
var trainer = new natural.BrillPOSTrainer(/* optional threshold */);
var ruleSet = trainer.train(corpus, templates, lexicon);
```
A threshold value can be passed to constructor. Transformation rules with
a score below the threshold are removed after training.
The train method returns a set of transformation rules that can be used to
create a POS tagger as usual. Also you can output the rule set in the right
format for later usage.
```javascript
console.log(ruleSet.prettyPrint());
```

## Testing
Now we can apply the lexicon and rule set to a test set.
```javascript
var tester = new natural.BrillPOSTester();
var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
var scores = tester.test(corpora[1], tagger);
```
The test method returns an array of two percentages: first percentage is the ratio of right tags after tagging with the lexicon; second percentage is the ratio of right tags after applying the transformation rules.
```javascript
console.log("Test score lexicon " + scores[0] + "%");
console.log("Test score after applying rules " + scores[1] + "%");
```

## References

* Part of speech tagger by Percy Wegmann, https://code.google.com/p/jspos/
* Node.js version of jspos: https://github.com/neopunisher/pos-js
* A simple rule-based part of speech tagger, Eric Brill, Published in: Proceeding ANLC '92 Proceedings of the third conference on Applied natural language processing, Pages 152-155. http://dl.acm.org/citation.cfm?id=974526
* Exploring the Statistical Derivation of Transformational Rule Sequences for Part-of-Speech Tagging, Lance A. Ramshaw and Mitchell P. Marcus. http://acl-arc.comp.nus.edu.sg/archives/acl-arc-090501d4/data/pdf/anthology-PDF/W/W94/W94-0111.pdf
* Brown Corpus: https://en.wikipedia.org/wiki/Brown_Corpus
