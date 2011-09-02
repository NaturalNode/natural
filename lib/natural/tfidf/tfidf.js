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

var _ = require("underscore")._,
    Tokenizer = require('../tokenizers/regexp_tokenizer').WordTokenizer,
    tokenizer = new Tokenizer();

function documentToArray(document) {
    if(!_.isArray(document))
        return tokenizer.tokenize(document);

    return document;
}

function tf(term, document) {
    document = documentToArray(document);
    
    return document.reduce(function(count, word) {
        return count + (word == term ? 1 : 0);
    }, 0);
    
    return count;    
}

function docHasTerm(term, document) {
    for(var i = 0; i < document.length; i++) {
        if(document[i] == term)
            return true;
    }
    
    return false;
}

function TfIdf() {
    this.documents = [];
}

module.exports = TfIdf;
TfIdf.tf = tf;

TfIdf.prototype.idf = function(term) {
    var docsWithTerm = this.documents.reduce(function(count, document) {
        return count + (docHasTerm(term, document) ? 1 : 0);
    }, 1);
        
    return Math.log(this.documents.length + 1 / docsWithTerm /* inited to 1 so
        no addition needed */);
}

TfIdf.prototype.addDocument = function(document) {
    document = documentToArray(document);
    this.documents.push(document);
}

TfIdf.prototype.tfidf = function(term, d) {
    return tf(term, this.documents[d]) * this.idf(term);
}

TfIdf.prototype.tfidfs = function(term) {
    var tfidfs = new Array(this.documents.length);
    
    for(var i = 0; i < this.documents.length; i++) {
        tfidfs[i] = this.tfidf(term, i);
    }

    return tfidfs;
}
