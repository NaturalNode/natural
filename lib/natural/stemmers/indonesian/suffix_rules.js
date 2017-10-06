var Removal = require("./removal");

SuffixRules = function() {
	var SuffixRules = this;

	var removal;
	var current_word;

	function createResultObject(result, word){
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

	SuffixRules.RemoveInflectionalParticle = function(word){
		var result = word.replace(/-*(lah|kah|tah|pun)$/, '');
		return createResultObject(result, word);
	}

	SuffixRules.RemoveInflectionalPossessivePronoun = function(word){
		var result = word.replace(/-*(ku|mu|nya)$/, '');
		return createResultObject(result, word);
	}

	SuffixRules.RemoveDerivationalSuffix = function(word){
		var result = word.replace(/(is|isme|isasi|i|kan|an)$/, '');
		return createResultObject(result, word);
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