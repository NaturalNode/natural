var natural = require('../lib/natural');
var metaphone = new natural.Metaphone();
var soundEx = natural.SoundEx;

var wordA = 'phonetics';
var wordB = 'fonetix';

if(metaphone.compare(wordA, wordB))
console.log('they sound alike!');