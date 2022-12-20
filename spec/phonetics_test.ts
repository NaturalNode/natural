import { Metaphone, SoundEx, DoubleMetaphone } from '../lib/natural/phonetics'

var wordA = 'phonetics'
var wordB = 'fonetix'
if (Metaphone.compare(wordA, wordB)) console.log('they sound alike!')
console.log(Metaphone.process('phonetics'))
console.log(Metaphone.process('phonetics', 3))

var encodings = DoubleMetaphone.process('Matrix')
console.log(encodings[0])
console.log(encodings[1])
if (SoundEx.compare(wordA, wordB)) console.log('they sound alike!')
