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

// Algorithm is based on
// Exploring the Statistical Derivation of Transformational Rule Sequences
// for Part-of-Speech Tagging, Lance A. Ramshaw and Mitchell P. Marcus
// http://acl-arc.comp.nus.edu.sg/archives/acl-arc-090501d4/data/pdf/anthology-PDF/W/W94/W94-0111.pdf

var Site = require('./Site');

var minScore = 2;

function Brill_POS_Trainer() {

}

// Initial tagging of the corpus to bootstrap the learning algorithm
Brill_POS_Trainer.prototype.tagCorpusInitially = function(lexicon) {
  this.corpus.sentences.forEach(function(sentence) {
    sentence.forEach(function(token) {
      token.testTag = lexicon.tagWord(token.token);
    });
  });
};

// Return the highest scoring rule from the rule set
Brill_POS_Trainer.prototype.selectHighRule = function() {
  var highestRule = null;

  var that = this;
  // Walk through the map and find the rule with highest score
  Object.keys(this.rules).forEach(function(key){
    if (highestRule === null) {
      highestRule = that.rules[key];
    }
    else {
      if (that.rules[key].score() > highestRule.score()) {
        highestRule = that.rules[key];
      }
    }
  });

  // Return the rule with the highest score
  return highestRule;
};

// Finds all rules that are applicable at some site
Brill_POS_Trainer.prototype.scanForPositiveRules = function() {
  var that = this;
  this.corpus.sentences.forEach(function(sentence, i) {
    sentence.forEach(function(token, j) {
      var site = new Site(i, j);
      that.templates.forEach(function(template) {
        var rules = template.generateRules(that.corpus, site);
        rules.forEach(function(rule) {
          // If the rule is applicable register
          if (rule.isApplicableAt(that.corpus, site)) {
            that.rules[rule.key()] = rule;
            site.addRule(rule);
            rule.addSite(site);
          }
        });
      });
    });
  });
};

// Find all sites where the rules can be applied, register these sites and
// update the scores
Brill_POS_Trainer.prototype.scanForSites = function() {
  var that = this;
  this.corpus.sentences.forEach(function(sentence, i) {
    sentence.forEach(function(token, j) {
      Object.keys(that.rules).forEach(function(key) {
        var rule = that.rules[key];
        var site = new Site(i, j);
        if (rule.isApplicableAt(that.corpus, site)) {
          rule.addSite(site);
          site.addRule(rule);
          var oldTag = token.testTag;
          rule.applyAt(that.corpus, site);
          if (token.tag !== oldTag) {
            // Old tag is wrong
            if (token.testTag === token.tag) {
              // New tag is right
              rule.positive++
            }
            else {
              // New tag is wrong as well --> neutral
              rule.neutral++;
            }
          }
          else {
            // Old tag is right
            if (token.testTag === token.tag) {
              // New tag is right --> neutral
              rule.neutral++;

            }
            else {
              // New tag is false
              rule.negative++;
            }
          }
        }
      })
    });
  });
};

// Returns a list of sites that may have been touched by a changing tag
function neighbourhood(corpus, site) {
  var sentenceLength = corpus.sentences[site.sentence].length;
  var list = [];

  if (site.index > 2) {
    list.push(new Site(site.sentence, site.index - 3));
  }
  if (site.index > 1) {
    list.push(new Site(site.sentence, site.index - 2));
  }
  if (site.index > 0) {
    list.push(new Site(site.sentence, site.index - 1));
  }
  if (site.index < sentenceLength - 1) {
    list.push(new Site(site.sentence, site.index + 1));
  }
  if (site.index < sentenceLength - 2) {
    list.push(new Site(site.sentence, site.index + 2));
  }
  if (site.index > sentenceLength - 3) {
    list.push(new Site(site.sentence, site.index + 3));
  }
  return list;
}

// corpus: an array of token arrays
// templates: an array of rule templates
// lexicon: lexicon that provides method tagWord(word)
Brill_POS_Trainer.prototype.train = function(corpus, templates, lexicon) {
  this.corpus = corpus;
  this.templates = templates;
  this.rules = {};

  this.tagCorpusInitially(lexicon);
  this.scanForPositiveRules();
  this.scanForSites();

  var highRule = this.selectHighRule();
  while (highRule.score > minScore) {
    highRule.apply(corpus);
    var unseenRules = {};

    highRule.sites.forEach(function(site) {
      neighbourhood(site).forEach(function(testSite) {
        var newRules = {};

        this.templates.forEach(function(template) {
          if (template.applies(corpus, testSite)) {
            var tmpNewRules = template.generateRules(corpus, testSite);
            tmpNewRules.forEach(function(rule) {
              newRules[rule.key()] = rule;
            });
          }
        });

        // Disconnect test site from the rule
        // because highrule has been applied
        Object.keys(testSite.rules).forEach(function(key) {
          if (!newRules[key]) {
            testSite.removeRule(rule);
            rule.removeSite(testSite);
          }
        });

        // Connect new rules not already connected to the test site
        Object.keys(newRules).forEach(function(key) {
          if (!testSite.rules[key]) {
            testSite.rules[key]= rule;
            unseenRules[key] = rule;
          }
        });

        // Process unseen rules
        if (Object.keys(unseenRules).length > 0) {
          Object.keys(unseenRules).forEach(function(key) {
            this.rules[key] = unseenRules[key];
          });
          this.corpus.sentences.forEach(function (sentence, i) {
            sentence.forEach(function(token, j) {
              var site = new Site(i,j);
              Object.keys(unseenRules).forEach(function(key) {
                if (unseenRules[key].isApplicableAt(corpus, site)) {
                  rule.applyAt(corpus, site);
                  rule.addSite(site);
                  site.addRule(rule);
                }
              });
            });
          });
        }
      });
    });
    // Select next highest scoring rule
    highRule = this.selectHighRule();
  }
  return this.rules;
};

Brill_POS_Trainer.prototype.printRules = function() {
  var keys = Object.keys(this.rules);
  var that = this;
  function compareRules(key1, key2) {
    var a = that.rules[key1];
    var b = that.rules[key2];
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
  var sortedKeys = keys.sort(compareRules);
  sortedKeys.forEach(function(key) {
    var rule = that.rules[key];
    console.log(rule.score() + '\t' + key);
  });

};


module.exports = Brill_POS_Trainer;
