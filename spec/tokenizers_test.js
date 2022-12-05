"use strict";
exports.__esModule = true;
var tokenizers_1 = require("../lib/natural/tokenizers/tokenizers");
var tokenizer = new tokenizers_1.WordTokenizer();
console.log(tokenizer.tokenize('your dog has fleas.'));
tokenizer = new tokenizers_1.TreebankWordTokenizer();
console.log(tokenizer.tokenize("my dog hasn't any fleas."));
// [ 'my', 'dog', 'has', 'n\'t', 'any', 'fleas', '.' ]
tokenizer = new tokenizers_1.RegexpTokenizer({ pattern: /\-/ });
console.log(tokenizer.tokenize('flea-dog'));
// [ 'flea', 'dog' ]
tokenizer = new tokenizers_1.WordPunctTokenizer();
console.log(tokenizer.tokenize("my dog hasn't any fleas."));
// [ 'my',  'dog',  'hasn',  '\'',  't',  'any',  'fleas',  '.' ]
