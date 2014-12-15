natural
=======

[![Build Status](https://travis-ci.org/NaturalNode/natural.png?branch=master)](https://travis-ci.org/NaturalNode/natural)

"Natural" is a general natural language facility for nodejs. Tokenizing,
stemming, classification, phonetics, tf-idf, WordNet, string similarity,
and some inflections are currently supported.

It's still in the early stages, so we're very interested in bug reports,
contributions and the like.

Note that many algorithms from Rob Ellis's [node-nltools](https://github.com/NaturalNode/node-nltools) are
being merged into this project and will be maintained from here onward.

At the moment, most of the algorithms are English-specific, but in the long-term, some diversity
will be in order. Thanks to Polyakov Vladimir, Russian stemming has been added!, Thanks to David Przybilla, Spanish stemming has been added!.

Aside from this README, the only documentation is [this DZone article](http://www.dzone.com/links/r/using_natural_a_nlp_module_for_nodejs.html) and [here on my blog](http://www.chrisumbel.com/article/node_js_natural_language_porter_stemmer_lancaster_bayes_naive_metaphone_soundex), which is a bit older.

Installation
------------

If you're just looking to use natural without your own node application,
you can install via NPM like so:

    npm install natural

If you're interested in contributing to natural, or just hacking on it, then by all
means fork away!

Tokenizers
----------

Word, Regexp, and [Treebank tokenizers](http://www.cis.upenn.edu/~treebank/tokenization.html) are provided for breaking text up into
arrays of tokens:

```javascript
var natural = require('natural'),
  tokenizer = new natural.WordTokenizer();
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
```

String Distance
----------------------
Natural provides an implementation of the [Jaro–Winkler](http://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance) string distance measuring algorithm.
This will return a number between 0 and 1 which tells how closely the strings match (0 = not at all, 1 = exact match):

```javascript
var natural = require('natural');
console.log(natural.JaroWinklerDistance("dixon","dicksonx"))
console.log(natural.JaroWinklerDistance('not', 'same'));
```

Output:

```javascript
0.7466666666666666
0
```

Natural also offers support for Levenshtein distances:

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

And Dice's co-efficient:

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

Stemmers
--------

Currently stemming is supported via the [Porter](http://tartarus.org/martin/PorterStemmer/index.html) and [Lancaster](http://www.comp.lancs.ac.uk/computing/research/stemming/) (Paice/Husk) algorithms.

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

`attach()` patches `stem()` and `tokenizeAndStem()` to String as a shortcut to
`PorterStemmer.stem(token)`. `tokenizeAndStem()` breaks text up into single words
and returns an array of stemmed tokens.

```javascript
natural.PorterStemmer.attach();
console.log("i am waking up to the sounds of chainsaws".tokenizeAndStem());
console.log("chainsaws".stem());
```

the same thing can be done with a Lancaster stemmer:

```javascript
natural.LancasterStemmer.attach();
console.log("i am waking up to the sounds of chainsaws".tokenizeAndStem());
console.log("chainsaws".stem());
```

Classifiers
----------------------

Two classifiers are currently supported, [Naive Bayes](http://en.wikipedia.org/wiki/Naive_Bayes_classifier) and [logistic regression](http://en.wikipedia.org/wiki/Logistic_regression).
The following examples use the BayesClassifier class, but the 
LogisticRegressionClassifier class could be substituted instead.

```javascript
var natural = require('natural'),
  classifier = new natural.BayesClassifier();
```

You can train the classifier on sample text. It will use reasonable defaults to
tokenize and stem the text.

```javascript
classifier.addDocument('i am long qqqq', 'buy');
classifier.addDocument('buy the q''s', 'buy');
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
[ { label: 'sell', value: 0.39999999999999997 },
  { label: 'buy', value: 0.19999999999999998 } ]
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

    classifier.events.on('trainedWithDocument', function (obj) {
       console.log(obj);
       /* {
       *   total: 23 // There are 23 total documents being trained against
       *   index: 12 // The index/number of the document that's just been trained against
       *   doc: {...} // The document that has just been indexed
       */ }
    });

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

Phonetics
---------

Phonetic matching (sounds-like) matching can be done with the [SoundEx](http://en.wikipedia.org/wiki/Soundex),
[Metaphone](http://en.wikipedia.org/wiki/Metaphone) or [DoubleMetaphone](http://en.wikipedia.org/wiki/Metaphone#Double_Metaphone) algorithms

```javascript
var natural = require('natural'),
    metaphone = natural.Metaphone, soundEx = natural.SoundEx;

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
var natural = require('natural'),
  dm = natural.DoubleMetaphone;

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

Inflectors
----------

### Nouns

Nouns can be pluralized/singularized with a `NounInflector`:

```javascript
var natural = require('natural'),
nounInflector = new natural.NounInflector();
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


N-Grams
-------

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

tf-idf
-----

[Term Frequency–Inverse Document Frequency (tf-idf)](http://en.wikipedia.org/wiki/Tf%E2%80%93idf) is implemented to determine how important a word (or words) is to a 
document relative to a corpus. The following example will add four documents to 
a corpus and determine the weight of the word "node" and then the weight of the 
word "ruby" in each document.

```javascript
var natural = require('natural'),
    TfIdf = natural.TfIdf,
    tfidf = new TfIdf();

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
document #0 is 1.4469189829363254
document #1 is 0
document #2 is 1.4469189829363254
document #3 is 2.8938379658726507
ruby --------------------------------
document #0 is 0
document #1 is 1.466337068793427
document #2 is 1.466337068793427
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
var natural = require('natural'),
    TfIdf = natural.TfIdf,
    tfidf = new TfIdf();

tfidf.addDocument('this document is about node.');
tfidf.addDocument('this document is about ruby.');
tfidf.addDocument('this document is about ruby and node.');

tfidf.tfidfs('node ruby', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});
```

The above outputs:

```
document #0 is 1.2039728043259361
document #1 is 1.2039728043259361
document #2 is 2.4079456086518722
```

The examples above all use strings, which case natural to automatically tokenize the input.
If you wish to perform your own tokenization or other kinds of processing, you
can do so, then pass in the resultant arrays later. This approach allows you to bypass natural's 
default preprocessing.

```javascript
var natural = require('natural'),
    TfIdf = natural.TfIdf,
    tfidf = new TfIdf();

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

Tries
-----

Tries are a very efficient data structure used for prefix-based searches. 
Natural comes packaged with a basic Trie implementation which can support match collection along a path,
existence search and prefix search.

### Building The Trie

You need to add words to build up the dictionary of the Trie, this is an example of basic Trie set up:

```javascript
var natural = require('natural'),
    Trie = natural.Trie;

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
trie.addString("est");
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

EdgeWeightedDigraph
-------------------
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
you will get 5.

get the number of edges:

```javascript
console.log(digraph.e());
```
you will get 5.



ShortestPathTree
----------------

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

### hasDistTo(vertex)

```javascript
console.log(spt.hasDistTo(4));
console.log(spt.hasDistTo(5));
```

output will be:

```javascript
true
false
```

### pathTo(vertex)
this will return a shortest path:

```javascript
console.log(spt.pathTo(4));
```

output will be:

```javascript
[5, 4]
```

LongestPathTree
----------------

LongestPathTree represents a data type for solving the single-source shortest paths problem in
edge-weighted directed acyclic graphs (DAGs).
The edge weights can be positive, negative, or zero. There are three APIs same as ShortestPathTree:
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
the output will be: 2.06

### hasDistTo(vertex)

```javascript
console.log(spt.hasDistTo(4));
console.log(spt.hasDistTo(5));
```

output will be:

```javascript
true
false
```

### pathTo(vertex)
this will return a shortest path:

```javascript
console.log(spt.pathTo(4));
```

output will be:

```javascript
[5, 1, 3, 6, 4]
```

WordNet
-------

One of the newest and most experimental features in natural is WordNet integration. Here's an
example of using natural to look up definitions of the word node. To use the WordNet module,
first install the WordNet database files using the [WNdb module](https://github.com/moos/WNdb):

    npm install WNdb

(For node < v0.6, please use 'npm install WNdb@3.0.0')

Keep in mind that the WordNet integration is to be considered experimental at this point,
and not production-ready. The API is also subject to change.

Here's an example of looking up definitions for the word, "node".

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

Spellcheck
------------
A probabilistic spellchecker based on http://norvig.com/spell-correct.html

This is best constructed with an array of tokens from a corpus, but a simple list of words from a dictionary will work. 

```javascript
var corpus = ['something', 'soothing'];
var spellcheck = new Spellcheck(corpus);
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


Development
-----------
When developing, please:

+ Write unit tests
+ Make sure your unit tests pass

The current configuration of the unit tests requires the following environment variable to be set:

    export NODE_PATH=.


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
