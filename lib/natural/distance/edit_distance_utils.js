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

const _ = require('underscore')

/**
 * Walk the path back from matchEnd to the beginning of the match.
 * Traverses the distanceMatrix as a linked list, from cell child to parent
 * until reaching row 0.
 *
 * @param {Array[]} distanceMatrix - The DP matrix with cost and parentCell
 * @param {number} matchEnd - Column index where the match ends
 * @param {number} sourceLength - Length of the source string
 * @returns {number} Column index where the match starts
 */
function traceBackMatchStart (distanceMatrix, matchEnd, sourceLength) {
  let row = sourceLength
  let column = matchEnd
  let tmpRow
  let tmpColumn

  // match will be empty string
  if (matchEnd === 0) { return 0 }

  while (row > 1 && column > 1) {
    tmpRow = row
    tmpColumn = column
    row = distanceMatrix[tmpRow][tmpColumn].parentCell.row
    column = distanceMatrix[tmpRow][tmpColumn].parentCell.column
  }

  return column - 1
}

/**
 * Find the minimum-cost substring match in the last row of the distance matrix.
 * Used by search variants of edit distance algorithms.
 *
 * @param {Array[]} distanceMatrix - The DP matrix
 * @param {string} source - The source string
 * @param {string} target - The target string
 * @returns {{substring: string, distance: number, offset: number}}
 */
function findMinCostSubstring (distanceMatrix, source, target) {
  const sourceLength = source.length
  const targetLength = target.length
  let minDistance = sourceLength + targetLength
  let matchEnd = targetLength

  for (let column = 0; column <= targetLength; column++) {
    if (minDistance > distanceMatrix[sourceLength][column].cost) {
      minDistance = distanceMatrix[sourceLength][column].cost
      matchEnd = column
    }
  }

  const matchStart = traceBackMatchStart(distanceMatrix, matchEnd, sourceLength)
  return { substring: target.slice(matchStart, matchEnd), distance: minDistance, offset: matchStart }
}

/**
 * Core Levenshtein-style dynamic programming algorithm.
 * Computes edit distance between two strings with configurable costs
 * and optional Damerau transposition support.
 *
 * @param {string} source - The source string
 * @param {string} target - The target string
 * @param {object} options - Algorithm configuration
 * @param {number} [options.insertion_cost=1] - Cost of inserting a character
 * @param {number} [options.deletion_cost=1] - Cost of deleting a character
 * @param {number} [options.substitution_cost=1] - Cost of substituting a character
 * @param {number} [options.transposition_cost=1] - Cost of transposing two adjacent characters
 * @param {boolean} [options.search=false] - Whether to search for best substring match
 * @param {boolean} [options.damerau=false] - Whether to allow transpositions
 * @param {boolean} [options.restricted=false] - Whether to use restricted Damerau (adjacent only)
 * @returns {number|{substring: string, distance: number, offset: number}}
 */
function computeEditDistance (source, target, options) {
  if (isNaN(options.insertion_cost)) options.insertion_cost = 1
  if (isNaN(options.deletion_cost)) options.deletion_cost = 1
  if (isNaN(options.substitution_cost)) options.substitution_cost = 1

  if (typeof options.search !== 'boolean') options.search = false

  const isUnrestrictedDamerau = options.damerau && !options.restricted
  const isRestrictedDamerau = options.damerau && options.restricted

  let lastRowMap = null
  if (isUnrestrictedDamerau) {
    lastRowMap = {}
  }

  const sourceLength = source.length
  const targetLength = target.length
  const distanceMatrix = [[{ cost: 0 }]] // the root, has no parent cell

  for (let row = 1; row <= sourceLength; row++) {
    distanceMatrix[row] = []
    distanceMatrix[row][0] = { cost: distanceMatrix[row - 1][0].cost + options.deletion_cost, parentCell: { row: row - 1, column: 0 } }
  }

  for (let column = 1; column <= targetLength; column++) {
    if (options.search) {
      distanceMatrix[0][column] = { cost: 0 }
    } else {
      distanceMatrix[0][column] = { cost: distanceMatrix[0][column - 1].cost + options.insertion_cost, parentCell: { row: 0, column: column - 1 } }
    }
  }

  let lastColMatch = null
  for (let row = 1; row <= sourceLength; row++) {
    if (isUnrestrictedDamerau) {
      lastColMatch = null
    }
    for (let column = 1; column <= targetLength; column++) {
      const costToInsert = distanceMatrix[row][column - 1].cost + options.insertion_cost
      const costToDelete = distanceMatrix[row - 1][column].cost + options.deletion_cost

      const sourceElement = source[row - 1]
      const targetElement = target[column - 1]
      let costToSubstitute = distanceMatrix[row - 1][column - 1].cost
      if (sourceElement !== targetElement) {
        costToSubstitute = costToSubstitute + options.substitution_cost
      }

      const possibleParents = [
        { cost: costToInsert, coordinates: { row: row, column: column - 1 } },
        { cost: costToDelete, coordinates: { row: row - 1, column: column } },
        { cost: costToSubstitute, coordinates: { row: row - 1, column: column - 1 } }
      ]

      const canDamerau = isUnrestrictedDamerau &&
                row > 1 && column > 1 &&
                lastColMatch &&
                targetElement in lastRowMap

      let costBeforeTransposition = null
      if (canDamerau) {
        const lastRowMatch = lastRowMap[targetElement]
        costBeforeTransposition =
                    distanceMatrix[lastRowMatch - 1][lastColMatch - 1].cost
        const costToTranspose = costBeforeTransposition +
                    ((row - lastRowMatch - 1) * options.deletion_cost) +
                    ((column - lastColMatch - 1) * options.insertion_cost) +
                    options.transposition_cost
        possibleParents.push({
          cost: costToTranspose,
          coordinates: {
            row: lastRowMatch - 1,
            column: lastColMatch - 1
          }
        })
      }

      const canDoRestrictedDamerau = isRestrictedDamerau &&
                row > 1 && column > 1 &&
                sourceElement === target[column - 2] &&
                source[row - 2] === targetElement

      if (canDoRestrictedDamerau) {
        costBeforeTransposition = distanceMatrix[row - 2][column - 2].cost
        possibleParents.push({
          cost: costBeforeTransposition + options.transposition_cost,
          coordinates: { row: row - 2, column: column - 2 }
        })
      }

      const minCostParent = _.min(possibleParents, function (p) { return p.cost })

      distanceMatrix[row][column] = { cost: minCostParent.cost, parentCell: minCostParent.coordinates }

      if (isUnrestrictedDamerau) {
        lastRowMap[sourceElement] = row
        if (sourceElement === targetElement) {
          lastColMatch = column
        }
      }
    }
  }

  if (!options.search) {
    return distanceMatrix[sourceLength][targetLength].cost
  }

  return findMinCostSubstring(distanceMatrix, source, target)
}

module.exports = {
  computeEditDistance,
  findMinCostSubstring
}
