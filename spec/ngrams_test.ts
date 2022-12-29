import { NGrams, NGramsZH } from '../lib/natural/ngrams'

console.log(NGrams.bigrams('some words here'))
console.log(NGrams.bigrams(['some', 'words', 'here']))
console.log(NGrams.trigrams('some other words here'))
console.log(NGrams.trigrams(['some', 'other', 'words', 'here']))
console.log(NGrams.ngrams('some other words here for you', 4))
console.log(NGrams.ngrams(['some', 'other', 'words', 'here', 'for', 'you'], 4))
console.log(NGrams.ngrams('some other words here for you', 4, '[start]', '[end]'))
console.log(NGrams.ngrams('some other words here for you', 4, undefined, '[end]'))

console.log(NGramsZH.bigrams('中文测试'))
console.log(NGramsZH.bigrams(['中', '文', '测', '试']))
console.log(NGramsZH.trigrams('中文测试'))
console.log(NGramsZH.trigrams(['中', '文', '测', '试']))
console.log(NGramsZH.ngrams('一个中文测试', 4))
console.log(NGramsZH.ngrams(['一', '个', '中', '文', '测', '试'], 4))
