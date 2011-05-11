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

require('./porter_stemmer').attach();

var features = {};
var classes = [];
var words = [];
var docCount = 0.0;

function BayesClassifier() {
}

module.exports = BayesClassifier;

// expose a training function. an array of objects that look like:
// {classification: 'class name', text: 'full text of item'}
// this function must be called before performing classification.
BayesClassifier.prototype.train = function(data) {
    docCount = data.length;
    
    // count up word occurrences for the classes of each doc
    data.forEach(function(item) {
        if(classes.indexOf(item.classification) < 0)
            classes.push(item.classification);

        item.text.tokenizeAndStem().forEach(function(word) {
            if(words.indexOf(word) < 0)
                words.push(word);
            
            if(features[word])
                if(features[word][item.classification])
                    features[word][item.classification]++;
                else
                    features[word][item.classification] = 1;
            else {
                features[word] = {};
                features[word][item.classification] = 1;
            }
        });
    });

    // determine the probability of each word for each class
    words.forEach(function(word) {
        classes.forEach(function(classification) {
            if(features[word][classification]) {
                features[word][classification] = features[word][classification] / docCount;
            }
        });
    });
};

// expose a classification function. here's the money. general full text is
// supplied and the classification is returned.
BayesClassifier.prototype.classify = function(text) {
    classifications = {};
    
    if(text instanceof Array)
        tokens = text;
    else
        tokens = text.tokenizeAndStem();
    
    // determine the probability that the given document matches each class
    tokens.forEach(function(word) {        
        if(features[word]) {
            classes.forEach(function(classification) {
                // zero would short-circuit the whole operation. don't let that
                // happen by using a multiplier approaching, but not equal to 0
                // for a non-match.
                if(!features[word][classification])                
                    features[word][classification] = 0.0001;

                if(classifications[classification])
                    classifications[classification] *= features[word][classification];
                else
                    classifications[classification] = features[word][classification];
            });
        }
    });
    
    result = {className : "", value : null};
    
    // find the class with the highest probability
    classes.forEach(function(classification) {
        if(classifications[classification] >= result.value) {
            result.value = classifications[classification];
            result.className = classification;
        }
    });
    
    return result.className;
}