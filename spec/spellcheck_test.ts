import { Spellcheck } from '../lib/natural/spellcheck'

const corpus = ['something', 'soothing']
const spellcheck = new Spellcheck(corpus)
spellcheck.isCorrect('cat') // false
console.log(spellcheck.getCorrections('soemthing', 1)) // ['something']
console.log(spellcheck.getCorrections('soemthing', 2)) // ['something', 'soothing']
