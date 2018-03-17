/*
Copyright (c) 2017, Alif Bhaskoro, Andy Librian, R. Kukuh (Reimplemented from https://github.com/sastrawi/sastrawi)

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

// a list of commonly used words that have little meaning and can be excluded
// from analysis.

var Removal = require("./removal");

SuffixRules = function() {
	var SuffixRules = this;

	this.removal = undefined;
	this.current_word = undefined;

	function createResultObject(result, word, type){
		if(result!=word){
			var removedPart = word.replace(result, '');

			var removal = new Removal(word, result, removedPart, type);

			this.removal = removal;
		}
		else{
			this.removal = undefined;
		}
		this.current_word = result;
		return this;
	}

	SuffixRules.RemoveInflectionalParticle = function(word){
		var result = word.replace(/-*(lah|kah|tah|pun)$/, '');
		return createResultObject(result, word, "P");
	}

	SuffixRules.RemoveInflectionalPossessivePronoun = function(word){
		var result = word.replace(/-*(ku|mu|nya)$/, '');
		return createResultObject(result, word, "PP");
	}

	SuffixRules.RemoveDerivationalSuffix = function(word){
		var result = word.replace(/(is|isme|isasi|i|kan|an)$/, '');
		return createResultObject(result, word, "DS");
	}
}

module.exports = SuffixRules;

// Initalize suffix rules array
var rules = [];
var sr = new SuffixRules();

rules.push(sr.RemoveInflectionalParticle);
rules.push(sr.RemoveInflectionalPossessivePronoun);
rules.push(sr.RemoveDerivationalSuffix);

SuffixRules.rules = rules;