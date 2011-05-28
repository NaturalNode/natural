var natural = require('natural'),
    phonetic = natural.Metaphone;

var sentence = 'phonetic modules contain algorithms';
var stdin = process.openStdin();
stdin.setEncoding('ascii');
phonetic.attach();
process.stdout.write('enter a word that sounds like one of these, "' + sentence +'": ');

words = sentence.tokenizeAndPhoneticize();

function findMatch(input) {
    inputSounds = input.phonetics();
    
    for(var i = 0; i < words.length; i++) {
	wordSounds = words[i];
	
	if(wordSounds == inputSounds) {
	    process.stdout.write('match found!\n');
	    return;
	}
    }

    process.stdout.write('no match found.\n');
    return;
}

stdin.on('data', function (input) {
	findMatch(input);
	process.exit();
    });
