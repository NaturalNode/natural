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

	function runDisambiguator(disambiguateRules, word){
		var result = undefined;
	
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

	// RULE 1
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
		// Push rules 1A & 1B
		var disambiguateRules = [];
		disambiguateRules.push(disambiguateRule1A);
		disambiguateRules.push(disambiguateRule1B);

	    return runDisambiguator(disambiguateRules, word);
	}

	// RULE 2
	function disambiguateRule2(word){
		// Rule 2 : berCAP -> ber-CAP where C != 'r' AND P != 'er'
		var matches = word.match(/^ber([bcdfghjklmnpqrstvwxyz])([a-z])(.*)/);
	    if(matches){
	    	if(matches[3].match(/^er(.*)$/)){
	    		return
	    	}
	        return matches[1] + matches[2] + matches[3];
	    }
	}

	PrefixRules.DisambiguatorPrefixRule2 = function(word){
		// Push rule 2
		var disambiguateRules = [];
		disambiguateRules.push(disambiguateRule2);

	    return runDisambiguator(disambiguateRules, word);
	}

	// RULE 3
	function disambiguateRule3(word){
		// Rule 3 : berCAerV -> ber-CAerV where C != 'r'
		var matches = word.match(/ber([bcdfghjklmnpqrstvwxyz])([a-z])er([aiueo])(.*)/);
	    if(matches){
	    	if(matches[1] == "r"){
	    		return
	    	}
	        return matches[1] + matches[2] + "er" + matches[3] + matches[4];
	    }
	}

	PrefixRules.DisambiguatorPrefixRule3 = function(word){
		// Push rule 3
		var disambiguateRules = [];
		disambiguateRules.push(disambiguateRule3);

	    return runDisambiguator(disambiguateRules, word);
	}

	// RULE 4
	function disambiguateRule4(word){
		// Rule 4 : belajar -> ajar
		if(word == "belajar"){
			return "ajar";
		}
	}

	PrefixRules.DisambiguatorPrefixRule4 = function(word){
		// Push rule 4
		var disambiguateRules = [];
		disambiguateRules.push(disambiguateRule4);

	    return runDisambiguator(disambiguateRules, word);
	}

	// RULE 5
	function disambiguateRule5(word){
		// Rule 5 : beC1erC2 -> be-C1erC2 where C1 != 'r'
		var matches = word.match(/be([bcdfghjklmnpqstvwxyz])(er[bcdfghjklmnpqrstvwxyz])(.*)$/);
	    if(matches){
	        return matches[1] + matches[2] + matches[3];
	    }
	}

	PrefixRules.DisambiguatorPrefixRule5 = function(word){
		// Push rule 5
		var disambiguateRules = [];
		disambiguateRules.push(disambiguateRule5);

	    return runDisambiguator(disambiguateRules, word);
	}

	// RULE 6
	function disambiguateRule6a(word){
		// Rule 6a : terV -> ter-V
		var matches = word.match(/^ter([aiueo].*)$/);
	    if(matches){
	        return matches[1];
	    }
	}

	function disambiguateRule6b(word){
		// Rule 6b : terV -> te-rV
		var matches = word.match(/^ter([aiueo].*)$/);
	    if(matches){
	        return "r" + matches[1];
	    }
	}

	PrefixRules.DisambiguatorPrefixRule6 = function(word){
		// Push rule 6
		var disambiguateRules = [];
		disambiguateRules.push(disambiguateRule6a);
		disambiguateRules.push(disambiguateRule6b);

	    return runDisambiguator(disambiguateRules, word);
	}
}

module.exports 	= PrefixRules;

// Initalize prefix rules array
var rules 		= [];
var pr = new PrefixRules();

rules.push(pr.RemovePlainPrefix);
rules.push(pr.DisambiguatorPrefixRule1);
rules.push(pr.DisambiguatorPrefixRule2);
rules.push(pr.DisambiguatorPrefixRule3);
rules.push(pr.DisambiguatorPrefixRule4);
rules.push(pr.DisambiguatorPrefixRule5);
rules.push(pr.DisambiguatorPrefixRule6);

PrefixRules.rules = rules;