var natural = require('./lib/natural/');
var Stemmer = natural.StemmerId;
//var lowercaseText = "ketika malaikat-malaikat  Cinta + cinta  + bertasbih";
//var tokens = PorterStemmer.tokenizeAndStem(lowercaseText);
var text = "malaikat-malaikat"
//console.log(PorterStemmer.isPlural(text));
console.log(Stemmer.tokenizeAndStem("malaikat ku tak bersayap"));
console.log(Stemmer.a("berkilah"));