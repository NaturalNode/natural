import {
  WordTokenizer,
  TreebankWordTokenizer,
  RegexpTokenizer,
  WordPunctTokenizer,
  SentenceTokenizer
} from '../lib/natural/tokenizers'

// Tokenizers
var tokenizer = new WordTokenizer();
console.log(tokenizer.tokenize('your dog has fleas.'));

tokenizer = new TreebankWordTokenizer();
console.log(tokenizer.tokenize("my dog hasn't any fleas."));
// [ 'my', 'dog', 'has', 'n\'t', 'any', 'fleas', '.' ]

tokenizer = new RegexpTokenizer({ pattern: /\-/ });
console.log(tokenizer.tokenize('flea-dog'));
// [ 'flea', 'dog' ]

tokenizer = new WordPunctTokenizer();
console.log(tokenizer.tokenize("my dog hasn't any fleas."));
// [ 'my',  'dog',  'hasn',  '\'',  't',  'any',  'fleas',  '.' ]

tokenizer = new SentenceTokenizer();
console.log(tokenizer.tokenize('One sentence. Another sentence.'));
