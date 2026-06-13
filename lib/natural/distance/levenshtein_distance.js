/*
Copyright (c) 2012, Sid Nallu, Chris Umbel

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

/*
 * Compute the Levenshtein distance between two strings.
 * Algorithm based from Speech and Language Processing - Daniel Jurafsky and James H. Martin.
 *
 * Counts the minimum number of single-character edits (insertions, deletions,
 * substitutions) required to change `source` into `target`.
 */

const _ = require('underscore')
const { computeEditDistance } = require('./edit_distance_utils')

/**
 * Compute the Levenshtein distance between two strings.
 *
 * @param {string} source - The source string
 * @param {string} target - The target string
 * @param {object} [options] - Configuration options
 * @param {number} [options.insertion_cost=1] - Cost of inserting a character
 * @param {number} [options.deletion_cost=1] - Cost of deleting a character
 * @param {number} [options.substitution_cost=1] - Cost of substituting a character
 * @returns {number} The edit distance
 */
function LevenshteinDistance (source, target, options) {
  const levOptions = _.extend({}, options || {}, { damerau: false, search: false })
  return computeEditDistance(source, target, levOptions)
}

/**
 * Search for the best substring match in target against source
 * using Levenshtein distance.
 *
 * @param {string} source - The source string to search within
 * @param {string} target - The target string to find the best match for
 * @param {object} [options] - Configuration options
 * @returns {{substring: string, distance: number, offset: number}}
 */
function LevenshteinDistanceSearch (source, target, options) {
  const levOptions = _.extend({}, options || {}, { damerau: false, search: true })
  return computeEditDistance(source, target, levOptions)
}

module.exports = {
  LevenshteinDistance: LevenshteinDistance,
  LevenshteinDistanceSearch: LevenshteinDistanceSearch
}
