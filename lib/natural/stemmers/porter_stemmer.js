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

// denote groups of consecutive consonants with a C and consecutive vowels
// with a V.
function categorizeGroups(token) {
    return token.replace(/[^aeiou]+/g, 'C').replace(/[aeiouy]+/g, 'V');
}

// denote single consonants with a C and single vowels with a V
function categorizeChars(token) {
    return token.replace(/[^aeiou]/g, 'C').replace(/[aeiouy]/g, 'V');
}

// calculate the "measure" M of a word. M is the count of VC sequences dropping
// an initial C if it exists and a trailing V if it exists.
function measure(token) {
    if(!token)
	return -1;

    return categorizeGroups(token).replace(/^C/, '').replace(/V$/, '').length / 2;
}

// determine if a token end with a double consonant i.e. happ
function endsWithDoublCons(token) {
    return token.match(/([^aeiou])\1$/);
}

// replace a pattern in a word. if a replacement occurs an optional callback
// can be called to post-process the result. if no match is made NULL is
// returned.
function attemptReplace(token, pattern, replacement, callback) {
    var result = null;
    
    if((typeof pattern == 'string') && token.substr(0 - pattern.length) == pattern)
        result = token.replace(new RegExp(pattern + '$'), replacement);
    else if((pattern instanceof RegExp) && token.match(pattern))
        result = token.replace(pattern, replacement);
        
    if(result && callback)
        return callback(result);
    else
        return result;
}

// attempt to replace a list of patterns/replacements on a token for a minimum
// measure M.
function attemptReplacePatterns(token, replacements, measureThreshold) {
    var replacement = null;

    for(var i = 0; i < replacements.length; i++) {
	if(measureThreshold == null || measure(attemptReplace(token, replacements[i][0], '')) > measureThreshold)
	    replacement = attemptReplace(token, replacements[i][0], replacements[i][1]);

	if(replacement)
	    break;
    }
    
    return replacement;
}

// replace a list of patterns/replacements on a word. if no match is made return
// the original token.
function replacePatterns(token, replacements, measureThreshold) {
    var result = attemptReplacePatterns(token, replacements, measureThreshold);
    token = result == null ? token : result;
    
    return token;
}

// step 1a as defined for the porter stemmer algorithm. 
function step1a(token) {    
    if(token.match(/(ss|i)es$/))
        return token.replace(/(ss|i)es$/, '$1');
 
    if(token.substr(-1) == 's' && token.substr(-2, 1) != 's' && token.length > 3)
        return token.replace(/s?$/, '');
    
    return token;
}

// step 1b as defined for the porter stemmer algorithm. 
function step1b(token) {   
    if(token.substr(-3) == 'eed') {
    if(measure(token.substr(0, token.length - 3)) > 0)
            return token.replace(/eed$/, 'ee');
    } else {
    var result = attemptReplace(token, /ed|ing$/, '', function(token) {     
        if(categorizeGroups(token).indexOf('V') >= 0) {
        var result = attemptReplacePatterns(token, [['at', 'ate'],  ['bl', 'ble'], ['iz', 'ize']]);
		if(result)
		    return result;
		else {
		    if(endsWithDoublCons(token) && token.match(/[^lsz]$/))
			return token.replace(/([^aeiou])\1$/, '$1');

		    if(measure(token) == 1 && categorizeChars(token).substr(-3) == 'CVC' && token.match(/[^wxy]$/))
			return token + 'e';                            
		}

		return token;
	    }
	    
	    return null;
	});
	
	if(result)
	    return result;
    }

    return token;   
}

// step 1c as defined for the porter stemmer algorithm. 
function step1c(token) {
    if(categorizeGroups(token).substr(-2, 1) == 'V') {
        if(token.substr(-1) == 'y')
            return token.replace(/y$/, 'i');
    }
   
    return token;
}

// step 2 as defined for the porter stemmer algorithm. 
function step2(token) {
    return replacePatterns(token, [['ational', 'ate'], ['tional', 'tion'], ['enci', 'ence'], ['anci', 'ance'],
        ['izer', 'ize'], ['abli', 'able'], ['alli', 'al'], ['entli', 'ent'], ['eli', 'e'],
        ['ousli', 'ous'], ['ization', 'ize'], ['ation', 'ate'], ['ator', 'ate'],['alism', 'al'],
        ['iveness', 'ive'], ['fulness', 'ful'], ['ousness', 'ous'], ['aliti', 'al'],
        ['iviti', 'ive'], ['biliti', 'ble']], 0);
}

// step 3 as defined for the porter stemmer algorithm. 
function step3(token) {
    return replacePatterns(token, [['icate', 'ic'], ['ative', ''], ['alize', 'al'],
				   ['iciti', 'ic'], ['ical', 'ic'], ['ful', ''], ['ness', '']], 0); 
}

// step 4 as defined for the porter stemmer algorithm. 
function step4(token) {
    return replacePatterns(token, [['al', ''], ['ance', ''], ['ence', ''], ['er', ''], 
        ['ic', ''], ['able', ''], ['ible', ''], ['ant', ''],
        ['ement', ''], ['ment', ''], ['ent', ''], [/([st])ion/, '$1'], ['ou', ''], ['ism', ''],
        ['ate', ''], ['iti', ''], ['ous', ''], ['ive', ''], 
        ['ize', '']], 1);
}

// step 5a as defined for the porter stemmer algorithm. 
function step5a(token) {
    var m = measure(token);
    
    if(token.length > 3 && ((m > 1 && token.substr(-1) == 'e') || (m == 1 && !(categorizeChars(token).substr(-4, 3) == 'CVC' && token.match(/[^wxy].$/)))))
        return token.replace(/e$/, '');

    return token;
}

// step 5b as defined for the porter stemmer algorithm. 
function step5b(token) {
    if(measure(token) > 1) {
        if(endsWithDoublCons(token) && token.substr(-2) == 'll')
           return token.replace(/ll$/, 'l'); 
    }
    
    return token;
}

var PorterStemmer = new Stemmer();
module.exports = PorterStemmer;

// perform full stemming algorithm on a single word
PorterStemmer.stem = function(token) {
    return step5b(step5a(step4(step3(step2(step1c(step1b(step1a(token.toLowerCase())))))))).toString();
};

//exports for tests
PorterStemmer.step1a = step1a;
PorterStemmer.step1b = step1b;
PorterStemmer.step1c = step1c;
PorterStemmer.step2 = step2;
PorterStemmer.step3 = step3;
PorterStemmer.step4 = step4;
PorterStemmer.step5a = step5a;
PorterStemmer.step5b = step5b;
