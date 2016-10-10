// Computes the Hamming distance between two string -- intrepreted from:
// https://en.wikipedia.org/wiki/Hamming_distance
// s1 is the first string to compare
// s2 is the second string to compare
function HammingDistance(s1, s2){
	if (typeof(s1) != "string" || typeof(s2) != "string") return 0;
	if (s1.length != s2.length) return 0;

	s1 = s1.toLowerCase(), s2 = s2.toLowerCase();

    var matches = 0; 
    for (var i = 0; i < s1.length; i++){
    	if s1[i] == s2[i]
    		matches++;
    }
    return matches;	

}
module.exports = HammingDistance; 
