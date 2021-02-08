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

exports.BayesClassifier = require('./bayes_classifier')
exports.LogisticRegressionClassifier = require('./logistic_regression_classifier')

exports.MaxEntClassifier = require('./maxent/Classifier')
exports.Context = require('./maxent/Context')
exports.Feature = require('./maxent/Feature')
exports.FeatureSet = require('./maxent/FeatureSet')
exports.Sample = require('./maxent/Sample')
exports.Element = require('./maxent/Element')
exports.SEElement = require('./maxent/SimpleExample/SE_Element')
exports.GISScaler = require('./maxent/GISScaler')
exports.POSElement = require('./maxent/POS/POS_Element')
exports.MESentence = require('./maxent/POS/ME_Sentence')
exports.MECorpus = require('./maxent/POS/ME_Corpus')
