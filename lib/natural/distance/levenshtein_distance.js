// This function is licensed under Creative Commons Share Alike V3 - http://en.wikibooks.org/wiki/Wikibooks:Creative_Commons_Attribution-ShareAlike_3.0_Unported_License
// Computes the Levenshtein distance between two string -- originally found on:
// http://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance#JavaScript
// s1 is the first string to compare
// s2 is the second string to compare
function LevenshteinDistance(s1, s2) {
    var d = [0], c = [0]; // two rows of the distance matrix
    var distance;
  for(var e=0; s1[e]; e++) // loop through a and reset the 1st distance
    for(var f=0; s2[++f];) // loop through b and reset the 1st col of the next row
      distance=
      d[f]=
        (e == 0)? // not the first row ?
        1+Math.min( // then compute the cost of each change
          d[--f],
          c[f]-(s1[e-1]==s2[f]),
          c[++f]=d[f] // and copy the previous row of the distance matrix
        )
        : // otherwise
        f; // init the very first row of the distance matrix
  return distance;
}
module.exports = LevenshteinDistance;