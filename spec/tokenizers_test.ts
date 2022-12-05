import {
  WordTokenizer,
  TreebankWordTokenizer,
  RegexpTokenizer,
  WordPunctTokenizer
} from "../lib/natural/tokenizers/tokenizers";

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
