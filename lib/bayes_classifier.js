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

require('./porter_stemmer').attach();

var features = {};
var classes = [];
var words = [];
var docCount = 0.0;

// expose a training function. an array of objects that look like:
// {classification: 'class name', text: 'full text of item'}
// this function must be called before performing classification.
exports.train = function(data) {
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
exports.classify = function(text) {
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