/*
  Sentence class specific for MaxEnt modeling
  Copyright (C) 2019 Hugo W.L. ter Doest

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

var util = require('util');
var Context = require('../Context');
var Sentence = require('../../../brill_pos_tagger/lib/Sentence');
var Element = require('./POS_Element');


function ME_Sentence(data) {
   ME_Sentence.super_.call(this, data);
}

util.inherits(ME_Sentence, Sentence);

ME_Sentence.prototype.generateSampleElements = function(sample) {
  var sentence = this.taggedWords;
  sentence.forEach(function(token, index) {
    var x = new Element(
      token.tag,
      new Context({
        wordWindow: {},
        tagWindow: {}
      })
    );

    // Current word and tag
    x.b.data.wordWindow["0"] = token.token;
    x.b.data.tagWindow["0"] = sentence[index].tag;

    // Previous bigram
    if (index > 1) {
      x.b.data.tagWindow["-2"] = sentence[index - 2].tag;
      x.b.data.wordWindow["-2"] = sentence[index - 2].token;
    }

    // Left bigram
    if (index > 0) {
      x.b.data.tagWindow["-1"] = sentence[index - 1].tag;
      x.b.data.wordWindow["-1"] = sentence[index - 1].token;
    }

    // Right bigram
    if (index < sentence.length - 1) {
      x.b.data.tagWindow["1"] = sentence[index + 1].tag;
      x.b.data.wordWindow["1"] = sentence[index + 1].token;
    }

    // Next bigram
    if (index < sentence.length - 2) {
      x.b.data.tagWindow["2"] = sentence[index + 2].tag;
      x.b.data.wordWindow["2"] = sentence[index + 2].token;
    }

    sample.addElement(x);
  });
};

module.exports = ME_Sentence;
