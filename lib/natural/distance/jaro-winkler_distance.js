/*
Copyright (c) 2012, Adam Phillabaum, Chris Umbel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

Unless otherwise stated by a specific section of code

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// Computes the Jaro distance between two string -- intrepreted from:
// http://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance
// s1 is the first string to compare
// s2 is the second string to compare
function distance(s1, s2) {
    if (typeof(s1) !== "string" || typeof(s2) !== "string") {
        return 0;
    }

    if (s1.length === 0 || s2.length === 0) {
        return 0;
    }

    s1 = s1.toLowerCase(), s2 = s2.toLowerCase();

    var matchWindow = (Math.floor(Math.max(s1.length, s2.length) / 2.0)) - 1;
    var matches1 = new Array(s1.length);
    var matches2 = new Array(s2.length);
    var m = 0; // number of matches
    var t = 0; // number of transpositions
    var i = 0; // index for string 1
    var k = 0; // index for string 2

    //debug helpers
    //console.log("s1: " + s1 + "; s2: " + s2);
    //console.log(" - matchWindow: " + matchWindow);

    for (i = 0; i < s1.length; i++) { // loop to find matched characters
        var start = Math.max(0, (i - matchWindow)); // use the higher of the window diff
        var end = Math.min((i + matchWindow + 1), s2.length); // use the min of the window and string 2 length

        for (k = start; k < end; k++) { // iterate second string index
            if (matches2[k]) { // if second string character already matched
                continue;
            }
            if (s1[i] !== s2[k]) { // characters don't match
                continue;
            }

            // assume match if the above 2 checks don't continue
            matches1[i] = true;
            matches2[k] = true;
            m++;
            break;
        }
    }

    // nothing matched
    if (m === 0) {
        return 0.0;
    }

    k = 0; // reset string 2 index
    for(i = 0; i < s1.length; i++) { // loop to find transpositions
        if (!matches1[i]) { // non-matching character
            continue;
        }
        while(!matches2[k]) { // move k index to the next match
            k++;
        }
        if (s1[i] !== s2[k]) { // if the characters don't match, increase transposition
            t++;
        }
        k++; // iterate k index normally
    }

    // transpositions divided by 2
    t = t / 2.0;

    return ((m / s1.length) + (m / s2.length) + ((m - t) / m)) / 3.0;
}

// Computes the Winkler distance between two string -- intrepreted from:
// http://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance
// s1 is the first string to compare
// s2 is the second string to compare
// dj is the Jaro Distance (if you've already computed it), leave blank and the method handles it
function JaroWinklerDistance(s1, s2, dj) {
    if (s1 === s2) {
        return 1;
    } else {
        var jaro = (typeof(dj) === 'undefined') ? distance(s1,s2) : dj;
        var p = 0.1; // default scaling factor
        var l = 0 // length of the matching prefix
        while(s1[l] === s2[l] && l < 4) {
            l++;
        }

        return jaro + l * p * (1 - jaro);
    }
}
module.exports = JaroWinklerDistance;

