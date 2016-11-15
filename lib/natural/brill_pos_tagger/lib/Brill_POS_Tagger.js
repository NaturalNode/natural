/*
    Brill's POS Tagger
    Copyright (C) 2016 Hugo W.L. ter Doest

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

var log4js = require('log4js');
var logger = log4js.getLogger();

var fs = require("fs");

var TF_Parser = require('./TF_Parser');

logger.setLevel('WARN');

// Tags a sentence, sentence is an array of words
// Returns an array of tagged words; a tagged words is an array consisting of
// the word itself followed by its lexical category
Brill_POS_Tagger.prototype.tag = function(sentence) {
  var taggedSentence = new Array(sentence.length);
  
  // Initialise taggedSentence
  // for (var i = 0, size = sentence.length; i < size; i++) {
  var that = this;
  sentence.forEach(function(word, index) {
    taggedSentence[index] = [];
    taggedSentence[index][0] = word;
    var categories = that.lexicon.tagWord(word);
    taggedSentence[index][1] = categories[0];
  });
    /*
    var ss = this.lexicon[sentence[i]];
    if (!ss) {
      ss = this.lexicon[sentence[i].toLowerCase()];
    }
    tagged_sentence[i] = [];
    tagged_sentence[i][0] = sentence[i];
    if (!ss) { // If not found assign default_category
      tagged_sentence[i][1] = this.default_category;
    }
    else {
      tagged_sentence[i][1] = ss[0];
    }
  }*/

  // Apply transformation rules
  for (var i = 0, size = sentence.length; i < size; i++) {
    this.ruleSet.rules.forEach(function(rule) {
      rule.apply(taggedSentence, i);
    });
  }
  return(taggedSentence);
};

Brill_POS_Tagger.prototype.parse_lexicon = function(data) {
  var that = this;
  // Split into an array of non-empty lines
  var arrayOfLines = data.match(/[^\r\n]+/g);
  this.lexicon = {};
  arrayOfLines.forEach(function(line) {
    // Split line by whitespace
    var elements = line.trim().split(/\s+/);
    if (elements.length > 0) {
      that.lexicon[elements[0]] = elements.slice(1);
    }
  });
};

Brill_POS_Tagger.prototype.read_lexicon = function(lexicon_file,callback) {
  var that = this;
  
  // Read lexicon
  fs.readFile(lexicon_file, 'utf8', function (error, data) {
    if (error) {
      logger.error(error);
      callback(error);
    }
    else {
      if (data[0] === "{") {
        // Lexicon is in JSON format
        that.lexicon = JSON.parse(data);
        callback();
      }
      else {
        // Lexicon is plain text
        that.parse_lexicon(data);
        callback();
      }
      logger.debug('Brill_POS_Tagger.read_lexicon: number of lexicon entries read: ' + Object.keys(that.lexicon).length);
    }
  });
};

Brill_POS_Tagger.prototype.readTransformationRules = function(rulesFile) {
  var that = this;

  // Read transformation rules
  try {
    var data = fs.readFileSync(rulesFile, 'utf8');
    that.transformation_rules = TF_Parser.parse(data);
    logger.debug(that.transformation_rules);
    logger.debug('Brill_POS_Tagger.read_transformation_rules: number of transformation rules read: ' + that.transformation_rules.length);
  }
  catch(error) {
    logger.error(error);
  }
};

function Brill_POS_Tagger(lexicon, ruleSet) {
  this.lexicon = lexicon;
  this.ruleSet = ruleSet;
}

module.exports = Brill_POS_Tagger;
