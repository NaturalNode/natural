var natural = require('natural'),
    phonetic = natural.Metaphone;

var wordA = 'phonetics';
var stdin = process.openStdin();
stdin.setEncoding('ascii');

process.stdout.write('try to enter a word that sounds like "' + wordA +'": ');

stdin.on('data', function (wordB) {
	if(phonetic.compare(wordA, wordB))
	    process.stdout.write('they sound alike!\n');
	else
	    process.stdout.write('sorry, they don\'t sound alike.\n');

	process.exit();
    });
