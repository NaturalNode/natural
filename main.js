// var natural = require('./lib/natural/');
// var Stemmer = natural.StemmerId;
// //var lowercaseText = "ketika malaikat-malaikat  Cinta + cinta  + bertasbih";
// //var tokens = PorterStemmer.tokenizeAndStem(lowercaseText);
// var text = "malaikat-malaikat"
// //console.log(PorterStemmer.isPlural(text));
// console.log(Stemmer.tokenizeAndStem("malaikat ku tak bersayap"));
// console.log(Stemmer.a("berkilah"));

var Removal = require("./lib/natural/stemmers/indonesian/removal");
var SuffixRules = require("./lib/natural/stemmers/indonesian/suffix_rules");

var x = 10;
console.log("x : " + x);
sr = new SuffixRules();
rules = SuffixRules.rules;
ths = rules[2](x);
console.log("x : " + ths.x);
console.log("y : " + ths.y);
ths = rules[1](x);
console.log("x : " + ths.x);
console.log("y : " + ths.y);