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

var BayesClassifier = function(stemmer) {
    this.categories = {};
    this.categoryTotals = {};
    this.stemmer = stemmer || PorterStemmer;
};

var textToTokens = function(text) {
    if(typeof text === 'string')
        return this.stemmer.tokenizeAndStem(text);

    return text;
};

var train = function(data) {
     var classifier = this;
     
     data.forEach(function(datum) {
          var category = datum.classification;
          var tokens = classifier.textToTokens(datum.text);
          
          if(!classifier.categories[category]) {
              classifier.categories[category] = {};
              classifier.categoryTotals[category] = 0;
          }
          
          tokens.forEach(function(token) {
              classifier.categoryTotals[category]++;
          
              if(classifier.categories[category][token]) {
                  classifier.categories[category][token]++;
              } else {
                  classifier.categories[category][token] = 1;
              }
          });          
     });
};

var classifications = function(text) {
    var tokens = this.textToTokens(text);
    var classifier = this;
    var score = {};

    for(var category in this.categories) {
        score[category] = 0;

        tokens.forEach(function(token) {
            var count = classifier.categories[category][token] || 0.1;
            score[category] += Math.log(count / classifier.categoryTotals[category]);
        });
    };

    return score;
};

var classify = function(text) {
     return this.getClassification(text).className;
};

var getClassification = function(text) {
    var scores = this.classifications(text);
    var category = {};

    for(candidate in scores) {
        if(!category["className"] || scores[candidate] > category["value"]) {
            category = {"className": candidate, "value": scores[candidate]};
        }
    }

    return category;
};

var save = function(filename, callback) {
     var data = JSON.stringify(this);
     var fs = require('fs');
     fs.writeFile(filename, data, encoding='utf8', callback);
};

function load(filename, callback, stemmer) {
     var fs = require('fs');

     fs.readFile(filename, encoding='utf8', function(err, data) {
          var classifier;
          
          if(!err) {
              classifier = restore(JSON.parse(data), stemmer);
          }

          if(callback)
               callback(err, classifier);
     });
};

function restore(classifier, stemmer) {
     classifier = typeof classifier == 'string' ?  JSON.parse(classifier) : classifier;

     classifier.train = train;
     classifier.textToTokens = textToTokens;
     classifier.classifications = classifications;
     classifier.classify = classify;
     classifier.save = save;
     classifier.getClassification = getClassification;
     classifier.stemmer = stemmer || PorterStemmer;
     
     return classifier;
}

BayesClassifier.prototype.train = train;
BayesClassifier.prototype.textToTokens = textToTokens;
BayesClassifier.prototype.classifications = classifications;
BayesClassifier.prototype.classify = classify;
BayesClassifier.prototype.save = save;
BayesClassifier.prototype.getClassification = getClassification;
BayesClassifier.load = load;
BayesClassifier.restore = restore;

module.exports = BayesClassifier;
