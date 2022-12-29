import { Metaphone, SoundEx, DoubleMetaphone } from '../lib/natural/phonetics'

const wordA = 'phonetics'
const wordB = 'fonetix'
if (Metaphone.compare(wordA, wordB)) console.log('they sound alike!')
console.log(Metaphone.process('phonetics'))
console.log(Metaphone.process('phonetics', 3))

const encodings = DoubleMetaphone.process('Matrix')
console.log(encodings[0])
console.log(encodings[1])
if (SoundEx.compare(wordA, wordB)) console.log('they sound alike!')
