/*
  Lexicon class
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

var fs = require('fs');

// Parses a lexicon in JSON or text format
function Lexicon(filename, defaultCategory, defaultCategoryCapitalised) {
  this.lexicon = {};

  if (filename) {
    this.defaultCategory = defaultCategory;
    // Read lexicon
    try {
      var data = fs.readFileSync(filename, 'utf8');
      if (data[0] === "{") {
        // Lexicon is in JSON format
        this.lexicon = JSON.parse(data);
      }
      else {
        // Lexicon is plain text
        this.parseLexicon(data);
      }
      // console.log('Brill_POS_Tagger.read_lexicon: number of lexicon entries read: ' + Object.keys(that.lexicon).length);
    }
    catch (error) {
      console.error(error);
    }
    if (defaultCategory) {
      this.defaultCategory = defaultCategory;
      if (defaultCategoryCapitalised) {
        this.defaultCategoryCapitalised = defaultCategoryCapitalised;
      }
    }
  }
}

// Parses a lexicon in text format: word cat1 cat2 ... catn
Lexicon.prototype.parseLexicon = function(data) {
  // Split into an array of non-empty lines
  var arrayOfLines = data.match(/[^\r\n]+/g);
  this.lexicon = {};
  var that = this;
  arrayOfLines.forEach(function(line) {
    // Split line by whitespace
    var elements = line.trim().split(/\s+/);
    if (elements.length > 0) {
      that.lexicon[elements[0]] = elements.slice(1);
    }
  });
};

// Returns a list of categories for word
Lexicon.prototype.tagWord = function(word) {
  var categories = this.lexicon[word];
  if (!categories) {
    categories = this.lexicon[word.toLowerCase()];
  }
  if (!categories) {
    if (/[A-Z]/.test(word[0]) && this.defaultCategoryCapitalised) {
      // Capitalised
      categories = [this.defaultCategoryCapitalised];
    }
    else {
      // If not found assign default_category
      categories = [this.defaultCategory];
    }
  }
  return(categories);
};

// Adds a word to the lexicon. NB simply replaces the entry
Lexicon.prototype.addWord = function(word, categories) {
  this.lexicon[word] = categories;
};

Lexicon.prototype.prettyPrint = function() {
  var result = "";
  var that = this;
  Object.keys(this.lexicon).forEach(function(token) {
    result += token + "\t";
    that.lexicon[token].forEach(function(cat) {
      result += cat + "\t";
    });
    result += "\n";
  });
  return result;
};

Lexicon.prototype.nrEntries = function() {
  return Object.keys(this.lexicon).length;
};

Lexicon.prototype.setDefaultCategories = function(category, categoryCapitalised) {
  this.defaultCategory = category;
  if (categoryCapitalised) {
    this.defaultCategoryCapitalised = categoryCapitalised;
  }
};

module.exports = Lexicon;
