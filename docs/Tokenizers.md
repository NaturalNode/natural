---
layout: default
title: Tokenizers
nav_order: 4
---

# Tokenizers

Word, Regexp, and [Treebank tokenizers](ftp://ftp.cis.upenn.edu/pub/treebank/public_html/tokenization.html) are provided for breaking text up into
arrays of tokens:

```javascript
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
console.log(tokenizer.tokenize("your dog has fleas."));
// [ 'your', 'dog', 'has', 'fleas' ]
```

The other tokenizers follow a similar pattern:

```javascript
tokenizer = new natural.TreebankWordTokenizer();
console.log(tokenizer.tokenize("my dog hasn't any fleas."));
// [ 'my', 'dog', 'has', 'n\'t', 'any', 'fleas', '.' ]

tokenizer = new natural.RegexpTokenizer({pattern: /\-/});
console.log(tokenizer.tokenize("flea-dog"));
// [ 'flea', 'dog' ]

tokenizer = new natural.WordPunctTokenizer();
console.log(tokenizer.tokenize("my dog hasn't any fleas."));
// [ 'my',  'dog',  'hasn',  '\'',  't',  'any',  'fleas',  '.' ]

tokenizer = new natural.OrthographyTokenizer({language: "fi"});
console.log(tokenizer.tokenize("Mikä sinun nimesi on?"));
// [ 'Mikä', 'sinun', 'nimesi', 'on' ]

tokenizer = new natural.SentenceTokenizer();
console.log(tokenizer.tokenize("This is a sentence. This is another sentence"));
// ["This is a sentence.", "This is another sentence."]
```

In addition to the sentence tokenizer based on regular expressions (called `SentenceTokenizer`), there is a sentence tokenizer based on parsing (called `SentenceTokenizerNew`). It is build using PEGjs. It handles more cases, and can be extended in a more structured way (than regular expressions).

The sentence tokenizer can be adapted by editing the PEGjs grammar in `./lib/natural/tokenizers/pegjs_grammar_sentence_tokenizer.txt` and then
```
pegjs -o ./lib/natural/tokenizers/parser_sentence_tokenizer.js ./lib/natural/tokenizers/pegjs_grammar_sentence_tokenizer.txt
```

Overview of available tokenizers:

| Tokenizer              | Language    | Explanation                                                             |
|:-----------------------|:------------|:------------------------------------------------------------------------|
| WordTokenizer          | Any         | Splits on anything except alphabetic characters, digits and underscore  |
| WordPunctTokenizer     | Any         | Splits on anything except alphabetic characters, digits, punctuation and underscore  |
| SentenceTokenizer      | Any         | Break string up into parts based on punctation and quotation marks     |
| SentenceTokenizerNew   | Any         | Break string up into parts based on punctation and quotation marks (grammar/parser based)     |
| CaseTokenizer          | Any?        | If lower and upper case are the same, the character is assumed to be whitespace or something else (punctuation) |
| RegexpTokenizer        | Any         | Splits on a regular expression that either defines sequences of word characters or gap characters |
| OrthographyTokenizer   | Finnish     | Splits on anything except alpabetic characters, digits and underscore   |
| TreebankWordTokenizer  | Any         |  |
| AggressiveTokenizer    | English     |  |
| AggressiveTokenizerFa  | Farsi       |  |
| AggressiveTokenizerFr  | French      |  |
| AggressiveTokenizerDe  | German      |  |
| AggressiveTokenizerRu  | Russian     |  |
| AggressiveTokenizerEs  | Spanish     |  |
| AggressiveTokenizerIt  | Italian     |  |
| AggressiveTokenizerPl  | Polish      |  |
| AggressiveTokenizerPt  | Portuguese  |  |
| AggressiveTokenizerNo  | Norwegian   |  |
| AggressiveTokenizerSv  | Swedish     |  |
| AggressiveTokenizerVi  | Vietnamese  |  |
| AggressiveTokenizerId  | Indonesian  |  |
| AggressiveTokenizerHi  | Hindi       |  |
| TokenizerJa            | Japanese    |  |  |
