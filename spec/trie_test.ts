import { Trie } from '../lib/natural/trie'

const trie = new Trie()

// Add one string at a time
trie.addString('test')

// Or add many strings
trie.addStrings(['string1', 'string2', 'string3'])
console.log(trie.contains('test')) // true
console.log(trie.contains('asdf')) // false
console.log(trie.findPrefix('tester')) // ['test', 'er']
console.log(trie.findPrefix('string4')) // [null, '4']
console.log(trie.findPrefix('string3')) // ['string3', '']
trie.addString('tes')
trie.addString('est')
console.log(trie.findMatchesOnPath('tester')) // ['tes', 'test'];
console.log(trie.keysWithPrefix('string')) // ["string1", "string2", "string3"]
trie.contains('TEST') // false

const ciTrie = new Trie(false)
ciTrie.addString('test')
ciTrie.contains('TEsT') // true
