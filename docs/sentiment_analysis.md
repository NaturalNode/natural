---
layout: default
title: Sentiment Analysis
nav_order: 8
---

# Sentiment Analysis
This is a simple sentiment analysis algorithm based on a vocabulary that assigns polarity to words. The algorithm calculates the sentiment of a piece of text by summing the polarity of each word and normalizing with the length of the sentence. If a negation occurs the result is made negative. It is used as follows:
```javascript
var Analyzer = require('natural').SentimentAnalyzer;
var stemmer = require('natural').PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "afinn");
// getSentiment expects an array of strings
console.log(analyzer.getSentiment(["I", "like", "cherries"]));
// 0.6666666666666666
```
The constructor has three parameters:
* Language: see below for supported languages.
* Stemmer: to increase the coverage of the sentiment analyzer a stemmer may be provided. May be `null`.
* Vocabulary: sets the type of vocabulary, `"afinn"`, `"senticon"` or `"pattern"` are valid values.

Currently, the following languages are supported with type of vocabulary and availability of negations (in alphabetic order):

| Language      | AFINN       | Senticon  | Pattern   | Negations |
| ------------- |:-----------:|:---------:|:---------:|:---------:|
| Basque        |             |  X        |           |           |
| Catalan       |             |  X        |           |           |
| Dutch         |             |           | X         | X         |
| English       | X           |  X        | X         | X         |
| French        |             |           | X         |           |
| Galician      |             |  X        |           |           |
| Italian       |             |           | X         |           |
| Spanish       | X           |  X        |           | X         |

More languages can be added by adding vocabularies and extending the map `languageFiles` in `SentimentAnalyzer.js`. In the tools folder below `lib/natural/sentiment` some tools are provided for transforming vocabularies in Senticon and Pattern format into a JSON format.

## Acknowledgements and References
Thanks to Domingo Martín Mancera for providing the basis for this sentiment analyzer in his repo [Lorca](https://github.com/dmarman/lorca).

AFINN is a list of English words rated for valence with an integer
between minus five (negative) and plus five (positive). The words have
been manually labeled by Finn Årup Nielsen in 2009-2011. Scientific reference can be found [here](http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=6010). We used [afinn-165](https://github.com/words/afinn-165) which is available as nodejs module.

The senticon vocabulary is based on work by Fermin L. Cruz and others:
Cruz, Fermín L., José A. Troyano, Beatriz Pontes, F. Javier Ortega. Building layered, multilingual sentiment lexicons at synset and lemma levels, Expert Systems with Applications, 2014.

The Pattern vocabularies are from the [Pattern project](https://github.com/clips/pattern) of the CLiPS Research Center of University of Antwerpen. These have a PDDL license.
