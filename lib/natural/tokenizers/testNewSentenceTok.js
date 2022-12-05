const SentenceTokenizer = require('./sentence_tokenizer_parser')

const sentenceTokenizer = new SentenceTokenizer()

console.log(sentenceTokenizer.tokenize(
'\"All ticketed passengers should now be in the Blue Concourse sleep lounge. Make sure your validation papers are in order. Thank you." The upstairs lounge was not at all grungy.'))
console.log(sentenceTokenizer.tokenize("\"All ticketed passengers should now be in the Blue Concourse sleep lounge. Hi. \" Hi. "))
console.log(sentenceTokenizer.tokenize("hi. \"this is a sentence.\""))
