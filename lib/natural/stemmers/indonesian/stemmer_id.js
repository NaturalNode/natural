/*
Copyright (c) 2017, Alif Bhaskoro

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

var baseStemmer = require('./base_stemmer_id');
var stemmer = new baseStemmer();

// Dictionary
var dictionary = [];
loadDictionary();

// Rules
var SuffixRules = require("./suffix_rules");
var PrefixRules = require("./prefix_rules");

var suffix_rules = SuffixRules.rules;
var prefix_rules = PrefixRules.rules;

// Removals
var removals;

// Words
var original_word;
var current_word;

module.exports = stemmer;

// perform full stemming algorithm on a single word
stemmer.stem = function(token) {
    // Cache stemmer not yet implemented
    //Initiate everything
    removals = [];
    original_word = token; // Save the original word for reverting later
    current_word = token;

    if(isPlural(token)){
        console.log("plural hasnt been handled yet");
        return 1;
    }
    else{
        // Step 1
        if(current_word.length>3){
            // Step 2-5
            stemmingProcess();
        }
        
        // Step 6
        if(find(current_word)){
            return current_word;
        }
        else{
            return original_word;
        }
    }
};

// Return true if word is in plural form ex: gelas-gelas, else false
function isPlural(token){
    var matches = token.match(/^(.*)-(ku|mu|nya|lah|kah|tah|pun)$/);
    if(matches){
        return matches[1].search('-') != -1;
    }
    return token.search('-') != -1;
}

// Find certain word in dictionary
function find(word) {
    return (dictionary.indexOf(word) != -1);
}

function loadDictionary(){
    var fs = require('fs');
    var fin = fs.readFileSync('data/kata-dasar.txt').toString().split("\n");
    for(var i in fin){
        var word = fin[i];
        word = word.trim();
        dictionary.push(word);
    }
}

// Stemming from step 2-5
function stemmingProcess(){
    if(find(current_word))
        return
    
    // Confix Stripping
    // Try to remove prefixes first before suffixes if the specification is met
    if(precedenceAdjustmentSpecification(original_word)){

    }

    removeSuffixes();
    if(find(current_word))
        return

    // Remove Suffixes


    // Remove Prefixes
}

function removeSuffixes(){
    for(var i in suffix_rules){
        resultObj = suffix_rules[i](current_word);
        
        // Add result to variable
        if(resultObj.removal!=undefined){
            removals.push(resultObj.removal);
        }
        current_word = resultObj.current_word;

        if(find(current_word))
            return current_word;
    }
}

// Check if word require precedence adjustment or not
// Adjustment means remove prefix then suffix instead of remove suffix then prefix
function precedenceAdjustmentSpecification(word){
    var regex_rules = [
        /^be(.*)lah$/,
        /^be(.*)an$/,
        /^me(.*)i$/,
        /^di(.*)i$/,
        /^pe(.*)i$/,
        /^ter(.*)i$/,
    ];
    
    for(var i in regex_rules){
        if(word.match(regex_rules[i])){
            return true;
        }
    }
    return false;
}

//exports for tests
stemmer.isPlural = isPlural;
stemmer.dictionary = dictionary;
stemmer.a = prefix_rules[14];