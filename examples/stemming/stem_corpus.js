
var natural = require('natural'),
    stemmer = natural.PorterStemmer;
    
stemmer.attach();
    
console.log('i stemmed words.'.tokenizeAndStem());
console.log('i stemmed words.'.tokenizeAndStem(true));
