var natural = require('./lib/natural/');
var Tokenizer = natural.StemmerId;
var lowercaseText = "ketika cinta bertasbih";
var tokens = new Tokenizer().tokenizeAndStem(lowercaseText);
console.log(tokens);
//console.log(natural.PorterStemmer.tokenizeAndStem("fishing at lake")); // stem a single word