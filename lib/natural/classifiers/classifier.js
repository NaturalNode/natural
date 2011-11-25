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

var PorterStemmer = require('../stemmers/porter_stemmer');
     
function Classifier(stemmer) {
    this.stemmer = stemmer || PorterStemmer;
}

function save(filename, callback) {
     var data = JSON.stringify(this);
     var fs = require('fs');
     fs.writeFile(filename, data, encoding='utf8', callback);
}

function train(data) {
     if(data) {
          var classifier = this;
     
          data.forEach(function(datum) {
               classifier.addDocument(datum.text, datum.classification);
          });
     }
}

function load(filename, callback) {
     var fs = require('fs');

     fs.readFile(filename, encoding='utf8', function(err, data) {
          var classifier;
          
          if(!err) {
              classifier = JSON.parse(data);
          }

          if(callback)
               callback(err, classifier);
     });
}

function restore(classifier, stemmer) {
    classifier = typeof classifier == 'string' ?  JSON.parse(classifier) : classifier;
    classifier.stemmer = stemmer || PorterStemmer;
    
    return classifier;
}

function textToTokens(text) {
    if(typeof text === 'string')
        return this.stemmer.tokenizeAndStem(text);

    return text;
}

function addDocument(text, classification) {
    throw 'Not implemented';
}

function classify(text) {
    throw 'Not implemented';
}

Classifier.prototype.addDocument = addDocument;
Classifier.prototype.train = train;
Classifier.prototype.save = save;
Classifier.prototype.classify = classify;
Classifier.prototype.textToTokens = textToTokens;

Classifier.load = load;
Classifier.restore = restore;

module.exports = Classifier;
