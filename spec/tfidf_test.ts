import { TfIdf } from '../lib/natural/tfidf'

let tfidf = new TfIdf()

tfidf.addDocument('this document is about node.')
tfidf.addDocument('this document is about ruby.')
tfidf.addDocument('this document is about ruby and node.')
tfidf.addDocument('this document is about node. it has node examples')

console.log('node --------------------------------')
tfidf.tfidfs('node', function (i, measure) {
  console.log('document #' + i + ' is ' + measure)
})

console.log('ruby --------------------------------')
tfidf.tfidfs('ruby', function (i, measure) {
  console.log('document #' + i + ' is ' + measure)
})
console.log(tfidf.tfidf('node', 0))
console.log(tfidf.tfidf('node', 1))
tfidf = new TfIdf()
// tfidf.addFileSync('data_files/one.txt')
// tfidf.addFileSync('data_files/two.txt')
tfidf.addDocument('this document is about node.')
tfidf.addDocument('this document is about ruby.')
tfidf.addDocument('this document is about ruby and node.')

tfidf.tfidfs('node ruby', function (i, measure) {
  console.log('document #' + i + ' is ' + measure)
})
tfidf.addDocument(['document', 'about', 'node'])
tfidf.addDocument(['document', 'about', 'ruby'])
tfidf.addDocument(['document', 'about', 'ruby', 'node'])
tfidf.addDocument(['document', 'about', 'node', 'node', 'examples'])

tfidf.tfidfs(['node', 'ruby'], function (i, measure) {
  console.log('document #' + i + ' is ' + measure)
})
tfidf.listTerms(0 /*document index*/).forEach(function (item) {
  console.log(item.term + ': ' + item.tfidf)
})
tfidf = new TfIdf()
tfidf.addDocument('document one', 'un')
tfidf.addDocument('document Two', 'deux')
let s = JSON.stringify(tfidf)
// save "s" to disk, database or otherwise

// assuming you pulled "s" back out of storage.
tfidf = new TfIdf(JSON.parse(s))
