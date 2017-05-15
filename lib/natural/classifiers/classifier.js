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

var PorterStemmer = require('../stemmers/porter_stemmer'),
Threads = require('webworker-threads'),
util = require('util'),
events = require('events')
os = require('os');

var Classifier = function(classifier, stemmer) {
    this.classifier = classifier;
    this.docs = [];
    this.features = {};
    this.stemmer = stemmer || PorterStemmer;
    this.lastAdded = 0;
    this.events = new events.EventEmitter();
};

function addDocument(text, classification) {

    // Ignore further processing if classification is undefined
    if(typeof classification === 'undefined') return;

    // If classification is type of string then make sure it's dosen't have blank space at both end
    if(typeof classification === 'string'){
      classification = classification.trim();
    }

    if(typeof text === 'string')
	text = this.stemmer.tokenizeAndStem(text);

    if(text.length === 0) {
        // ignore empty documents
        return;
    }

    this.docs.push({
	label: classification,
	text: text
    });

    for (var i = 0; i < text.length; i++) {
        var token = text[i];
        this.features[token] = (this.features[token] || 0) + 1;
    }
}

function removeDocument(text, classification) {
  var docs = this.docs
    , doc
    , pos;

  if (typeof text === 'string') {
    text = this.stemmer.tokenizeAndStem(text);
  }

  for (var i = 0, ii = docs.length; i < ii; i++) {
    doc = docs[i];
    if (doc.text.join(' ') == text.join(' ') &&
        doc.label == classification) {
      pos = i;
    }
  }

  // Remove if there's a match
  if (!isNaN(pos)) {
    this.docs.splice(pos, 1);

    for (var i = 0, ii = text.length; i < ii; i++) {
      delete this.features[text[i]];
    }
  }
}

function textToFeatures(observation) {
    var features = [];

    if(typeof observation === 'string')
	observation = this.stemmer.tokenizeAndStem(observation);

    for(var feature in this.features) {
        if(observation.indexOf(feature) > -1)
            features.push(1);
        else
            features.push(0);
    }

    return features;
}

function docsToFeatures(docs) {
    var parsedDocs = [];

    for (var i = 0; i < docs.length; i++) {
        var features = [];

        for (var feature in FEATURES) {
            if (docs[i].observation.indexOf(feature) > -1)
                features.push(1);
            else
                features.push(0);
        }

        parsedDocs.push({
            index: docs[i].index,
            features: features
        });
    }

    return JSON.stringify(parsedDocs);
}

function train() {
    var totalDocs = this.docs.length;
    for(var i = this.lastAdded; i < totalDocs; i++) {
        var features = this.textToFeatures(this.docs[i].text);
        this.classifier.addExample(features, this.docs[i].label);
        this.events.emit('trainedWithDocument', {index: i, total: totalDocs, doc: this.docs[i]});
        this.lastAdded++;
    }
    this.events.emit('doneTraining', true);
    this.classifier.train();
}

function trainParallel(numThreads, callback) {
    if (!callback) {
        callback = numThreads;
        numThreads = undefined;
    }

    if (isNaN(numThreads)) {
        numThreads = os.cpus().length;
    }

    var totalDocs = this.docs.length;
    var threadPool = Threads.createPool(numThreads);
    var docFeatures = {};
    var finished = 0;
    var self = this;

    // Init pool; send the features array and the parsing function
    threadPool.all.eval('var FEATURES = ' + JSON.stringify(this.features));
    threadPool.all.eval(docsToFeatures);

    // Convert docs to observation objects
    var obsDocs = [];
    for (var i = this.lastAdded; i < totalDocs; i++) {
        var observation = this.docs[i].text;
        if (typeof observation === 'string')
            observation = this.stemmer.tokenizeAndStem(observation);
        obsDocs.push({
            index: i,
            observation: observation
        });
    }

    // Called when a batch completes processing
    var onFeaturesResult = function(docs) {
        setTimeout(function() {
            self.events.emit('processedBatch', {
                size: docs.length,
                docs: totalDocs,
                batches: numThreads,
                index: finished
            });
        });

        for (var j = 0; j < docs.length; j++) {
            docFeatures[docs[j].index] = docs[j].features;
        }
    };

    // Called when all batches finish processing
    var onFinished = function(err) {
        if (err) {
            threadPool.destroy();
            return callback(err);
        }

        for (var j = self.lastAdded; j < totalDocs; j++) {
            self.classifier.addExample(docFeatures[j], self.docs[j].label);
            self.events.emit('trainedWithDocument', {
                index: j,
                total: totalDocs,
                doc: self.docs[j]
            });
            self.lastAdded++;
        }

        self.events.emit('doneTraining', true);
        self.classifier.train();

        threadPool.destroy();
        callback(null);
    };

    // Split the docs and start processing
    var batchSize = Math.ceil(obsDocs.length / numThreads);
    var lastError;

    for (var i = 0; i < numThreads; i++) {
        var batchDocs = obsDocs.slice(i * batchSize, (i+1) * batchSize);
        var batchJson = JSON.stringify(batchDocs);

        threadPool.any.eval('docsToFeatures(' + batchJson + ')', function(err, docs) {
            lastError = err || lastError;
            finished++;

            if (docs) {
                docs = JSON.parse(docs);
                onFeaturesResult(docs);
            }

            if (finished >= numThreads) {
                onFinished(lastError);
            }
        });
    }
}

