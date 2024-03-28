import { WordNet } from '../lib/natural/wordnet'

let wordnet = new WordNet()
wordnet.lookup('node', function (results) {
  results.forEach(function (result) {
    console.log('------------------------------------')
    console.log(result.synsetOffset)
    console.log(result.pos)
    console.log(result.lemma)
    console.log(result.synonyms)
    console.log(result.pos)
    console.log(result.gloss)
  })
  wordnet = new WordNet()
  wordnet.get(4424418, 'n', function (result) {
    console.log('------------------------------------')
    console.log('Looking up an entry by id 4424418')
    console.log(result.lemma)
    console.log(result.pos)
    console.log(result.gloss)
    console.log(result.synonyms)
  })
})
