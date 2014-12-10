
var Trie = require('../trie/trie');

// takes a list of words 
function Spellcheck(wordlist) {
    this.trie = new Trie();
    this.trie.addStrings(wordlist);
    this.word2frequency = {};

    for(var i in wordlist) {
        if(!this.word2frequency[wordlist[i]]) {
            this.word2frequency[wordlist[i]] = 0;
        }
        this.word2frequency[wordlist[i]]++;
    }
}

Spellcheck.prototype.isCorrect = function(word) {
    return this.trie.contains(word);
}

Spellcheck.prototype.getCorrections = function(word) {
    var self = this;
    return this.editsUpToDistance([word], 1).filter(function(word) { return self.isCorrect(word); })
                       .map(function(word) { return [word, self.word2frequency[word]]; })
                       .sort(function(a,b) { return a[1] > b[1] ? -1 : 1; })
                       .map(function(wordscore) { return wordscore[0]; });
}

// return all edits that are 1 edit-distance away from the input word
Spellcheck.prototype.edits = function(word) {
    var alphabet = 'abcdefghijklmnopqrstuvwxyz';
    var edits = [];
    for(var i=0; i<word.length+1; i++) {
        if(i>0) edits.push(word.slice(0,i-1)+word.slice(i,word.length)); // deletes
        if(i>0 && i<word.length+1) edits.push(word.slice(0,i-1) + word.slice(i,i+1) + word.slice(i-1, i) + word.slice(i+1,word.length)); // transposes
        for(var k=0; k<alphabet.length; k++) {
            if(i>0) edits.push(word.slice(0,i-1)+alphabet[k]+word.slice(i,word.length)); // replaces
            edits.push(word.slice(0,i)+alphabet[k]+word.slice(i,word.length)); // inserts
        }
    }
    // Deduplicate edits
    edits = edits.filter(function (v, i, a) { return a.indexOf(v) == i });
    return edits;
}


// returns all edits up to the distance specified
//TODO: Come up with a better name for this
Spellcheck.prototype.editsUpToDistance = function(words, depth) {
    if(typeof words == 'string') words = [words];
    if(depth == 0) {
        return [];
    }
    var deeper = [];
    for(var i in words) {
        deeper = deeper.concat(this.edits(words[i]));    
    }
    deeper = deeper.concat(this.editsUpToDistance(deeper,depth-1));
    return deeper;
}

module.exports = Spellcheck;
