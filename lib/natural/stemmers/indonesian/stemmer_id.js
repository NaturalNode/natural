/*
Copyright (c) 2017, Alif Bhaskoro, Andy Librian, R. Kukuh (Reimplemented from https://github.com/sastrawi/sastrawi)

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
    // Set to lowercase
    token = token.toLowerCase();

    //Initiate everything
    removals = [];

    if(isPlural(token)){
        return stemPluralWord(token);
    }
    else{
        return stemSingularWord(token);
    }
};

// Stem for plural word
function stemPluralWord(plural_word){
    var matches = plural_word.match(/^(.*)-(.*)$/);
    if(!matches){
        return plural_word;
    }
    words = [matches[1], matches[2]];

    //malaikat-malaikat-nya -> malaikat malaikat-nya
    suffix = words[1];
    suffixes = ["ku", "mu", "nya", "lah", "kah", "tah", "pun"];
    matches = words[0].match(/^(.*)-(.*)$/);
    if(suffixes.indexOf(suffix) != -1 && matches){
        words[0] = matches[1];
        words[1] = matches[2] + '-' + suffix;
    }

    //berbalas-balasan -> balas
    rootWord1 = stemSingularWord(words[0]);
    rootWord2 = stemSingularWord(words[1]);

    //meniru-nirukan -> tiru
    if(!find(words[1]) && rootWord2==words[1]){
        rootWord2 = stemSingularWord("me" + words[1]);
    }
    if(rootWord1==rootWord2){
        return rootWord1;
    }
    else{
        return plural_word;
    }
}

// Stem for singular word
function stemSingularWord(word){
    original_word = word; // Save the original word for reverting later
    current_word = word;

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
    //var dirname = __dirname + "/../../../../data/kata-dasar.txt";
    //var fin = fs.readFileSync(dirname).toString().split("\n");
    var fin = require('./data/kata-dasar.json');
    fin.forEach(function (word) {
        if (word) {
          dictionary.push(word.trim());
        }
    });
}

// Stemming from step 2-5
function stemmingProcess(){
    if(find(current_word))
        return

    // Confix Stripping
    // Try to remove prefixes first before suffixes if the specification is met
    if(precedenceAdjustmentSpecification(original_word)){
        // Step 4, 5
        removePrefixes();
        if(find(current_word))
            return

        // Step 2, 3
        removeSuffixes();
        if(find(current_word)){
            return
        }
        else{
            // if the trial is failed, restore the original word
            // and continue to normal rule precedence (suffix first, prefix afterwards)
            current_word = original_word;
            removals = []
        }
    }

    // Step 2, 3
    removeSuffixes();
    if(find(current_word))
        return

    // Step 4, 5
    removePrefixes();
    if(find(current_word))
        return

    //ECS Loop Restore Prefixes
    loopRestorePrefixes();
}

// Remove Suffixes
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

// Remove Prefixes
function removePrefixes(){
    for(var i=0; i<3; i++){
        var removalCount = removals.length;
        checkPrefixRules();
        if(find(current_word))
            return current_word;
    }
}

function checkPrefixRules(){
    var removalCount = removals.length;
    var j = 0;
    for(j=0; j<prefix_rules.length; j++){
        resultObj = prefix_rules[j](current_word);

        // Add result to variable
        if(resultObj.removal!=undefined){
            removals.push(resultObj.removal);
        }
        current_word = resultObj.current_word;

        if(find(current_word))
            return current_word;
        if(removals.length>removalCount){
            return
        }
    }
}

// Loop Restore Prefixes
function loopRestorePrefixes(){
    restorePrefix();

    var reversed_removals = removals.reverse();
    var temp_current_word = current_word;

    for(var i in reversed_removals){
        current_removal = reversed_removals[i];

        if(!isSuffixRemovals(current_removal)){
            continue
        }

        if(current_removal.getRemovedPart() == "kan"){
            current_word = current_removal.getResult() + "k";

            // Step 4, 5
            removePrefixes();
            if(find(current_word))
                return
            current_word = current_removal.getResult() + "kan";
        }
        else{
            current_word = current_removal.getOriginalWord();
        }

        // Step 4, 5
        removePrefixes();
        if(find(current_word))
            return

        current_word = temp_current_word;
    }
}

function isSuffixRemovals(removal){
    var type = removal.getAffixType();
    if(type == "DS" || type == "PP" || type == "P"){
        return true;
    }
    return false;
}
function restorePrefix(){
    for(var i=0; i<removals.length; i++){
        current_word = removals[i].getOriginalWord();
        break;
    }

    for(var i=0; i<removals.length; i++){
        if(removals[i].getAffixType() == "DP"){
            removals.splice(i, 1);
            i--;
        }
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
stemmer.a = suffix_rules[0];
