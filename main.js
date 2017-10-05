var natural = require('./lib/natural/');
var PorterStemmer = natural.PorterStemmerId;
var lowercaseText = "ketika cinta bertasbih";
var tokens = PorterStemmer.tokenizeAndStem(lowercaseText);
console.log(tokens);
//console.log(natural.PorterStemmer.tokenizeAndStem("fishing at lake")); // stem a single word