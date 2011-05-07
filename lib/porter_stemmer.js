/*
Copyright (c) 2011, Chris Umbel
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
3. Neither the name of the PostgreSQL Global Development Group nor the names
   of its contributors may be used to endorse or promote products derived
   from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
*/

require('./tokenizers').attach();
stopwords = require('./stopwords');

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

    if(!measureThreshold || measure(token) > measureThreshold) {
        for(var i = 0; i < replacements.length; i++) {
            replacement = attemptReplace(token, replacements[i][0], replacements[i][1]);

            if(replacement)
                break;
        }
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
 
    if(token.substr(-1) == 's' && token.substr(-2, 1) != 's')
        return token.replace(/s?$/, '');
    
    return token;
}

// step 1b as defined for the porter stemmer algorithm. 
function step1b(token) {
    if(measure(token) > 0)
        if(token.substr(-3) == 'eed')
            return token.replace(/eed$/, 'ee');

    if(categorizeGroups(token).substr(-2, 1) == 'V') {
        result = attemptReplace(token, /ed|ing$/, '', function(token) {
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
    return replacePatterns(token, [['ational', 'ate'], ['enci', 'ence'], ['anci', 'ance'],
        ['izer', 'ize'], ['abli', 'able'], ['alli', 'all'], ['entli', 'ent'], ['eli', 'e'],
        ['ousli', 'ous'], ['ization', 'ize'], ['ation', 'ate'], ['alism', 'al'],
        ['iveness', 'ive'], ['fulness', 'ful'], ['ousness', 'ous'], ['aliti', 'al'],
        ['iviti', 'ive'], ['biliti', 'ble']], 0);
}

// step 3 as defined for the porter stemmer algorithm. 
function step3(token) {
    return replacePatterns(token, [['icate', 'ic'], ['ative', ''], ['alize', 'al'],
        ['iciti', 'ic'], ['ful', ''], ['ness', '']], 0); 
}

// step 4 as defined for the porter stemmer algorithm. 
function step4(token) {
    return replacePatterns(token, [['al', ''], ['ance', ''], ['ence', ''], ['er', ''], 
        ['ic', ''], ['able', ''], ['ible', ''], ['ant', ''],
        ['ement', ''], [/([st])ion/, '$1'], ['ou', ''], ['ism', ''],
        ['ate', ''], ['iti', ''], ['ous', ''], ['ive', ''], 
        ['ize', '']], 1);
}

// step 5a as defined for the porter stemmer algorithm. 
function step5a(token) {
    var m = measure(token);
    
    if((m > 1 && token.substr(-1) == 'e') || (m == 1 && !(categorizeChars(token).substr(-4, 3) == 'CVC' && token.match(/[^wxy].$/))))
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

// perform full stemming algorithm on a single word
function stem(token) {
    return step5b(step5a(step4(step3(step2(step1c(step1b(step1a(token.toLowerCase())))))))).toString();
}

// tell the rest of the world about the stem function
exports.stem = stem;

// expose an attach function that will patch String with stemming methods
exports.attach = function() {
    String.prototype.stem = function() {
        return stem(this);
    };
    
    String.prototype.tokenizeAndStem = function(keepStops) {
        var stemmedTokens = [];
        
        this.tokenize().forEach(function(token) {
            if(keepStops || stopwords.words.indexOf(token) == -1)
                stemmedTokens.push(token.stem());
        });
        
        return stemmedTokens;
    }
};