function trainParallelBatches(options) {
    var numThreads = options && options.numThreads;
    var batchSize = options && options.batchSize;

    if (isNaN(numThreads)) {
        numThreads = os.cpus().length;
    }

    if (isNaN(batchSize)) {
        batchSize = 2500;
    }

    var totalDocs = this.docs.length;
    var threadPool = Threads.createPool(numThreads);
    var docFeatures = {};
    var finished = 0;
    var self = this;

    var abort = false;
    var onError = function(err) {
        if (!err || abort) return;
        abort = true;
        threadPool.destroy(true);
        self.events.emit('doneTrainingError', err);
    };

    // Init pool; send the features array and the parsing function
    var str = JSON.stringify(this.features);
    threadPool.all.eval('var FEATURES = ' + str + ';', onError);
    threadPool.all.eval(docsToFeatures, onError);

    // Convert docs to observation objects
    var obsDocs = [];
    for (var i = this.lastAdded; i < totalDocs; i++) {
        var observation = this.docs[i].text;
        if (typeof observation === 'string')
            observation = this.stemmer.tokenizeAndStem(observation);
        obsDocs.push({
            index: i,
            observation: observation
        });
    }

    // Split the docs in batches
    var obsBatches = [];
    var i = 0;
    while (true) {
        var batch = obsDocs.slice(i * batchSize, (i+1) * batchSize);
        if (!batch || !batch.length) break;
        obsBatches.push(batch);
        i++;
    }
    obsDocs = null;
    self.events.emit('startedTraining', {
        docs: totalDocs,
        batches: obsBatches.length
    });

    // Called when a batch completes processing
    var onFeaturesResult = function(docs) {
        self.events.emit('processedBatch', {
            size: docs.length,
            docs: totalDocs,
            batches: obsBatches.length,
            index: finished
        });

        for (var j = 0; j < docs.length; j++) {
            docFeatures[docs[j].index] = docs[j].features;
        }
    };

    // Called when all batches finish processing
    var onFinished = function() {
        threadPool.destroy(true);
        abort = true;

        for (var j = self.lastAdded; j < totalDocs; j++) {
            self.classifier.addExample(docFeatures[j], self.docs[j].label);
            self.events.emit('trainedWithDocument', {
                index: j,
                total: totalDocs,
                doc: self.docs[j]
            });
            self.lastAdded++;
        }

        self.events.emit('doneTraining', true);
        self.classifier.train();
    };

    // Called to send the next batch to be processed
    var batchIndex = 0;
    var sendNext = function() {
        if (abort) return;
        if (batchIndex >= obsBatches.length) {
            return;
        }

        sendBatch(JSON.stringify(obsBatches[batchIndex]));
        batchIndex++;
    };

    // Called to send a batch of docs to the threads
    var sendBatch = function(batchJson) {
        if (abort) return;
        threadPool.any.eval('docsToFeatures(' + batchJson + ');', function(err, docs) {
            if (err) {
                return onError(err);
            }

            finished++;

            if (docs) {
                docs = JSON.parse(docs);
                setTimeout(onFeaturesResult.bind(null, docs));
            }

            if (finished >= obsBatches.length) {
                setTimeout(onFinished);
            }

            setTimeout(sendNext);
        });
    };

    // Start processing
    for (var i = 0; i < numThreads; i++) {
        sendNext();
    }
}

function retrain() {
  this.classifier = new (this.classifier.constructor)();
  this.lastAdded = 0;
  this.train();
}

function retrainParallel(numThreads, callback) {
  this.classifier = new (this.classifier.constructor)();
  this.lastAdded = 0;
  this.trainParallel(numThreads, callback);
}

function getClassifications(observation) {
    return this.classifier.getClassifications(this.textToFeatures(observation));
}

function classify(observation) {
    return this.classifier.classify(this.textToFeatures(observation));
}

function restore(classifier, stemmer) {
    classifier.stemmer = stemmer || PorterStemmer;
    classifier.events = new events.EventEmitter();
    return classifier;
}

function save(filename, callback) {
    var data = JSON.stringify(this);
    var fs = require('fs');
    var classifier = this;
    fs.writeFile(filename, data, 'utf8', function(err) {
        if(callback) {
            callback(err, err ? null : classifier);
        }
    });
}

function load(filename, callback) {
    var fs = require('fs');

    fs.readFile(filename, 'utf8', function(err, data) {
        var classifier;

        if(!err) {
            classifier = JSON.parse(data);
        }

        if(callback)
            callback(err, classifier);
    });
}

Classifier.prototype.addDocument = addDocument;
Classifier.prototype.removeDocument = removeDocument;
Classifier.prototype.train = train;
Classifier.prototype.trainParallel = trainParallel;
Classifier.prototype.trainParallelBatches = trainParallelBatches;
Classifier.prototype.retrain = retrain;
Classifier.prototype.retrainParallel = retrainParallel;
Classifier.prototype.classify = classify;
Classifier.prototype.textToFeatures = textToFeatures;
Classifier.prototype.save = save;
Classifier.prototype.getClassifications = getClassifications;
Classifier.restore = restore;
Classifier.load = load;

module.exports = Classifier;
