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
    tokenizer = new Tokenizer(),
    stopwords = require('../util/stopwords').words,
    fs = require('fs');

function buildDocument(text, key) {
    var stopOut;
    
    if(typeof text === 'string') {
        text = tokenizer.tokenize(text.toLowerCase());
        stopOut = true;
    } else if(!_.isArray(text)) {
        return text;
        stopOut = false;
    }

    return text.reduce(function(document, term) {
        if(!stopOut || stopwords.indexOf(term) < 0)
            document[term] = (document[term] ? document[term] + 1 : 1);
            
        return document;
    }, {__key: key});
}

function tf(term, document) {
    return document[term] ? document[term]: 0;
}

function documentHasTerm(term, document) {
    return document[term] && document[term] > 0;
}

function TfIdf(deserialized) {
    if(deserialized)
        this.documents = deserialized.documents;
    else
        this.documents = [];
}

module.exports = TfIdf;
TfIdf.tf = tf;

TfIdf.prototype.idf = function(term) {
    var docsWithTerm = this.documents.reduce(function(count, document) {
        return count + (documentHasTerm(term, document) ? 1 : 0);
    }, 1);
        
    return Math.log(this.documents.length + 1 / docsWithTerm /* inited to 1 so
        no addition needed */);
};

TfIdf.prototype.addDocument = function(document, key) {
    this.documents.push(buildDocument(document, key));
};

TfIdf.prototype.addFileSync = function(path, encoding, key) {
    if(encoding)
        encoding = 'UTF-8';
        
    var document = fs.readFileSync(path, 'UTF-8');
    this.documents.push(buildDocument(document, key));
};

TfIdf.prototype.tfidf = function(terms, d) {
    var _this = this;
    
    if(!_.isArray(terms))
        terms = tokenizer.tokenize(terms.toString().toLowerCase());
    
    return terms.reduce(function(value, term) {
        return value + (tf(term, _this.documents[d]) * _this.idf(term));
    }, 0.0);
};

TfIdf.prototype.listTerms = function(d) {
    var terms = [];

    for(term in this.documents[d]) {
	terms.push({term: term, tfidf: this.tfidf(term, d)})
    }

    return terms.sort(function(x, y) { return y.tfidf - x.tfidf });
}

TfIdf.prototype.tfidfs = function(terms, callback) {
    var tfidfs = new Array(this.documents.length);
    
    for(var i = 0; i < this.documents.length; i++) {
        tfidfs[i] = this.tfidf(terms, i);
        
        if(callback)
            callback(i, tfidfs[i], this.documents[i].__key);
    }

    return tfidfs;
};
