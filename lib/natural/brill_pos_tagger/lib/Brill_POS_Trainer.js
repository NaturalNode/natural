/*
  Brill POS Trainer class
  Copyright (C) 2017 Hugo W.L. ter Doest

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Algorithm is based on:
// Exploring the Statistical Derivation of Transformational Rule Sequences
// for Part-of-Speech Tagging, Lance A. Ramshaw and Mitchell P. Marcus
// http://acl-arc.comp.nus.edu.sg/archives/acl-arc-090501d4/data/pdf/anthology-PDF/W/W94/W94-0111.pdf


var TransformationRule = require("./TransformationRule");
var RuleSet = require("./RuleSet");
var Sentence = require('./Sentence');

// Training continues as long as there are rules with a positive score
// that have not been selected before
var minScore = 0;

// After training rules with a score below scoreThreshold are pruned
function Brill_POS_Trainer(ruleScoreThreshold) {
  if (ruleScoreThreshold) {
    this.ruleScoreThreshold = ruleScoreThreshold;
  }
  else {
    this.ruleScoreThreshold = 1;
  }
}

// Return the highest scoring rule from the rule set
Brill_POS_Trainer.prototype.selectHighRule = function() {
  var highestRule = null;

  // Walk through the map and find the rule with highest score
  this.positiveRules.getRules().forEach(function(rule){
    if (highestRule === null) {
      if (!rule.hasBeenSelectedAsHighRuleBefore) {
        highestRule = rule;
      }
    }
    else {
      if ((rule.score() > highestRule.score()) &&
        !rule.hasBeenSelectedAsHighRuleBefore) {
        highestRule = rule;
      }
    }
  });

  if (highestRule !== null) {
    highestRule.hasBeenSelectedAsHighRuleBefore = true;
  }
  // Return the rule with the highest score
  return highestRule;
};

Brill_POS_Trainer.prototype.mapRuleToSite = function(rule, i, j) {
  if (!this.mapRuleToSites[rule.key()]) {
    this.mapRuleToSites[rule.key()] = {};
  }
  if (!this.mapRuleToSites[rule.key()][i]) {
    this.mapRuleToSites[rule.key()][i] = {};
  }
  this.mapRuleToSites[rule.key()][i][j] = true;
};

Brill_POS_Trainer.prototype.mapSiteToRule = function(i, j, rule) {
  if (!this.mapSiteToRules[i]) {
    this.mapSiteToRules[i] = {};
  }
  if (!this.mapSiteToRules[i][j]) {
    this.mapSiteToRules[i][j] = {};
  }
  this.mapSiteToRules[i][j][rule.key()] = rule;
};

Brill_POS_Trainer.prototype.associateSiteWithRule = function(i, j, rule) {
  this.mapRuleToSite(rule, i, j);
  this.mapSiteToRule(i, j, rule);
};

Brill_POS_Trainer.prototype.siteIsAssociatedWithRule = function(i, j, rule) {
  if (this.mapSiteToRules[i]) {
    if (this.mapSiteToRules[i][j]) {
      if (this.mapSiteToRules[i][j][rule.key()]) {
        return true;
      }
    }
  }
  return false;
};

// Returns an array of all sites associated with rule
Brill_POS_Trainer.prototype.getSites = function(rule) {
  var that = this;
  var result = [];
  Object.keys(this.mapRuleToSites[rule.key()]).forEach(function(i) {
    Object.keys(that.mapRuleToSites[rule.key()][i]).forEach(function(j) {
      // Unary plus the convert hash keys i and j to integer
      result.push([+i, +j]);
    });
  });
  //logger.debug("Brill_POS_Trainer.prototype.getSites: sites " + JSON.stringify(result));
  return(result);
};

// Returns an array of all rules associated with the site
Brill_POS_Trainer.prototype.getRules = function(i, j) {
  var result = [];
  var that = this;

  if (this.mapSiteToRules[i]) {
    if (this.mapSiteToRules[i][j]) {
      result = Object.keys(this.mapSiteToRules[i][j]).map(function(key) {
        return that.mapSiteToRules[i][j][key];
      });
    }
  }
  return result;
};

Brill_POS_Trainer.prototype.disconnectSiteFromRule = function(i, j, rule) {
  // mapRuleToSites
  if (this.mapRuleToSites[rule.key()]) {
    if (this.mapRuleToSites[rule.key()][i]) {
      if (this.mapRuleToSites[rule.key()][i][j]) {
        delete this.mapRuleToSites[rule.key()][i][j];
      }
    }
  }

  // mapSiteToRules
  if (this.mapSiteToRules[i]) {
    if (this.mapSiteToRules[i][j]) {
      if (this.mapSiteToRules[i][j][rule.key()]) {
        delete this.mapSiteToRules[i][j][rule.key()];
      }
    }
  }
};

// Adjusts the score of the rule at position i, j of the corpus
Brill_POS_Trainer.prototype.scoreRule = function(rule, i, j) {
  //logger.debug("Brill_POS_Trainer.prototype.scoreRule: entry");
  var token = this.corpus.sentences[i].taggedWords[j];
  var rightTag = token.tag;
  var oldTag = token.testTag;
  var newTag = token.newTag;
  if (rightTag !== oldTag) {
    // Old tag is wrong
    if (newTag === rightTag) {
      // New tag is right
      rule.positive++;
      // If the score changes, it may be selected again as highest scoring rule
      rule.hasBeenSelectedAsHighRuleBefore = false;
      //logger.debug("Brill_POS_Trainer.prototype.scoreRule: positive: " + rule.key() + "\t score: " + rule.positive);
    }
    else {
      // New tag is wrong as well --> neutral
      rule.neutral++;
      //logger.debug("Brill_POS_Trainer.prototype.scoreRule: neutral: " + rule.key() + "\t score: " + rule.neutral);
    }
  }
  else {
    // Old tag is right
    if (newTag === rightTag) {
      // New tag is right --> neutral
      rule.neutral++;
      //logger.debug("Brill_POS_Trainer.prototype.scoreRule: neutral: " + rule.key() + "\t score: " + rule.neutral);


    }
    else {
      // New tag is false
      rule.negative++;
      // If the score changes, it may be selected again as highest scoring rule
      rule.hasBeenSelectedAsHighRuleBefore = false;
      //logger.debug("Brill_POS_Trainer.prototype.scoreRule: negative: " + rule.key() + "\t score: " + rule.negative);
    }
  }
  //logger.debug("Brill_POS_Trainer.prototype.scoreRule: exit");
};

// Generate positive rules for this given site using templates
Brill_POS_Trainer.prototype.generatePositiveRules = function(i, j) {
  var sentence = this.corpus.sentences[i];
  var token = sentence.taggedWords[j];
  // A positive rule should trigger on the currently assigned testTag
  var oldTag = token.testTag;
  //logger.debug("Brill_POS_Trainer.prototype.generatePositiveRules: oldTag " + oldTag);
  // It should assign the right tag as given by the corpus
  var newTag = token.tag;
  //logger.debug("Brill_POS_Trainer.prototype.generatePositiveRules: newTag " + newTag);

  var newRules = new RuleSet();
  // Exit if testTag already is the right tag --> will not result in positive rules
  if (oldTag === newTag) {
    return newRules;
  }

  this.templates.forEach(function(template) {
    if (template.windowFitsSite(sentence, j)) {
      if (template.meta.nrParameters === 1) {
        template.meta.parameter1Values(sentence, j).forEach(function (value) {
          newRules.addRule(new TransformationRule(oldTag, newTag, template.predicateName, value));
        });
      }
      else {
        if (template.meta.nrParameters === 2) {
          template.meta.parameter1Values(sentence, j).forEach(function (value1) {
            template.meta.parameter2Values(sentence, j).forEach(function (value2) {
              newRules.addRule(new TransformationRule(oldTag, newTag, template.predicateName, value1, value2));
            });
          });
        }
        else {
          // 0 paramaters
          newRules.addRule(new TransformationRule(oldTag, newTag, template.predicateName));
        }
      }
    }
  });
  return newRules;
};

// Finds all rules that are applicable at some site
Brill_POS_Trainer.prototype.scanForPositiveRules = function() {
  //logger.debug("Brill_POS_Trainer.prototype.scanForPositiveRules: entry");
  var that = this;
  this.corpus.sentences.forEach(function(sentence, i) {
    sentence.taggedWords.forEach(function(token, j) {
      //logger.debug("Brill_POS_Trainer.prototype.scanForPositiveRules: sentence no " + i);
      var newRules = that.generatePositiveRules(i, j);
      newRules.getRules().forEach(function(rule) {
        that.positiveRules.addRule(rule);
        //logger.debug("Brill_POS_Trainer.prototype.scanForPositiveRules: nrRules " + that.positiveRules.nrRules());
      });
    });
  });
  //logger.debug("Brill_POS_Trainer.prototype.scanForPositiveRules: exit, number of rules: " + this.positiveRules.nrRules());
};

// Find all sites where the rules can be applied, register these sites and
// update the scores
Brill_POS_Trainer.prototype.scanForSites = function() {
  //logger.debug("Brill_POS_Trainer.prototype.scanForSites: entry");
  var that = this;

  // Scan the corpus
  this.corpus.sentences.forEach(function(sentence, i) {
    if (i % 100 === 0) {
      //logger.info("Brill_POS_Trainer.prototype.scanForSites: sentence " + i);
    }

    var taggedSentence = new Sentence();
    sentence.taggedWords.forEach(function(wordObject) {
      taggedSentence.addTaggedWord(wordObject.token, wordObject.testTag);
    });

    sentence.taggedWords.forEach(function(token, j) {
      that.positiveRules.getRules().forEach(function(rule) {
        if (rule.isApplicableAt(sentence, taggedSentence, j)) {
          that.associateSiteWithRule(i, j, rule);
          that.scoreRule(rule, i, j);
          //logger.debug("Brill_POS_Trainer.prototype.scanForSites: (sentence, token, rule): (" + i + ", " + j + ", " + rule.prettyPrint() + ")");
        }
      });
    });
  });

  //logger.debug("Brill_POS_Trainer.prototype.scanForSites: exit");
};

// Returns a list of sites that may have been touched by a changing tag
Brill_POS_Trainer.prototype.neighbourhood = function(i, j) {
  var sentenceLength = this.corpus.sentences[i].length;
  var list = [];

  if (this.index > 2) {
    list.push([i, j - 3]);
  }
  if (this.index > 1) {
    list.push([i, j - 2]);
  }
  if (this.index > 0) {
    list.push([i, j - 1]);
  }
  if (this.index < sentenceLength - 1) {
    list.push([i, j + 1]);
  }
  if (this.index < sentenceLength - 2) {
    list.push([i, j + 2]);
  }
  if (this.index > sentenceLength - 3) {
    list.push([i, j + 3]);
  }
  return list;
};

// corpus: an array of token arrays
// templates: an array of rule templates
// lexicon: lexicon that provides method tagWord(word)
Brill_POS_Trainer.prototype.train = function(corpus, templates, lexicon) {
  this.corpus = corpus;
  this.templates = templates;
  this.positiveRules = new RuleSet();
  this.mapRuleToSites = {};
  this.mapSiteToRules = {};

  //logger.debug("Brill_POS_Trainer.prototype.train: entry");
  this.corpus.tag(lexicon);
  this.scanForPositiveRules();
  //logger.info("Brill_POS_Trainer.prototype.train: initial number of rules: " + this.positiveRules.nrRules());
  this.scanForSites();

  var highRule = this.selectHighRule();
  var iterationNumber = 0;
  var that = this;
  while ((highRule !== null) && (highRule.score() > minScore)) {
    if ((iterationNumber % 5) === 0) {
      //logger.info("Brill_POS_Trainer.prototype.train: training iteration: " + iterationNumber);
    }
    //logger.debug("Brill_POS_Trainer.prototype.train: highRule selected: " + highRule.key());
    //logger.debug("Brill_POS_Trainer.prototype.train: number of rules: " + this.positiveRules.nrRules());
    //logger.debug("Brill_POS_Trainer.prototype.train: score of highRule: " + highRule.score());

    // Apply the high rule to each change site on its site list
    this.getSites(highRule).forEach(function(site) {
      //logger.debug("Brill_POS_Trainer.prototype.train: apply highRule to: " + site);
      //logger.debug("Brill_POS_Trainer.prototype.train: sentence length: " + that.corpus.sentences[site[0]].length);
      highRule.applyAt(that.corpus.sentences[site[0]], site[1]);
    });

    var unseenRules = new RuleSet();
    this.getSites(highRule).forEach(function(site) {
      that.neighbourhood(site[0], site[1]).forEach(function(testSite) {
        // Generate positive rules for testSite
        var newRules = that.generatePositiveRules(testSite[0], testSite[1]);

        // Disconnect test site from its rules
        // because highrule has been applied
        that.getRules(testSite[0], testSite[1]).forEach(function(rule) {
          if (!newRules.hasRule(rule)) {
            that.disconnectSiteFromRule(testSite[0], testSite[1], rule);
          }
        });

        // Connect new rules not already connected to the test site
        newRules.getRules().forEach(function(rule) {
          if (!that.siteIsAssociatedWithRule(testSite[0]. testSite[1], rule)) {
            if (that.positiveRules.hasRule(rule)) {
              that.associateSiteWithRule(testSite[0], testSite[1], rule);
            }
            else {
              unseenRules.addRule(rule);
            }
          }
        });

        // Process unseen rules
        if (unseenRules.nrRules() > 0) {
          unseenRules.getRules().forEach(function(rule) {
            that.positiveRules.addRule(rule);
          });
          that.corpus.sentences.forEach(function (sentence, i) {
            var taggedSentence = sentence.map(function(token) {
              return [token.token, token.testTag];
            });
            sentence.forEach(function(token, j) {
              unseenRules.getRules().forEach(function(rule) {
                if (rule.isApplicableAt(sentence, taggedSentence, j)) {
                  that.associateSiteWithRule(i, j, rule);
                  that.scoreRule(rule, i, j);
                }
              });
            });
          });
        }

      });
    });

    // Select next highest scoring rule
    highRule = this.selectHighRule();
    iterationNumber++;
  }
  //logger.info("Brill_POS_Trainer.prototype.train: number of iterations: " + iterationNumber);
  //logger.info("Brill_POS_Trainer.prototype.train: number of rules: " + this.positiveRules.nrRules());

  // Remove rules having a non-positive score
  this.positiveRules.getRules().forEach(function(rule) {
    if (rule.score() < that.ruleScoreThreshold) {
      that.positiveRules.removeRule(rule);
    }
  });

  //logger.info("Brill_POS_Trainer.prototype.train: number of rules after pruning: " + this.positiveRules.nrRules());
  //logger.debug("Brill_POS_Trainer.prototype.train: exit");
  return this.positiveRules;
};

Brill_POS_Trainer.prototype.printRulesWithScores = function() {
  var that = this;
  var result = "";

  function compareRules(a, b) {
    if (a.score() > b.score()) {
      return -1;
    }
    else {
      if (a.score() < b.score()) {
        return 1;
      }
      else {
        return 0;
      }
    }
  }

  var rules = this.positiveRules.getRules();
  var sortedRules = rules.sort(compareRules);

  sortedRules.forEach(function(rule) {
    //if (rule.score() > 0) {
      result += rule.score() + '\t' + rule.positive + '\t' + rule.negative + '\t' + rule.neutral + '\t' + rule.prettyPrint() + "\n";
    //}
  });
  return result;
};

module.exports = Brill_POS_Trainer;
