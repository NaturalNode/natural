var Removal = require("./removal");

SuffixRules = function() {
	var SuffixRules = this;

	var removal;
	var current_word;

	SuffixRules.RemoveInflectionalParticle = function(word){
		var result = word.replace(/-*(lah|kah|tah|pun)$/, '');
		if(result!=word){
			var removedPart = word.replace(result, '');

			var removal = new Removal(word, result, removedPart, "PP");

			this.removal = removal;
		}
		else{
			this.removal = undefined;
		}

		this.current_word = result;

		return this;
	}

	SuffixRules.RemoveInflectionalPossessivePronoun = function(word){
		var result = word.replace(/-*(ku|mu|nya)$/, '');
		if(result!=word){
			var removedPart = word.replace(result, '');

			var removal = new Removal(word, result, removedPart, "PP");

			this.removal = removal;
		}
		else{
			this.removal = undefined;
		}

		this.current_word = result;

		return this;
	}

	SuffixRules.RemoveDerivationalSuffix = function(word){
		var result = word.replace(/(is|isme|isasi|i|kan|an)$/, '');
		if(result!=word){
			var removedPart = word.replace(result, '');

			var removal = new Removal(word, result, removedPart, "PP");

			this.removal = removal;
		}
		else{
			this.removal = undefined;
		}

		this.current_word = result;

		return this;
	}
}

module.exports = SuffixRules;

var rules = [];
var sr = new SuffixRules();
rules.push(sr.RemoveInflectionalParticle);
rules.push(sr.RemoveInflectionalPossessivePronoun);
rules.push(sr.RemoveDerivationalSuffix);
SuffixRules.rules = rules;