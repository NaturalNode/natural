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

	// RULE 7
	function disambiguateRule7(word){
		// Rule 7 : terCerv -> ter-CerV where C != 'r'
		var matches = word.match(/^ter([bcdfghjklmnpqrstvwxyz])er([aiueo].*)$/);
	    if(matches){
	    	if(matches[1]=="r"){
	    		return
	    	}
	        return matches[1] + "er" + matches[2];
	    }
	}

	PrefixRules.DisambiguatorPrefixRule7 = function(word){
		// Push rule 7
		var disambiguateRules = [];
		disambiguateRules.push(disambiguateRule7);

	    return runDisambiguator(disambiguateRules, word);
	}

	// RULE 8
	function disambiguateRule8(word){
		// Rule 8 : terCP -> ter-CP where C != 'r' and P != 'er'
		var matches = word.match(/^ter([bcdfghjklmnpqrstvwxyz])(.*)$/);
	    if(matches){
	    	if(matches[1]=="r" || matches[2].match(/^er(.*)$/)){
	    		return
	    	}
	        return matches[1] + matches[2];
	    }
	}

	PrefixRules.DisambiguatorPrefixRule8 = function(word){
		// Push rule 8
		var disambiguateRules = [];
		disambiguateRules.push(disambiguateRule8);

	    return runDisambiguator(disambiguateRules, word);
	}

	// RULE 9
	function disambiguateRule9(word){
		// Rule 9 : te-C1erC2 -> te-C1erC2 where C1 != 'r'
		var matches = word.match(/^te([bcdfghjklmnpqrstvwxyz])er([bcdfghjklmnpqrstvwxyz])(.*)$/);
	    if(matches){
	    	if(matches[1]=="r"){
	    		return
	    	}
	        return matches[1] + "er" + matches[2] + matches[3];
	    }
	}

	PrefixRules.DisambiguatorPrefixRule9 = function(word){
		// Push rule 9
		var disambiguateRules = [];
		disambiguateRules.push(disambiguateRule9);

	    return runDisambiguator(disambiguateRules, word);
	}

	// RULE 10
	function disambiguateRule10(word){
		// Rule 10 : me{l|r|w|y}V -> me-{l|r|w|y}V
		var matches = word.match(/^me([lrwy])([aiueo])(.*)$/);
	    if(matches){
	        return matches[1] + matches[2] + matches[3];
	    }
	}

	PrefixRules.DisambiguatorPrefixRule10 = function(word){
		// Push rule 10
		var disambiguateRules = [];
		disambiguateRules.push(disambiguateRule10);

	    return runDisambiguator(disambiguateRules, word);
	}

	// RULE 11
	function disambiguateRule11(word){
		// Rule 11 : mem{b|f|v} -> mem-{b|f|v}
		var matches = word.match(/^mem([bfv])(.*)$/);
	    if(matches){
	        return matches[1] + matches[2];
	    }
	}

	PrefixRules.DisambiguatorPrefixRule11 = function(word){
		// Push rule 11
		var disambiguateRules = [];
		disambiguateRules.push(disambiguateRule11);

	    return runDisambiguator(disambiguateRules, word);
	}

	// RULE 12
	function disambiguateRule12(word){
		// Nazief and Adriani Rule 12 : beC1erC2 -> be-C1erC2 where C1 != 'r'
        // Modified by Jelita Asian's CS Rule 12 : mempe -> mem-pe to stem mempengaruhi
		var matches = word.match(/^mempe(.*)$/);
	    if(matches){
	        return "pe" + matches[1];
	    }
	}

	PrefixRules.DisambiguatorPrefixRule12 = function(word){
		// Push rule 12
		var disambiguateRules = [];
		disambiguateRules.push(disambiguateRule12);

	    return runDisambiguator(disambiguateRules, word);
	}

	// RULE 13
	function disambiguateRule13a(word){
		// Rule 13a : mem{rV|V} -> me-m{rV|V}
		var matches = word.match(/^mem([aiueo])(.*)$/);
	    if(matches){
	        return "m" + matches[1] + matches[2];
	    }
	}

	function disambiguateRule13b(word){
		// Rule 13b : mem{rV|V} -> me-p{rV|V}
		var matches = word.match(/^mem([aiueo])(.*)$/);
	    if(matches){
	        return "p" + matches[1] + matches[2];
	    }
	}

	PrefixRules.DisambiguatorPrefixRule13 = function(word){
		// Push rule 13
		var disambiguateRules = [];
		disambiguateRules.push(disambiguateRule13a);
		disambiguateRules.push(disambiguateRule13b);

	    return runDisambiguator(disambiguateRules, word);
	}

	// RULE 14
	function disambiguateRule14(word){
		/*Rule 14 modified by Andy Librian : men{c|d|j|s|t|z} -> men-{c|d|j|s|t|z}
        in order to stem mentaati
  
        Rule 14 modified by ECS: men{c|d|j|s|z} -> men-{c|d|j|s|z}
        in order to stem mensyaratkan, mensyukuri
  
        Original CS Rule no 14 was : men{c|d|j|z} -> men-{c|d|j|z}*/
		var matches = word.match(/^men([cdjstz])(.*)$/);
	    if(matches){
	        return matches[1] + matches[2];
	    }
	}

	PrefixRules.DisambiguatorPrefixRule14 = function(word){
		// Push rule 14
		var disambiguateRules = [];
		disambiguateRules.push(disambiguateRule14);

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
rules.push(pr.DisambiguatorPrefixRule7);
rules.push(pr.DisambiguatorPrefixRule8);
rules.push(pr.DisambiguatorPrefixRule9);
rules.push(pr.DisambiguatorPrefixRule10);
rules.push(pr.DisambiguatorPrefixRule11);
rules.push(pr.DisambiguatorPrefixRule12);
rules.push(pr.DisambiguatorPrefixRule13);
rules.push(pr.DisambiguatorPrefixRule14);

PrefixRules.rules = rules;