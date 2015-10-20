/*
    Brill's POS Tagger
    Copyright (C) 2015 Hugo W.L. ter Doest

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
  var tagged_sentence = new Array(sentence.length);
  
  // Initialise result
  for (var i = 0, size = sentence.length; i < size; i++) {
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
  }
  // Apply transformation rules
  for (var i = 0, size = sentence.length; i < size; i++) {
    this.transformation_rules.forEach(function(rule) {
      rule.apply(tagged_sentence, i);
    });
  }
  return(tagged_sentence);
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

Brill_POS_Tagger.prototype.read_transformation_rules = function(rules_file, callback) {
  var that = this;

  // Read transformation rules
  fs.readFile(rules_file, 'utf8', function (err, data) {
    if (err) {
      logger.error(error);
      callback(err);
    }
    else {
      that.transformation_rules = TF_Parser.parse(data);
      logger.debug(that.transformation_rules);
      logger.debug('Brill_POS_Tagger.read_transformation_rules: number of transformation rules read: ' + that.transformation_rules.length);
      callback();
    }
  });
};

function Brill_POS_Tagger(lexicon_file, rules_file, default_category, callback) {
  var that = this;
  
  this.default_category = default_category;
  this.read_lexicon(lexicon_file, function(error) {
    if (error) {
      callback(error);
    }
    else {
      that.read_transformation_rules(rules_file, function(error) {
        if (error) {
          callback(error);
        }
        else {
          callback();
        }
      });
    }
  });
}

module.exports = Brill_POS_Tagger;