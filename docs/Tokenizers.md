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
```

The sentence tokenizer splits a text in sentences based on punctuation. It used the following four characters: period, question mark, exclamation mark, and ellipsis. Furthermore:
- It recognizes abbreviations. It accepts an array of abbreviations as an argument. Case is ignored when matching abbreviations. 
- It handles decimal points in values, periods in URI's and mail addresses gracefully.
- Quotation marks are left in place. Opening mark at the beginning of the sentence, closing mark at the end of the last sentence of the quotation.

The algorithm that the tokenizer applies is based on the idea that all tokens containing punctuation characters that are not meant for marking the end of the sentence are replaced by a placeholder, then the text is split in sentences. Finally, the placeholders are replaced back to the original tokens.

```javascript
const abbreviations = ['i.e.', 'e.g.', 'Dr.']
tokenizer = new natural.SentenceTokenizer(abbreviations);
console.log(tokenizer.tokenize("This is a sentence. This is another sentence"));
// ["This is a sentence.", "This is another sentence."]
```

Overview of available tokenizers:

| Tokenizer              | Language    | Explanation                                                             |
|:-----------------------|:------------|:------------------------------------------------------------------------|
| WordTokenizer          | Any         | Splits on anything except alphabetic characters, digits and underscore  |
| WordPunctTokenizer     | Any         | Splits on anything except alphabetic characters, digits, punctuation and underscore  |
| SentenceTokenizer      | Any         | Break string up into parts based on punctation and quotation marks     |
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
| AggressiveTokenizerUk  | Ukrainian   |  |
| TokenizerJa            | Japanese    |  |  |
