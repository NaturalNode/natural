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
function Lexicon(filename, defaultCategory) {
  this.defaultCategory = defaultCategory;
  var that = this;

  // Read lexicon
  try {
    var data = fs.readFileSync(filename, 'utf8');
    if (data[0] === "{") {
      // Lexicon is in JSON format
      that.lexicon = JSON.parse(data);
    }
    else {
      // Lexicon is plain text
      that.parseLexicon(data);
    }
    // console.log('Brill_POS_Tagger.read_lexicon: number of lexicon entries read: ' + Object.keys(that.lexicon).length);
  }
  catch(error) {
    console.error(error);
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
    // If not found assign default_category
    categories = [this.defaultCategory];
  }
  return(categories);
};

module.exports = Lexicon;
