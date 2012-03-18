/*
 * Compute the Levenshtein distance between two strings.
 * Algorithm based from Speech and Language Processing - Daniel Jurafsky and James H. Martin.
 */

function LevenshteinDistance (source, target, options) {

    options = options || {};
    options.insertion_cost = options.insertion_cost || 1;
    options.deletion_cost = options.deletion_cost || 1;
    options.substitution_cost = options.substitution_cost || 2;

    var sourceLength = source.length;
    var targetLength = target.length;
    var distanceMatrix = [[0]];
    for (var row =  1; row <= sourceLength; row++) {
        distanceMatrix[row] = [];
        distanceMatrix[row][0] = distanceMatrix[row-1][0] + options.insertion_cost;
    }
    for (var column = 1; column <= targetLength; column++) {
        distanceMatrix[0][column] = distanceMatrix[column-1][0] + options.deletion_cost;
    }

    for (var row = 1; row <= sourceLength; row++) {
        for (var column = 1; column <= targetLength; column++) {
            var costToInsert = distanceMatrix[row-1][column] + options.insertion_cost;
            var costToDelete = distanceMatrix[row][column-1] + options.deletion_cost;

            var sourceElement = source[row-1];
            var targetElement = target[column-1];
            var costToSubstitute = distanceMatrix[row-1][column-1];
            if (sourceElement !== targetElement) {
                costToSubstitute = costToSubstitute + options.substitution_cost;
            }
            distanceMatrix[row][column] = Math.min(costToInsert, costToDelete, costToSubstitute);
        }
    }
    return distanceMatrix[sourceLength][targetLength];
}

module.exports = LevenshteinDistance;
