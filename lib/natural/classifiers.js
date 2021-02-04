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

'use strict'

exports.BayesClassifier = require('./classifiers/bayes_classifier')
exports.LogisticRegressionClassifier = require('./classifiers/logistic_regression_classifier')

exports.MaxEntClassifier = require('./classifiers/maxent/Classifier')
exports.Context = require('./classifiers/maxent/Context')
exports.Feature = require('./classifiers/maxent/Feature')
exports.FeatureSet = require('./classifiers/maxent/FeatureSet')
exports.Sample = require('./classifiers/maxent/Sample')
exports.Element = require('./classifiers/maxent/Element')
exports.SEElement = require('./classifiers/maxent/SimpleExample/SE_Element')
exports.GISScaler = require('./classifiers/maxent/GISScaler')
exports.POSElement = require('./classifiers/maxent/POS/POS_Element')
exports.MESentence = require('./classifiers/maxent/POS/ME_Sentence')
exports.MECorpus = require('./classifiers/maxent/POS/ME_Corpus')
