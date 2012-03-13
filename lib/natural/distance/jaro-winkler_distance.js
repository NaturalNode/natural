/*
Copyright (c) 2012, Adam Phillabaum

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
function jaro_distance(s1,s2) {
    match_window = (Math.floor(Math.max(s1.length,s2.length))/2)-1;
    matches = Array();
    m = 0;
    for (i=0;i<s1.length;i++) {
        matches[i] = Array();
        matched = false;    
        // this for loop is a little brutal
        for (k=(i<=match_window)? 0 : i - match_window;
             (k < i+match_window) && k<s2.length && !matched;
             k++) {
                if (s1[i] == s2[k]) {
                    m++;
                    matched = true;
                }
        }
    }
    t = 0; // hack for now... this should actually be computed
    return (1/3)*(m/s1.length + m/s2.length + (m - t)/m)
}

// Computes the Winkler distance between two string -- intrepreted from:
// http://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance
// s1 is the first string to compare
// s2 is the second string to compare
// dj is the Jaro Distance (if you've already computed it), leave blank and the method handles it
function JaroWinklerDistance(s1, s2, dj) {
    (typeof(dj) == 'undefined')? jaro = jaro_distance(s1,s2) : jaro = dj;
    p = 0.1; //
    l=0 // length of the matching prefix
    while(s1[l] == s2[l] && l <4)
        l++;
    
    return jaro + l*p*(1-jaro);
}
module.exports = JaroWinklerDistance;