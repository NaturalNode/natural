/*
Copyright (c) 2011, Chris Umbel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

'use strict'

exports.BrillPOSTagger = require('./brill_pos_tagger/lib/Brill_POS_Tagger')
exports.BrillPOSTrainer = require('./brill_pos_tagger/lib/Brill_POS_Trainer')
exports.BrillPOSTester = require('./brill_pos_tagger/lib/Brill_POS_Tester')
exports.Lexicon = require('./brill_pos_tagger/lib/Lexicon')
exports.RuleSet = require('./brill_pos_tagger/lib/RuleSet')
exports.RuleTemplates = require('./brill_pos_tagger/lib/RuleTemplates')
exports.RuleTemplate = require('./brill_pos_tagger/lib/RuleTemplate')
exports.Corpus = require('./brill_pos_tagger/lib/Corpus')
exports.Sentence = require('./brill_pos_tagger/lib/Sentence')
