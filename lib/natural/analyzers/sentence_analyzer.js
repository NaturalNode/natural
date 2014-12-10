/*
Copyright (c) 2011, Rob Ellis, Chris Umbel

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

var _ = require("underscore")._;

/*
 Sentences Analizer Class
 From http://www.writingcentre.uottawa.ca/hypergrammar/sntpurps.html

 Take a POS input and analyse it for
  - Type of Sentense
     - Interrogative
       - Tag Questions
       - 
     - Declarative
     - Exclamatory 
     - Imperative

  - Parts of a Sentense
     - Subject
     - Predicate

  - Show Preposition Phrases
*/

var Sentences = function(pos, callback) {
    this.posObj = pos;
    this.senType = null;
    callback(this);
};

Sentences.prototype.part = function(callback) {
    var subject = [],
	predicat = [],
	verbFound = false;
	
    this.prepositionPhrases();
	
    for (var i = 0; i < this.posObj.tags.length; i++) {
        if (this.posObj.tags[i].pos == "VB") {
            if (i === 0) {
                verbFound = true;
            } else {
                // We need to Test for any EX before the VB
                if (this.posObj.tags[i - 1].pos != "EX") {
                    verbFound = true;
                } else {
                    predicat.push(this.posObj.tags[i].token);
                }					
            }
        }

        // Add Pronoun Phrase (pp) Or Subject Phrase (sp)
        if (!verbFound) {
            if (this.posObj.tags[i].pp != true)
                this.posObj.tags[i].spos = "SP";
            
            subject.push(this.posObj.tags[i].token);
        } else {
            if (this.posObj.tags[i].pp != true)
                this.posObj.tags[i].spos = "PP";
            
            predicat.push(this.posObj.tags[i].token)
        }
    }
	
    if (subject.length == 0) {
	this.posObj.tags.push({token:"You",spos:"SP",pos:"PRP",added:true});
    }
    
    callback(this);	
};

// Takes POS and removes IN to NN or NNS
// Adds a PP for each prepositionPhrases
Sentences.prototype.prepositionPhrases = function() {
    var remove = false;

    for (var i = 0; i < this.posObj.tags.length; i++) {
        if (this.posObj.tags[i].pos.match("IN")) {
            remove = true;
        }
    
        if (remove) {
            this.posObj.tags[i].pp = true;
        }
    
        if (this.posObj.tags[i].pos.match("NN")) {
            remove = false;
        }
    }	
};

Sentences.prototype.subjectToString = function() {
    return this.posObj.tags.map(function(t){ if (t.spos == "SP" || t.spos == "S" ) return t.token }).join(' ');
};

Sentences.prototype.predicateToString = function() {
    return this.posObj.tags.map(function(t){ if (t.spos == "PP" || t.spos == "P" ) return t.token }).join(' ');
};

Sentences.prototype.implicitYou = function() {
    for (var i = 0; i < this.posObj.tags.length;i++) {
        if (this.posObj.tags[i].added) {
            return true;
        }
    }
    
    return false;
};

Sentences.prototype.toString = function() {
    return this.posObj.tags.map(function(t){return t.token}).join(' ');
};

// This is quick and incomplete.
Sentences.prototype.type = function(callback) {
    var callback = callback || false;

    // Check for implicit you before popping a tag.
    var implicitYou = this.implicitYou();

    // FIXME - punct seems useless
    var lastElement = this.posObj.punct();
    lastElement = (lastElement.length != 0) ? lastElement.pop() : this.posObj.tags.pop();

    if (lastElement.pos !== ".") {
        if (implicitYou) {
            this.senType = "COMMAND";
        } else if (_(["WDT","WP","WP$","WRB"]).contains(this.posObj.tags[0].pos)) {
            // Sentences that start with: who, what where when why and how, then they are questions
            this.senType = "INTERROGATIVE";
        } else if (_(["PRP"]).contains(lastElement.pos)) {
            // Sentences that end in a Personal pronoun are most likely questions
            // eg. We should run away, should we [?]
            // eg. You want to see that again, do you [?]
            this.senType = "INTERROGATIVE";
        } else {
            this.senType = "UNKNOWN";
        }
            
    } else {
        switch(lastElement.token) {
            case "?": this.senType = "INTERROGATIVE"; break;
            case "!": this.senType = (implicitYou) ? "COMMAND":"EXCLAMATORY"; break;
            case ".": this.senType = (implicitYou) ? "COMMAND":"DECLARATIVE";	break;
        }
    }
    
    if (callback && _(callback).isFunction()) {
        callback(this);
    } else {
        return this.senType;
    }
};

module.exports = Sentences;
