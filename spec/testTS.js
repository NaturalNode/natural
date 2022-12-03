const { SentenceTokenizerNew } = require('natural')
const content = `We’re heading for a catastrophic global temperature rise… Fires are blazing from the Amazon to the Arctic`
const tokenizer = new SentenceTokenizer()
tokenizer.tokenize(content) // returns one sentence, while two is expected
