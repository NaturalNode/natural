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

/*
 * contribution by sidred123
 */

/*
 * Compute the Levenshtein distance between two strings.
 * Algorithm based from Speech and Language Processing - Daniel Jurafsky and James H. Martin.
 */

var _ = require('underscore');

// Walk the path back from the matchEnd to the beginning of the match.
// Do this by traversing the distanceMatrix as you would a linked list,
// following going from cell child to parent until reach row 0.
function _getMatchStart(distanceMatrix, matchEnd, sourceLength) {
  var row = sourceLength;
  var column = matchEnd;
  var tmpRow;
  var tmpColumn;

  // match will be empty string
  if (matchEnd === 0) { return 0; }

  while(row > 1 && column > 1) {
   tmpRow = row;
   tmpColumn = column;
   row = distanceMatrix[tmpRow][tmpColumn].parentCell.row;
   column = distanceMatrix[tmpRow][tmpColumn].parentCell.column;
  }

  return column-1;
}

function getMinCostSubstring(distanceMatrix, source, target) {
  var sourceLength = source.length;
  var targetLength = target.length;
  var minDistance = sourceLength + targetLength;
  var matchEnd = targetLength;

  // Find minimum value in last row of the cost matrix. This cell marks the
  // end of the match string.
  for (var column = 0; column <= targetLength; column++) {
    if (minDistance > distanceMatrix[sourceLength][column].cost) {
      minDistance = distanceMatrix[sourceLength][column].cost;
      matchEnd = column;
    }
  }

  matchStart = _getMatchStart(distanceMatrix, matchEnd, sourceLength);
  return {substring: target.slice(matchStart, matchEnd), distance: minDistance};
}

/*
* Returns the Damerau-Levenshtein distance between strings. Counts the distance
* between two strings by returning the number of edit operations required to
* convert `source` into `target`.
*
* Valid edit operations are:
*  - transposition, insertion, deletion, and substitution
*
* Options:
*  insertion_cost: (default: 1)
*  deletion_cost: number (default: 1)
*  substitution_cost: number (default: 1)
*  transposition_cost: number (default: 1)
*  search: boolean (default: false)
*  restricted: boolean (default: false)
*/
function DamerauLevenshteinDistance(source, target, options) {
    var damLevOptions = _.assign(
        { transposition_cost: 1, restricted: false },
        options || {},
        { damerau: true }
    );
    return levenshteinDistance(source, target, damLevOptions);
}

function LevenshteinDistance(source, target, options) {
    var levOptions = _.assign({}, options || {}, { damerau: false });
    return levenshteinDistance(source, target, levOptions);
}


function levenshteinDistance (source, target, options) {
    if(isNaN(options.insertion_cost)) options.insertion_cost = 1;
    if(isNaN(options.deletion_cost)) options.deletion_cost = 1;
    if(isNaN(options.substitution_cost)) options.substitution_cost = 1;

    if(typeof options.search !== 'boolean') options.search = false;

    var isUnrestrictedDamerau = options.damerau && !options.restricted;
    var isRestrictedDamerau = options.damerau && options.restricted;

    if (isUnrestrictedDamerau) {
        var lastRowMap = {};
    }

    var sourceLength = source.length;
    var targetLength = target.length;
    var distanceMatrix = [[{cost: 0}]]; //the root, has no parent cell

    for (var row =  1; row <= sourceLength; row++) {
        distanceMatrix[row] = [];
        distanceMatrix[row][0] = {cost: distanceMatrix[row-1][0].cost + options.deletion_cost, parentCell: {row: row-1, column: 0}};
    }

    for (var column = 1; column <= targetLength; column++) {
        if (options.search) {
          distanceMatrix[0][column] = {cost: 0};
        } else {
          distanceMatrix[0][column] = {cost: distanceMatrix[0][column-1].cost + options.insertion_cost, parentCell: {row: 0, column: column-1}};
        }
    }

    for (var row = 1; row <= sourceLength; row++) {
        if (isUnrestrictedDamerau) {
            var lastColMatch = null;
        }
        for (var column = 1; column <= targetLength; column++) {
            var costToInsert = distanceMatrix[row][column-1].cost + options.insertion_cost;
            var costToDelete = distanceMatrix[row-1][column].cost + options.deletion_cost;

            var sourceElement = source[row-1];
            var targetElement = target[column-1];
            var costToSubstitute = distanceMatrix[row-1][column-1].cost;
            if (sourceElement !== targetElement) {
                costToSubstitute = costToSubstitute + options.substitution_cost;
            }

            var possibleParents = [
              {cost: costToInsert, coordinates: {row: row, column: column-1}},
              {cost: costToDelete, coordinates: {row: row-1, column: column}},
              {cost: costToSubstitute, coordinates: {row: row-1, column: column-1}}
            ];

            // We can add damerau to the possibleParents if the current
            // target-letter has been encountered in our lastRowMap,
            // and if there exists a previous column in this row where the
            // row & column letters matched
            var canDamerau = isUnrestrictedDamerau
                && row > 1 && column > 1
                && lastColMatch
                && targetElement in lastRowMap;

            if (canDamerau) {
                var lastRowMatch = lastRowMap[targetElement];
                var costBeforeTransposition =
                    distanceMatrix[lastRowMatch - 1][lastColMatch - 1].cost;
                var costToTranspose = costBeforeTransposition
                    + ((row - lastRowMatch - 1) * options.deletion_cost)
                    + ((column - lastColMatch - 1) * options.insertion_cost)
                    + options.transposition_cost;
                possibleParents.push({
                    cost: costToTranspose,
                    coordinates: {
                        row: lastRowMatch - 1,
                        column: lastColMatch - 1,
                    },
                });
            }
            // Source and target chars are 1-indexed in the distanceMatrix so previous
            // source/target element is (col/row - 2)
            var canDoRestrictedDamerau = isRestrictedDamerau
                && row > 1 && column > 1
                && sourceElement === target[column - 2]
                && source[row - 2] === targetElement;

            if (canDoRestrictedDamerau) {
                var costBeforeTransposition = distanceMatrix[row - 2][column - 2].cost;
                possibleParents.push({
                    cost: costBeforeTransposition + options.transposition_cost,
                    coordinates: { row: row - 2, column: column - 2 },
                });
            }

            var minCostParent = _.min(possibleParents, function(p) { return p.cost; });

            distanceMatrix[row][column] = {cost: minCostParent.cost, parentCell: minCostParent.coordinates};

            if (isUnrestrictedDamerau) {
                lastRowMap[sourceElement] = row;
                if (sourceElement === targetElement) {
                    lastColMatch = column;
                }
            }
        }
    }

    if (!options.search) {
        return distanceMatrix[sourceLength][targetLength].cost;
    }

    return getMinCostSubstring(distanceMatrix, source, target);
}

module.exports = {
    LevenshteinDistance: LevenshteinDistance,
    DamerauLevenshteinDistance: DamerauLevenshteinDistance,
};
