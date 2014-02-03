/*
 Copyright (c) 2013, Kenneth Koch

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

/**
 * The english normalizer will create a string in which all contractions are expanded to their 
 * full meaning (i.e. "we'll" becomes "we will"). 
 *
 * It currently works off a conversion table and falls back to a set of rules.
 * Since it is applied first, the conversion table provides an "override" for the rules.
 **/
var replacer = require('../util/utils').replacer;

var conversionTable = {
	"can't":"cannot",
	"won't":"will not",
	"couldn't've":"could not have",
	"i'm":"I am",
	"how'd":"how did"
};

var rules = [
	{ regex: /([azAZ]*)n\'[tT]/g, output: "$1 not" },
	{ regex: /([azAZ]*)\'[sS]/g, output: "$1 is" },
	{ regex: /([azAZ]*)\'[lL][lL]/g, output: "$1 will" },
	{ regex: /([azAZ]*)\'[rR][eE]/g, output: "$1 are" },
	{ regex: /([azAZ]*)\'[vV][eE]/g, output: "$1 have" },
	{ regex: /([azAZ]*)\'[dD]/g, output: "$1 would" },
];

// Accepts a list of tokens to expand.
var normalize_tokens = function(tokens) {
	var rule_count = rules.length;
	var num_tokens = tokens.length;
	for(var i = 0 ; i < num_tokens ; i++) {
		var token = tokens[i];

		// check the covnersion table.
		if(conversionTable[token.toLowerCase()]) {
			tokens.splice.apply(tokens, [i, 1].concat(token.replace(token, conversionTable[token.toLowerCase()]).split(/\W+/)));

			// reset the tokens counter
			// NOTE: This may not be ideal, the idea is that messing with the array
			// could affect looping over it. Need to find out if theres ever going to 
			// be a case where a rule conversion could result in another contraction which needs to
			// be expanded, if that is the case, we need this.
			i = 0;
			var num_tokens = tokens.length;
		}
		// Apply the rules
		else { 
			for(var r = 0 ; r < rule_count ; r++) {
				var rule = rules[r];
				if(token.match(rule.regex)) {
					tokens.splice.apply(tokens, [i, 1].concat(token.replace(rule.regex, rule.output).split(/\W+/)));

					// reset the tokens counter
					// NOTE: This may not be ideal, the idea is that messing with the array
					// could affect looping over it. Need to find out if theres ever going to 
					// be a case where a rule conversion could result in another contraction which needs to
					// be expanded, if that is the case, we need this.
					i = 0;
					var num_tokens = tokens.length;
					break ;
				}
			}
		}
	}

	return tokens;
};





// export the relevant stuff.
exports.normalize_tokens = normalize_tokens;




