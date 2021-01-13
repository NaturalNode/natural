---
layout: default
title: Stemmers
nav_order: 5
---

# Stemmers

Currently stemming is supported via the [Porter](http://tartarus.org/martin/PorterStemmer/index.html) and [Lancaster](http://www.comp.lancs.ac.uk/computing/research/stemming/) (Paice/Husk) algorithms. The Indonesian and Japanese stemmers do not follow a known algorithm.

```javascript
var natural = require('natural');
```

This example uses a Porter stemmer. "word" is returned.

```javascript
console.log(natural.PorterStemmer.stem("words")); // stem a single word
```

 in Russian:

```javascript
console.log(natural.PorterStemmerRu.stem("падший"));
```

 in Spanish:

```javascript
console.log(natural.PorterStemmerEs.stem("jugaría"));
```

The following stemmers are available:

| Language      | Porter      | Lancaster | Other     | Module            |
|:------------- |:-----------:|:---------:|:---------:|:------------------|
| Dutch         | X           |           |           | `PorterStemmerNl` |
| English       | X           |           |           | `PorterStemmer`   |
| English       |             |  X        |           | `LancasterStemmer` |
| Farsi (in progress) |  X    |           |           | `PorterStemmerFa` |
| French        | X           |           |           | `PorterStemmerFr` |
| French        |             |           | X         | `CarryStemmerFr`  |
| Indonesian    |             |           | X         | `StemmerId`       |
| Italian       | X           |           |           | `PorterStemmerIt` |
| Japanese      |             |           | X         | `StemmerJa`       |
| Norwegian     | X           |           |           | `PorterStemmerNo` |
| Portugese     | X           |           |           | `PorterStemmerPt` |
| Russian       | X           |           |           | `PorterStemmerRu` |
| Spanish       | X           |           |           | `PorterStemmerEs` |
| Swedish       | X           |           |           | `PorterStemmerSv` |


`attach()` patches `stem()` and `tokenizeAndStem()` to String as a shortcut to
`PorterStemmer.stem(token)`. `tokenizeAndStem()` breaks text up into single words
and returns an array of stemmed tokens.

```javascript
natural.PorterStemmer.attach();
console.log("i am waking up to the sounds of chainsaws".tokenizeAndStem());
console.log("chainsaws".stem());
```

The same thing can be done with a Lancaster stemmer:

```javascript
natural.LancasterStemmer.attach();
console.log("i am waking up to the sounds of chainsaws".tokenizeAndStem());
console.log("chainsaws".stem());
```

## Carry stemmer
For French an additional stemmer is added called Carry stemmer. This is a **Galileo Carry algorithm** based on http://www.otlet-institute.org/docs/Carry.pdf

Note :bangbang:: The implementation descibed in the PDF differs with the one from [the official C++ implementation](http://www.otlet-institute.org/wikics/Building_GALILEI_Platform.html#toc-Section-3). This implementation follows the C++ implementation rules which solves some problems of the algorithm described in the article.

## References

* Carry stemmer is a contribution by Johan Maupetit.
* PEGjs: Parser Generator for JavaScript, https://pegjs.org/
