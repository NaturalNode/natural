natural
=======

[![NPM version](https://img.shields.io/npm/v/natural.svg)](https://www.npmjs.com/package/natural)
[![Build Status](https://travis-ci.org/NaturalNode/natural.png?branch=master)](https://travis-ci.org/NaturalNode/natural)
[![Slack](https://slack.bri.im/badge.svg)](https://slack.bri.im)

"Natural" is a general natural language facility for nodejs. Tokenizing,
stemming, classification, phonetics, tf-idf, WordNet, string similarity,
and some inflections are currently supported.

It's still in the early stages, so we're very interested in bug reports,
contributions and the like.

Note that many algorithms from Rob Ellis's [node-nltools](https://github.com/NaturalNode/node-nltools) are
being merged into this project and will be maintained from here onward.

While most of the algorithms are English-specific, contributors have implemented support for other languages. Thanks to Polyakov Vladimir, Russian stemming has been added! Thanks to David Przybilla, Spanish stemming has been added! Thanks to [even more contributors](https://github.com/NaturalNode/natural/graphs/contributors), stemming and tokenizing in more languages have been added.

Aside from this README, the only documentation is [this DZone article](http://www.dzone.com/links/r/using_natural_a_nlp_module_for_nodejs.html), [this course on Egghead.io](https://egghead.io/courses/natural-language-processing-in-javascript-with-natural), and [here on my blog](http://www.chrisumbel.com/article/node_js_natural_language_porter_stemmer_lancaster_bayes_naive_metaphone_soundex). The README is up to date, the other sources are somewhat outdated.

### TABLE OF CONTENTS

* [Installation](#installation)
* [Tokenizers](#tokenizers)
* [String Distance](#string-distance)
* [Approximate String Matching](#approximate-string-matching)
* [Stemmers](#stemmers)
* [Classifiers](#classifiers)
* [Sentiment Analysis](#sentiment-analysis)
* [Phonetics](#phonetics)
* [Inflectors](#inflectors)
* [N-Grams](#n-grams)
* [tf-idf](#tf-idf)
* [Tries](#tries)
* [EdgeWeightedDigraph](#edgeweighteddigraph)
* [ShortestPathTree](#shortestpathtree)
* [LongestPathTree](#longestpathtree)
* [WordNet](#wordnet)
* [Spellcheck](#spellcheck)
* [POS Tagger](#pos-tagger)
* [Development](#development)
* [License](#license)


## Installation

If you're just looking to use natural without your own node application,
you can install via NPM like so:

    npm install natural

If you're interested in contributing to natural, or just hacking on it, then by all
means fork away!

## Tokenizers

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
| AggressiveTokenizerRu  | Russian     |  |
| AggressiveTokenizerEs  | Spanish     |  |
| AggressiveTokenizerIt  | Italian     |  |
| AggressiveTokenizerPl  | Polish      |  |
| AggressiveTokenizerPt  | Portuguese  |  |
| AggressiveTokenizerNo  | Norwegian   |  |
| AggressiveTokenizerSv  | Swedish     |  |
| AggressiveTokenizerVi  | Vietnamese  |  |
| AggressiveTokenizerId  | Indonesian  |  |
| TokenizerJa            | Japanese    |  |  |



## String Distance

Natural provides an implementation of three algorithms for calculating string distance: Hamming distance, Jaro-Winkler, Levenshtein distance, and Dice coefficient.

[Hamming distance](https://en.wikipedia.org/wiki/Hamming_distance) measures the distance between two strings of equal length by counting the number of different characters. The third parameter indicates whether case should be ignored. By default the algorithm is case sensitive.
```javascript
var natural = require('natural');
console.log(natural.HammingDistance("karolin", "kathrin", false));
console.log(natural.HammingDistance("karolin", "kerstin", false));
// If strings differ in length -1 is returned
console.log(natural.HammingDistance("short string", "longer string", false));
```

Output:
```javascript
3
3
-1
```


The [Jaro–Winkler](http://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance) string distance measuring algorithm will return a number between 0 and 1 which tells how closely the strings match (0 = not at all, 1 = exact match):

```javascript
var natural = require('natural');
console.log(natural.JaroWinklerDistance("dixon","dicksonx"));
console.log(natural.JaroWinklerDistance('not', 'same'));
```

Output:

```javascript
0.7466666666666666
0
```

If the distance between the strings is already known you can pass it as a third parameter. And you can force the algorithm to ignore case by passing a fourth parameter as follows:
```javascript
var natural = require('natural');
console.log(natural.JaroWinklerDistance("dixon","dicksonx", undefined, true));
```


Natural also offers support for [Levenshtein](https://en.wikipedia.org/wiki/Levenshtein_distance) distances:

```javascript
var natural = require('natural');
console.log(natural.LevenshteinDistance("ones","onez"));
console.log(natural.LevenshteinDistance('one', 'one'));
```

Output:

```javascript
1
0
```

The cost of the three edit operations are modifiable for Levenshtein:

```javascript
console.log(natural.LevenshteinDistance("ones","onez", {
    insertion_cost: 1,
    deletion_cost: 1,
    substitution_cost: 1
}));
```

Output:

```javascript
1
```

Full Damerau-Levenshtein matching can be used if you want to consider character transpositions as a valid edit operation.

```javascript
console.log(natural.DamerauLevenshteinDistance("az", "za"));
```

Output:
```javascript
1
```

The transposition cost can be modified as well:

```javascript
console.log(natural.DamerauLevenshteinDistance("az", "za", { transposition_cost: 0 }))
```

Output:
```javascript
0
```

A restricted form of Damerau-Levenshtein (Optimal String Alignment) is available.

This form of matching is more space efficient than unrestricted Damerau-Levenshtein, by only considering a transposition if there are no characters between the transposed characters.

Comparison:

```javascript
// Optimal String Alignment
console.log(natural.DamerauLevenshteinDistance('ABC', 'ACB'), { restricted: true });
1
console.log(natural.DamerauLevenshteinDistance('CA', 'ABC', { restricted: true }));
2
// Unrestricted Damerau-Levenshtein
console.log(natural.DamerauLevenshteinDistance('CA', 'ABC', { restricted: false }));
1
```

And [Dice's co-efficient](https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient):

```javascript
var natural = require('natural');
console.log(natural.DiceCoefficient('thing', 'thing'));
console.log(natural.DiceCoefficient('not', 'same'));
```

Output:

```javascript
1
0
```

## Approximate String Matching
Currently matching is supported via the Levenshtein algorithm.

```javascript
var natural = require('natural');
var source = 'The RainCoat BookStore';
var target = 'All the best books are here at the Rain Coats Book Store';

console.log(natural.LevenshteinDistance(source, target, {search: true}));
```

Output:

```javascript
{ substring: 'the Rain Coats Book Store', distance: 4 }
```

The following

## Stemmers

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

### Carry stemmer
For French an additional stemmer is added called Carry stemmer. This is a **Galileo Carry algorithm** based on http://www.otlet-institute.org/docs/Carry.pdf

Note :bangbang:: The implementation descibed in the PDF differs with the one from [the official C++ implementation](http://www.otlet-institute.org/wikics/Building_GALILEI_Platform.html#toc-Section-3). This implementation follows the C++ implementation rules which solves some problems of the algorithm described in the article.

## Classifiers

### Bayesian and logistic regression

Two classifiers are currently supported, [Naive Bayes](http://en.wikipedia.org/wiki/Naive_Bayes_classifier) and [logistic regression](http://en.wikipedia.org/wiki/Logistic_regression).
The following examples use the BayesClassifier class, but the
LogisticRegressionClassifier class could be substituted instead.

```javascript
var natural = require('natural');
var classifier = new natural.BayesClassifier();
```

You can train the classifier on sample text. It will use reasonable defaults to
tokenize and stem the text.

```javascript
classifier.addDocument('i am long qqqq', 'buy');
classifier.addDocument('buy the q\'s', 'buy');
classifier.addDocument('short gold', 'sell');
classifier.addDocument('sell gold', 'sell');

classifier.train();
```

Outputs "sell"

```javascript
console.log(classifier.classify('i am short silver'));
```

Outputs "buy"

```javascript
console.log(classifier.classify('i am long copper'));
```

You have access to the set of matched classes and the associated value from the classifier.

Outputs:

```javascript
[ { label: 'buy', value: 0.39999999999999997 },
  { label: 'sell', value: 0.19999999999999998 } ]
```

From this:

```javascript
console.log(classifier.getClassifications('i am long copper'));
```

The classifier can also be trained with and can classify arrays of tokens, strings, or
any mixture of the two. Arrays let you use entirely custom data with your own
tokenization/stemming, if you choose to implement it.

```javascript
classifier.addDocument(['sell', 'gold'], 'sell');
```

The training process can be monitored by subscribing to the event `trainedWithDocument` that's emitted by the classifier, this event's emitted each time a document is finished being trained against:
```javascript
    classifier.events.on('trainedWithDocument', function (obj) {
       console.log(obj);
       /* {
       *   total: 23 // There are 23 total documents being trained against
       *   index: 12 // The index/number of the document that's just been trained against
       *   doc: {...} // The document that has just been indexed
       *  }
       */
    });
```
A classifier can also be persisted and recalled so you can reuse a training

```javascript
classifier.save('classifier.json', function(err, classifier) {
    // the classifier is saved to the classifier.json file!
});
```

To recall from the classifier.json saved above:

```javascript
natural.BayesClassifier.load('classifier.json', null, function(err, classifier) {
    console.log(classifier.classify('long SUNW'));
    console.log(classifier.classify('short SUNW'));
});
```

A classifier can also be serialized and deserialized like so:

```javascript
var classifier = new natural.BayesClassifier();
classifier.addDocument(['sell', 'gold'], 'sell');
classifier.addDocument(['buy', 'silver'], 'buy');

// serialize
var raw = JSON.stringify(classifier);
// deserialize
var restoredClassifier = natural.BayesClassifier.restore(JSON.parse(raw));
console.log(restoredClassifier.classify('i should sell that'));
```

__Note:__ if using the classifier for languages other than English you may need
to pass in the stemmer to use. In fact, you can do this for any stemmer including
alternate English stemmers. The default is the `PorterStemmer`.

```javascript
const PorterStemmerRu = require('./node_modules/natural/lib/natural/stemmers/porter_stemmer_ru');
var classifier = new natural.BayesClassifier(PorterStemmerRu);
```

### Maximum Entropy Classifier
This module provides a classifier based on maximum entropy modelling. The central idea to maximum entropy modelling is to estimate a probability distribution that that has maximum entropy subject to the evidence that is available. This means that the distribution follows the data it has "seen" but does not make any assumptions beyond that.

The module is not specific to natural language processing, or any other application domain. There are little requirements with regard to the data structure it can be trained on. For training, it needs a sample that consists of elements. These elements have two parts:
* part a: the class of the element
* part b: the context of the element
The classifier will, once trained, return the most probable class for a particular context.

We start with an explanation of samples and elements. You have to create your own specialisation of the Element class. Your element class should implement the generateFeatures method for inferring feature functions from the sample.

#### Samples and elements
Elements and contexts are created as follows:

```javascript
var MyElement = require('MyElementClass');
var Context = require('Context');
var Sample = require('Sample');

var x = new MyElementClass("x", new Context("0"));
// A sample is created from an array of elements
var sample = new Sample();
sample.addElement(x);
```
A class is a string, contexts may be as complex as you want (as long as it can be serialised).

A sample can be saved to and loaded from a file:
```javascript
sample.save('sample.json', function(error, sample) {
  ...
});
```
A sample can be read from a file as follows.

```javascript
sample.load('sample.json', MyElementClass, function(err, sample) {

});
```
You have to pass the element class to the load method so that the right element objects can be created from the data.

#### Features and feature sets
Features are functions that map elements to zero or one. Features are defined as follows:
```javascript
var Feature = require('Feature');

function f(x) {
  if (x.b === "0") {
    return 1;
  }
  return 0;
}

var feature = new Feature(f, name, parameters);
```
<code>name</code> is a string for the name of the feature function, <code>parameters</code> is an array of strings for the parameters of the feature function. The combination of name and parameters should uniquely distinguish features from each other. Features that are added to a feature set are tested for uniqueness using these properties.

A feature set is created like this
```javascript
var FeatureSet = require('FeatureSet');

var set = new FeatureSet();
set.addFeature(f, "f", ["0"]);
```

In most cases you will generate feature functions using closures. For instance, when you generate feature functions in a loop that iterates through an array
```javascript
var FeatureSet = require('FeatureSet');
var Feature = require('Feature');

var listOfTags = ['NN', 'DET', 'PREP', 'ADJ'];
var featureSet = new FeatureSet();

listofTags.forEach(function(tag) {
  function isTag(x) {
    if (x.b.data.tag === tag) {
      return 1
    }
    return 0;
  }
  featureSet.addFeature(new Feature(isTag, "isTag", [tag]));
});
```
In this example you create feature functions that each have a different value for <code>tag</code> in their closure.

#### Setting up and training the classifier
A classifier needs the following parameter:
* Classes: an array of classes (strings)
* Features: an array of feature functions
* Sample: a sample of elements for training the classifier

A classifier can be created as follows:
```javascript
var Classifier = require('Classifier');
var classifier = new Classifier(classes, featureSet, sample);
```
And it starts training with:
```javascript
var maxIterations = 100;
var minImprovement = .01;
var p = classifier.train(maxIterations, minImprovement);
```
Training is finished when either <code>maxIterations</code> is reached or the improvement in likelihood (of the sample) becomes smaller than <code>minImprovement</code>. It returns a probability distribution that can be stored and retrieved for later usage:
```javascript
classifier.save('classifier.json', function(err, c) {
  if (err) {
    console.log(err);
  }
  else {
    // Continue using the classifier
  }
});

classifier.load('classifier.json', function(err, c) {
  if (err) {
    console.log(err);
  }
  else {
    // Use the classifier
  }
});
```

The training algorithm is based on Generalised Iterative Scaling.

#### Applying the classifier
The classifier can be used to classify contexts in two ways. To get the probabilities for all classes:
```javascript
var classifications = classifier.getClassifications(context);
classifications.forEach(function(classPlusProbability) {
  console.log('Class ' + classPlusProbability.label + ' has score ' + classPlusProbability.value);
});
```
This returns a map from classes to probabilities.
To get the highest scoring class:
```javascript
var class = classifier.classify(context);
console.log(class);
```

#### Simple example of maximum entropy modelling
A  test is added to the spec folder based on simple elements that have contexts that are either "0" or "1", and classes are "x" and "y".
```javascript
{
  "a": "x",
  "b": {
    "data": "0"
  }
}
```
In the SE_Element class that inherits from Element, the method generateFeatures is implemented. It creates a feature function that tests for context "0".

After setting up your own element class, the classifier can be created and trained.

#### Application to POS tagging
A more elaborate example of maximum entropy modelling is provided for part of speech tagging. The following steps are taken to create a classifier and apply it to a test set:
* A new element class POS_Element is created that has a word window and a tag window around the word to be tagged.
* From the Brown corpus a sample is generated consisting of POS elements.
* Feature functions are generated from the sample.
* A classifier is created and trained.
* The classifier is applied to a test set. Results are compared to a simple lexicon-based tagger.

#### References
* Adwait RatnaParkhi, Maximum Entropy Models For Natural Language Ambiguity Resolution, University of Pennsylvania, 1998, URL: http://repository.upenn.edu/cgi/viewcontent.cgi?article=1061&context=ircs_reports
* Darroch, J.N.; Ratcliff, D. (1972). Generalized iterative scaling for log-linear models, The Annals of Mathematical Statistics, Institute of Mathematical Statistics, 43 (5): 1470–1480.

## Sentiment Analysis
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



### Acknowledgements and References
Thanks to Domingo Martín Mancera for providing the basis for this sentiment analyzer in his repo [Lorca](https://github.com/dmarman/lorca).

AFINN is a list of English words rated for valence with an integer
between minus five (negative) and plus five (positive). The words have
been manually labeled by Finn Årup Nielsen in 2009-2011. Scientific reference can be found [here](http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=6010). We used [afinn-165](https://github.com/words/afinn-165) which is available as nodejs module.

The senticon vocabulary is based on work by Fermin L. Cruz and others:
Cruz, Fermín L., José A. Troyano, Beatriz Pontes, F. Javier Ortega. Building layered, multilingual sentiment lexicons at synset and lemma levels, Expert Systems with Applications, 2014.

The Pattern vocabularies are from the [Pattern project](https://github.com/clips/pattern) of the CLiPS Research Center of University of Antwerpen. These have a PDDL license.

## Phonetics
Phonetic matching (sounds-like) matching can be done with the [SoundEx](http://en.wikipedia.org/wiki/Soundex),
[Metaphone](http://en.wikipedia.org/wiki/Metaphone) or [DoubleMetaphone](http://en.wikipedia.org/wiki/Metaphone#Double_Metaphone) algorithms

```javascript
var natural = require('natural');
var metaphone = natural.Metaphone;
var soundEx = natural.SoundEx;

var wordA = 'phonetics';
var wordB = 'fonetix';
```

To test the two words to see if they sound alike:

```javascript
if(metaphone.compare(wordA, wordB))
    console.log('they sound alike!');
```

The raw phonetics are obtained with `process()`:

```javascript
console.log(metaphone.process('phonetics'));
```

A maximum code length can be supplied:

```javascript
console.log(metaphone.process('phonetics', 3));
```

`DoubleMetaphone` deals with two encodings returned in an array. This
feature is experimental and subject to change:

```javascript
var natural = require('natural');
var dm = natural.DoubleMetaphone;

var encodings = dm.process('Matrix');
console.log(encodings[0]);
console.log(encodings[1]);
```

Attaching will patch String with useful methods:

```javascript
metaphone.attach();
```

`soundsLike` is essentially a shortcut to `Metaphone.compare`:

```javascript
if(wordA.soundsLike(wordB))
    console.log('they sound alike!');
```

The raw phonetics are obtained with `phonetics()`:

```javascript
console.log('phonetics'.phonetics());
```

Full text strings can be tokenized into arrays of phonetics (much like how tokenization-to-arrays works for stemmers):

```javascript
console.log('phonetics rock'.tokenizeAndPhoneticize());
```

Same module operations applied with `SoundEx`:

```javascript
if(soundEx.compare(wordA, wordB))
    console.log('they sound alike!');
```

The same String patches apply with `soundEx`:

```javascript
soundEx.attach();

if(wordA.soundsLike(wordB))
    console.log('they sound alike!');

console.log('phonetics'.phonetics());
```

## Inflectors

### Nouns

Nouns can be pluralized/singularized with a `NounInflector`:

```javascript
var natural = require('natural');
var nounInflector = new natural.NounInflector();
```

To pluralize a word (outputs "radii"):

```javascript
console.log(nounInflector.pluralize('radius'));
```

To singularize a word (outputs "beer"):

```javascript
console.log(nounInflector.singularize('beers'));
```

Like many of the other features, String can be patched to perform the operations
directly. The "Noun" suffix on the methods is necessary, as verbs will be
supported in the future.

```javascript
nounInflector.attach();
console.log('radius'.pluralizeNoun());
console.log('beers'.singularizeNoun());
```

### Numbers

Numbers can be counted with a CountInflector:

```javascript
var countInflector = natural.CountInflector;
```

Outputs "1st":

```javascript
console.log(countInflector.nth(1));
```

Outputs "111th":

```javascript
console.log(countInflector.nth(111));
```

### Present Tense Verbs

Present Tense Verbs can be pluralized/singularized with a PresentVerbInflector.
This feature is still experimental as of 0.0.42, so use with caution, and please
provide feedback.

```javascript
var verbInflector = new natural.PresentVerbInflector();
```

Outputs "becomes":

```javascript
console.log(verbInflector.singularize('become'));
```

Outputs "become":

```javascript
console.log(verbInflector.pluralize('becomes'));
```

Like many other natural modules, `attach()` can be used to patch strings with
handy methods.

```javascript
verbInflector.attach();
console.log('walk'.singularizePresentVerb());
console.log('walks'.pluralizePresentVerb());
```


## N-Grams

n-grams can be obtained for either arrays or strings (which will be tokenized
for you):

```javascript
var NGrams = natural.NGrams;
```

### bigrams

```javascript
console.log(NGrams.bigrams('some words here'));
console.log(NGrams.bigrams(['some',  'words',  'here']));
```

Both of the above output: `[ [ 'some', 'words' ], [ 'words', 'here' ] ]`

### trigrams

```javascript
console.log(NGrams.trigrams('some other words here'));
console.log(NGrams.trigrams(['some',  'other', 'words',  'here']));
```

Both of the above output: `[ [ 'some', 'other', 'words' ],
  [ 'other', 'words', 'here' ] ]`

### arbitrary n-grams

```javascript
console.log(NGrams.ngrams('some other words here for you', 4));
console.log(NGrams.ngrams(['some', 'other', 'words', 'here', 'for',
    'you'], 4));
```

The above outputs: `[ [ 'some', 'other', 'words', 'here' ],
  [ 'other', 'words', 'here', 'for' ],
  [ 'words', 'here', 'for', 'you' ] ]`

### padding

n-grams can also be returned with left or right padding by passing a start and/or end symbol to the bigrams, trigrams or ngrams.

```javascript
console.log(NGrams.ngrams('some other words here for you', 4, '[start]', '[end]'));
```

The above will output:
```
[ [ '[start]', '[start]', '[start]', 'some' ],
  [ '[start]', '[start]', 'some', 'other' ],
  [ '[start]', 'some', 'other', 'words' ],
  [ 'some', 'other', 'words', 'here' ],
  [ 'other', 'words', 'here', 'for' ],
  [ 'words', 'here', 'for', 'you' ],
  [ 'here', 'for', 'you', '[end]' ],
  [ 'for', 'you', '[end]', '[end]' ],
  [ 'you', '[end]', '[end]', '[end]' ] ]
```

For only end symbols, pass `null` for the start symbol, for instance:
```javascript
console.log(NGrams.ngrams('some other words here for you', 4, null, '[end]'));
```

Will output:
```
[ [ 'some', 'other', 'words', 'here' ],
  [ 'other', 'words', 'here', 'for' ],
  [ 'words', 'here', 'for', 'you' ],
  [ 'here', 'for', 'you', '[end]' ],
  [ 'for', 'you', '[end]', '[end]' ],
  [ 'you', '[end]', '[end]', '[end]' ] ]
```

### NGramsZH

For Chinese like languages, you can use NGramsZH to do a n-gram, and all apis are the same:

```javascript
var NGramsZH = natural.NGramsZH;
console.log(NGramsZH.bigrams('中文测试'));
console.log(NGramsZH.bigrams(['中',  '文',  '测', '试']));
console.log(NGramsZH.trigrams('中文测试'));
console.log(NGramsZH.trigrams(['中',  '文', '测',  '试']));
console.log(NGramsZH.ngrams('一个中文测试', 4));
console.log(NGramsZH.ngrams(['一', '个', '中', '文', '测',
    '试'], 4));
```

## tf-idf

[Term Frequency–Inverse Document Frequency (tf-idf)](http://en.wikipedia.org/wiki/Tf%E2%80%93idf) is implemented to determine how important a word (or words) is to a
document relative to a corpus. The following formulas are used for calculating tf and idf:
* tf(t, d) is a so-called raw count, so just the count of the term in the document
* idf(t, D) uses the following formula: 1 + ln(N / (1 + n_t)) where N is the number of documents, and n_t the number of documents in which the term appears. The 1 + in the denominator is for handling the possibility that n_t is 0.

The following example will add four documents to
a corpus and determine the weight of the word "node" and then the weight of the
word "ruby" in each document.

```javascript
var natural = require('natural');
var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();

tfidf.addDocument('this document is about node.');
tfidf.addDocument('this document is about ruby.');
tfidf.addDocument('this document is about ruby and node.');
tfidf.addDocument('this document is about node. it has node examples');

console.log('node --------------------------------');
tfidf.tfidfs('node', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});

console.log('ruby --------------------------------');
tfidf.tfidfs('ruby', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});
```

The above outputs:

```
node --------------------------------
document #0 is 1
document #1 is 0
document #2 is 1
document #3 is 2
ruby --------------------------------
document #0 is 0
document #1 is 1.2876820724517808
document #2 is 1.2876820724517808
document #3 is 0
```

This approach can also be applied to individual documents.

The following example measures the term "node" in the first and second documents.

```javascript
console.log(tfidf.tfidf('node', 0));
console.log(tfidf.tfidf('node', 1));
```

A TfIdf instance can also load documents from files on disk.

```javascript
var tfidf = new TfIdf();
tfidf.addFileSync('data_files/one.txt');
tfidf.addFileSync('data_files/two.txt');
```

Multiple terms can be measured as well, with their weights being added into
a single measure value. The following example determines that the last document
is the most relevant to the words "node" and "ruby".

```javascript
var natural = require('natural');
var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();

tfidf.addDocument('this document is about node.');
tfidf.addDocument('this document is about ruby.');
tfidf.addDocument('this document is about ruby and node.');

tfidf.tfidfs('node ruby', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});
```

The above outputs:

```
document #0 is 1
document #1 is 1
document #2 is 2
```

The examples above all use strings, which causes natural to automatically tokenize the input.
If you wish to perform your own tokenization or other kinds of processing, you
can do so, then pass in the resultant arrays later. This approach allows you to bypass natural's
default preprocessing.

```javascript
var natural = require('natural');
var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();

tfidf.addDocument(['document', 'about', 'node']);
tfidf.addDocument(['document', 'about', 'ruby']);
tfidf.addDocument(['document', 'about', 'ruby', 'node']);
tfidf.addDocument(['document', 'about', 'node', 'node', 'examples']);

tfidf.tfidfs(['node', 'ruby'], function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});
```

It's possible to retrieve a list of all terms in a document, sorted by their
importance.

```javascript
tfidf.listTerms(0 /*document index*/).forEach(function(item) {
    console.log(item.term + ': ' + item.tfidf);
});
```

A TfIdf instance can also be serialized and deserialized for save and recall.

```javascript
var tfidf = new TfIdf();
tfidf.addDocument('document one', 'un');
tfidf.addDocument('document Two', 'deux');
var s = JSON.stringify(tfidf);
// save "s" to disk, database or otherwise

// assuming you pulled "s" back out of storage.
var tfidf = new TfIdf(JSON.parse(s));
```

## Tries

Tries are a very efficient data structure used for prefix-based searches.
Natural comes packaged with a basic Trie implementation which can support match collection along a path,
existence search and prefix search.

### Building The Trie

You need to add words to build up the dictionary of the Trie, this is an example of basic Trie set up:

```javascript
var natural = require('natural');
var Trie = natural.Trie;

var trie = new Trie();

// Add one string at a time
trie.addString("test");

// Or add many strings
trie.addStrings(["string1", "string2", "string3"]);
```

### Searching

#### Contains

The most basic operation on a Trie is to see if a search string is marked as a word in the Trie.

```javascript
console.log(trie.contains("test")); // true
console.log(trie.contains("asdf")); // false
```

### Find Prefix

The find prefix search will find the longest prefix that is identified as a word in the trie.
It will also return the remaining portion of the string which it was not able to match.

```javascript
console.log(trie.findPrefix("tester"));     // ['test', 'er']
console.log(trie.findPrefix("string4"));    // [null, '4']
console.log(trie.findPrefix("string3"));    // ['string3', '']
```

### All Prefixes on Path

This search will return all prefix matches along the search string path.

```javascript
trie.addString("tes");
trie.addString("test");
console.log(trie.findMatchesOnPath("tester")); // ['tes', 'test'];
```

### All Keys with Prefix

This search will return all of the words in the Trie with the given prefix, or [ ] if not found.

```javascript
console.log(trie.keysWithPrefix("string")); // ["string1", "string2", "string3"]
```

### Case-Sensitivity

By default the trie is case-sensitive, you can use it in case-_in_sensitive mode by passing `false`
to the Trie constructor.

```javascript
trie.contains("TEST"); // false

var ciTrie = new Trie(false);
ciTrie.addString("test");
ciTrie.contains("TEsT"); // true
```
In the case of the searches which return strings, all strings returned will be in lower case if you are in case-_in_sensitive mode.

## EdgeWeightedDigraph

EdgeWeightedDigraph represents a digraph, you can add an edge, get the number vertexes, edges, get all edges and use toString to print the Digraph.

initialize a digraph:

```javascript
var EdgeWeightedDigraph = natural.EdgeWeightedDigraph;
var digraph = new EdgeWeightedDigraph();
digraph.add(5,4,0.35);
digraph.add(5,1,0.32);
digraph.add(1,3,0.29);
digraph.add(6,2,0.40);
digraph.add(3,6,0.52);
digraph.add(6,4,0.93);
```
the api used is: add(from, to, weight).

get the number of vertexes:

```javascript
console.log(digraph.v());
```
you will get 7.

get the number of edges:

```javascript
console.log(digraph.e());
```
you will get 6.



## ShortestPathTree

ShortestPathTree represents a data type for solving the single-source shortest paths problem in
edge-weighted directed acyclic graphs (DAGs).
The edge weights can be positive, negative, or zero. There are three APIs:
getDistTo(vertex),
hasPathTo(vertex),
pathTo(vertex).

```javascript
var ShortestPathTree = natural.ShortestPathTree;
var spt = new ShortestPathTree(digraph, 5);
```
digraph is an instance of EdgeWeightedDigraph, the second param is the start vertex of DAG.

### getDistTo(vertex)

Will return the dist to vertex.

```javascript
console.log(spt.getDistTo(4));
```
the output will be: 0.35

### pathTo(vertex)

Will return the shortest path:

```javascript
console.log(spt.pathTo(4));
```

output will be:

```javascript
[5, 4]
```

## LongestPathTree

LongestPathTree represents a data type for solving the single-source longest paths problem in
edge-weighted directed acyclic graphs (DAGs).
The edge weights can be positive, negative, or zero. There are three APIs same as ShortestPathTree:
getDistTo(vertex),
hasPathTo(vertex),
pathTo(vertex).

```javascript
var LongestPathTree = natural.LongestPathTree;
var lpt = new LongestPathTree(digraph, 5);
```
digraph is an instance of EdgeWeightedDigraph, the second param is the start vertex of DAG.

### getDistTo(vertex)

Will return the dist to vertex.

```javascript
console.log(lpt.getDistTo(4));
```
the output will be: 2.06

### pathTo(vertex)

Will return the longest path:

```javascript
console.log(lpt.pathTo(4));
```

output will be:

```javascript
[5, 1, 3, 6, 4]
```

## WordNet

One of the newest and most experimental features in natural is WordNet integration. Here's an
example of using natural to look up definitions of the word node. To use the WordNet module,
first install the WordNet database files using [wordnet-db](https://github.com/moos/wordnet-db):

    npm install wordnet-db

Keep in mind that the WordNet integration is to be considered experimental at this point,
and not production-ready. The API is also subject to change.  For an implementation with vastly increased performance, as well as a command-line interface, see [wordpos](https://github.com/moos/wordpos).

Here's an example of looking up definitions for the word "node".

```javascript
var wordnet = new natural.WordNet();

wordnet.lookup('node', function(results) {
    results.forEach(function(result) {
        console.log('------------------------------------');
        console.log(result.synsetOffset);
        console.log(result.pos);
        console.log(result.lemma);
        console.log(result.synonyms);
        console.log(result.pos);
        console.log(result.gloss);
    });
});
```

Given a synset offset and a part of speech, a definition can be looked up directly.

```javascript
var wordnet = new natural.WordNet();

wordnet.get(4424418, 'n', function(result) {
    console.log('------------------------------------');
    console.log(result.lemma);
    console.log(result.pos);
    console.log(result.gloss);
    console.log(result.synonyms);
});
```

If you have _manually_ downloaded the WordNet database files, you can pass the folder to the constructor:

```javascript
var wordnet = new natural.WordNet('/my/wordnet/dict');
```

As of v0.1.11, WordNet data files are no longer automatically downloaded.

Princeton University "About WordNet." WordNet. Princeton University. 2010. <http://wordnet.princeton.edu>

## Spellcheck

A probabilistic spellchecker based on http://norvig.com/spell-correct.html

This is best constructed with an array of tokens from a corpus, but a simple list of words from a dictionary will work.

```javascript
var corpus = ['something', 'soothing'];
var spellcheck = new natural.Spellcheck(corpus);
```

It uses the trie datastructure for fast boolean lookup of a word

```javascript
spellcheck.isCorrect('cat'); // false
```

It suggests corrections (sorted by probability in descending order) that are up to a maximum edit distance away from the input word. According to Norvig, a max distance of 1 will cover 80% to 95% of spelling mistakes. After a distance of 2, it becomes very slow.

```javascript
spellcheck.getCorrections('soemthing', 1); // ['something']
spellcheck.getCorrections('soemthing', 2); // ['something', 'soothing']
```


## POS Tagger

This is a part-of-speech tagger based on Eric Brill's transformational
algorithm. It needs a lexicon and a set of transformation rules.


### Usage

First a lexicon is created. First parameter is language (<code>EN</code> for English and <code>DU</code> for Dutch), second is default category.
Optionally, a third parameter can be supplied that is the default category for capitalised words.
```javascript
var natural = require("natural");
const language = "EN"
const defaultCategory = 'N';
const defaultCategoryCapitalized = 'NNP';

var lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
var ruleSet = new natural.RuleSet('EN');
var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
```

Then a ruleset is created, as follows. Parameter is the language.
```javascript
var ruleSet = new natural.RuleSet('EN');
```
Now a tagger can be created by passing lexicon and ruleset:
```javascript
var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
var sentence = ["I", "see", "the", "man", "with", "the", "telescope"];
console.log(tagger.tag(sentence));
```

This outputs the following:
```javascript
Sentence {
  taggedWords:
   [ { token: 'I', tag: 'NN' },
     { token: 'see', tag: 'VB' },
     { token: 'the', tag: 'DT' },
     { token: 'man', tag: 'NN' },
     { token: 'with', tag: 'IN' },
     { token: 'the', tag: 'DT' },
     { token: 'telescope', tag: 'NN' } ] }
```

### Lexicon
The lexicon is a JSON file that has the following structure:
```javascript
{
  "word1": ["cat1"],
  "word2": ["cat2", "cat3"],
  ...
}
```

Words may have multiple categories in the lexicon file. The tagger uses only
the first category specified.


### Specifying transformation rules
Transformation rules are specified a JSON file as follows:
```javascript
{
  "rules": [
    "OLD_CAT NEW_CAT PREDICATE PARAMETER",
    ...
  ]
}
```
This particular means that if the category of the current position is OLD_CAT and the predicate is true, the category is replaced by NEW_CAT. The predicate
may use the parameter in different ways: sometimes the parameter is used for
specifying the outcome of the predicate:
```
NN CD CURRENT-WORD-IS-NUMBER YES
```
This means that if the outcome of predicate CURRENT-WORD-IS-NUMBER is YES, the
category is replaced by <code>CD</code>.
The parameter can also be used to check the category of a word in the sentence:
```
VBD NN PREV-TAG DT
```
Here the category of the previous word must be <code>DT</code> for the rule to be applied.


### Algorithm
The tagger applies transformation rules that may change the category of words. The input sentence is a Sentence object with tagged words. The tagged sentence is processed from left to right. At each step all rules are applied once; rules are applied in the order in which they are specified. Algorithm:
```javascript
Brill_POS_Tagger.prototype.applyRules = function(sentence) {
  for (var i = 0, size = sentence.taggedWords.length; i < size; i++) {
    this.ruleSet.getRules().forEach(function(rule) {
      rule.apply(sentence, i);
    });
  }
  return sentence;
};
```
The output is a Sentence object just like the input sentence.


### Adding a predicate
Predicates are defined in module <code>lib/RuleTemplates.js</code>. In that file
predicate names are mapped to metadata for generaring transformation rules. The following properties must be supplied:
* Name of the predicate
* A function that evaluates the predicate (should return a boolean)
* A window <code>[i, j]</code> that defines the span of the predicate in the
sentence relative to the current position
* The number of parameter the predicate needs: 0, 1 or 2
* If relevant, a function for parameter 1 that returns its possible values
at the current position in the sentence (for generating rules in training)
* If relevant, a function for parameter 2 that returns its possible values
at the current position in the sentence (for training)

A typical entry for a rule templates looks like this:
```javascript
"NEXT-TAG": {
    // maps to the predicate function
    "function": next_tag_is,
    // Minimum required window before or after current position to be a relevant predicate
    "window": [0, 1],
    // The number of parameters the predicate takes
    "nrParameters": 1,
    // Function that returns relevant values for parameter 1
    "parameter1Values": nextTagParameterValues
  }
```
A predicate function accepts a Sentence object, the current position in the
sentence that should be tagged, and the outcome(s) of the predicate.
An example of a predicate that checks the category of the current word:
```javascript
function next_tag_is(sentence, i, parameter) {
  if (i < sentence.taggedWords.length - 1) {
    return(sentence.taggedWords[i + 1][1] === parameter);
  }
  else {
    return(false);
  }
}
```

A values function for a parameter returns an array all possible parameter
values given a location in a tagged sentence.
```javascript
function nextTagParameterValues(sentence, i) {
  if (i < sentence.length - 1) {
    return [sentence[i + 1].tag];
  }
  else {
    return [];
  }
}
```

### Training
The trainer allows to learn a new set of transformation rules from a corpus.
It takes as input a tagged corpus and a set of rule templates. The algorithm
generates positive rules (rules that apply at some location in the corpus)
from the templates and iteratively extends and optimises the rule set.

First, a corpus should be loaded. Currently, the format of Brown corpus is supported. Then a lexicon can be created from the corpus. The lexicon is needed for tagging the sentences before the learning algorithm is applied.
```javascript
var natural = require(natural);
const JSON_FLAG = 2;

var brownCorpus = require('../lib/natural/brill_pos_tagger/lib/Corpus');
var corpus = new Corpus(brownCorpus, JSON_FLAG, natural.Sentence);
var lexicon = corpus.buildLexicon();
```
The next step is to create a set of rule templates from which the learning
algorithm can generate transformation rules. Rule templates are defined in
<code>PredicateMapping.js</code>.
```javascript
var templateNames = [
  "NEXT-TAG",
  "NEXT-WORD-IS-CAP",
  "PREV-1-OR-2-OR-3-TAG",
  "...",
];
var templates = templateNames.map(function(name) {
  return new natural.RuleTemplate(name);
});
```
Using lexicon and rule templates we can now start the trainer as follows.
```javascript
var trainer = new natural.BrillPOSTrainer(/* optional threshold */);
var ruleSet = trainer.train(corpus, templates, lexicon);
```
A threshold value can be passed to constructor. Transformation rules with
a score below the threshold are removed after training.
The train method returns a set of transformation rules that can be used to
create a POS tagger as usual. Also you can output the rule set in the right
format for later usage.
```javascript
console.log(ruleSet.prettyPrint());
```


### Testing
Now we can apply the lexicon and rule set to a test set.
```javascript
var tester = new natural.BrillPOSTester();
var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
var scores = tester.test(corpora[1], tagger);
```
The test method returns an array of two percentages: first percentage is the ratio of right tags after tagging with the lexicon; second percentage is the ratio of right tags after applying the transformation rules.
```javascript
console.log("Test score lexicon " + scores[0] + "%");
console.log("Test score after applying rules " + scores[1] + "%");
```


## Development

### Contributing

When developing, please:

+ Write unit tests for jasmine
+ Make sure your unit tests pass
+ Do not use the file system <code>fs</code>. If you need to read files, use JSON and <code>require</code>.

The current configuration of the unit tests requires the following environment variable to be set:
```javascript
    export NODE_PATH=.
````

### CD/CD

The repository uses Github Actions for testing and publishing. Testing is done with the four most recent releases of Nodejs. The natural package is automatically published to NPM when a release is created.

Github workflows can be found at `./.github/workflows`.

### Using the library in a browser

The package can be used in the browser using Webpack. It is tested using Webpack, Gulp and Jasmine. The test suite is run using the command: `npm run test_browser`. The server is at http://localhost:8888. You should  uncheck "run tests in random order" in the browser to make it work. There are some tests that are sensitive to the order in which tests are run.

## Acknowledgements and References
* Part of speech tagger by Percy Wegmann, https://code.google.com/p/jspos/
* Node.js version of jspos: https://github.com/neopunisher/pos-js
* A simple rule-based part of speech tagger, Eric Brill, Published in: Proceeding ANLC '92 Proceedings of the third conference on Applied natural language processing, Pages 152-155. http://dl.acm.org/citation.cfm?id=974526
* Exploring the Statistical Derivation of Transformational Rule Sequences for Part-of-Speech Tagging, Lance A. Ramshaw and Mitchell P. Marcus. http://acl-arc.comp.nus.edu.sg/archives/acl-arc-090501d4/data/pdf/anthology-PDF/W/W94/W94-0111.pdf
* Brown Corpus: https://en.wikipedia.org/wiki/Brown_Corpus
* Carry stemmer is a contribution by Johan Maupetit.
* PEGjs: Parser Generator for JavaScript, https://pegjs.org/

License
-------
Copyright (c) 2011, 2012 Chris Umbel, Rob Ellis, Russell Mull

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

WordNet License
---------------
This license is available as the file LICENSE in any downloaded version of WordNet.
WordNet 3.0 license: (Download)

WordNet Release 3.0 This software and database is being provided to you, the LICENSEE, by Princeton University under the following license. By obtaining, using and/or copying this software and database, you agree that you have read, understood, and will comply with these terms and conditions.: Permission to use, copy, modify and distribute this software and database and its documentation for any purpose and without fee or royalty is hereby granted, provided that you agree to comply with the following copyright notice and statements, including the disclaimer, and that the same appear on ALL copies of the software, database and documentation, including modifications that you make for internal use or for distribution. WordNet 3.0 Copyright 2006 by Princeton University. All rights reserved. THIS SOFTWARE AND DATABASE IS PROVIDED "AS IS" AND PRINCETON UNIVERSITY MAKES NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED. BY WAY OF EXAMPLE, BUT NOT LIMITATION, PRINCETON UNIVERSITY MAKES NO REPRESENTATIONS OR WARRANTIES OF MERCHANT- ABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE LICENSED SOFTWARE, DATABASE OR DOCUMENTATION WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS. The name of Princeton University or Princeton may not be used in advertising or publicity pertaining to distribution of the software and/or database. Title to copyright in this software, database and any associated documentation shall at all times remain with Princeton University and LICENSEE agrees to preserve same.
