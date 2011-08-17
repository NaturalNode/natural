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

var Stemmer = require('./stemmer');
var ruleTable = require('./lancaster_rules').rules;

function acceptable(candidate) {
    if(candidate.match(/^[aeiou]/))
	return (candidate.length > 1);
    else 
	return (candidate.length > 2 && candidate.match(/[aeiouy]/));
}

// take a token, look up the applicatble rule section and attempt some stemming!
function applyRuleSection(token, intact) {
    var section = token.substr(-1);
    var rules = ruleTable[section];
    
    if(rules) {
        for(var i = 0; i < rules.length; i++) {
            if((intact || !rules[i].intact) // only apply intact rules to intact tokens
                    && token.substr(0 - rules[i].pattern.length) == rules[i].pattern) {
                // hack off only as much as the rule indicates
                var result = token.substr(0, token.length - rules[i].size);

                // if the rules wants us to apply an appendage do so
                if(rules[i].appendage)
                    result += rules[i].appendage;
                
		if(acceptable(result)) {
		    token = result;

		    // see what the rules wants to do next
		    if(rules[i].continuation) {
			// this rule thinks there still might be stem left. keep at it.
			// since we've applied a change we'll pass false in for intact
			return applyRuleSection(result, false);
		    } else {
			// the rule thinks we're done stemming. drop out.
			return result;
		    }
		}
            }
        }
    }
    
    return token;
}

var LancasterStemmer = new Stemmer();
module.exports = LancasterStemmer;

LancasterStemmer.stem = function(token) {
    return applyRuleSection(token.toLowerCase(), true);
}


