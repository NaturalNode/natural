var Removal = require("./removal");

// Make global variable for dictionary
var dictionary = [];
function loadDictionary(){
    var fs = require('fs');
    var fin = fs.readFileSync('data/kata-dasar.txt').toString().split("\n");
    for(var i in fin){
        var word = fin[i];
        word = word.trim();
        dictionary.push(word);
    }
}
loadDictionary();

PrefixRules = function() {
	var PrefixRules = this;

	this.removal = undefined;
	this.current_word = undefined;

	// Find certain word in dictionary
	function find(word) {
	    return (dictionary.indexOf(word) != -1);
	}

	function createResultObject(result, word, type){
		var removedPart = word.replace(result, '');
		var removal = new Removal(word, result, removedPart, type);

		this.removal = removal;
		this.current_word = result;
		
		return this;
	}

	PrefixRules.RemovePlainPrefix = function(word){
		var result = word.replace(/^(di|ke|se)/, '');
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

	function disambiguateRule1A(word){
		// Rule 1a : berV -> ber-V
		var matches = word.match(/^ber([aiueo].*)$/);
	    if(matches){
	        return matches[1];
	    }
	}

	function disambiguateRule1B(word){
		// Rule 1b : berV -> be-rV
	    var matches = word.match(/^ber([aiueo].*)$/);
	    if(matches){
	        return 'r' + matches[1];
	    }
	}

	PrefixRules.DisambiguatorPrefixRule1 = function(word){
		var result = undefined;

		// Push rules 1A & 1B
		var disambiguateRules = [];
		disambiguateRules.push(disambiguateRule1A);
		disambiguateRules.push(disambiguateRule1B);

	    for(var i in disambiguateRules){
	    	result = disambiguateRules[i](word);
	    	if(find(result)){
	    		break;
	    	}
	    }

	    if(result==undefined){
	    	this.current_word = word;
	    	this.removal = undefined;
	    	return this;
	    }

	    return createResultObject(result, word, "DP");
	}
}

module.exports 	= PrefixRules;

// Initalize prefix rules array
var rules 		= [];
var pr = new PrefixRules();

rules.push(pr.RemovePlainPrefix);
rules.push(pr.DisambiguatorPrefixRule1);

PrefixRules.rules = rules;