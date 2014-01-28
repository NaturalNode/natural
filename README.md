natural
=======

[![Build Status](https://travis-ci.org/Joe8Bit/natural.png?branch=travis-setup)](https://travis-ci.org/Joe8Bit/natural)

"Natural" is a general natural language facility for nodejs. Tokenizing,
stemming, classification, phonetics, tf-idf, WordNet, string similarity,
and some inflection are currently supported.

It's still in the early stages, and am very interested in bug reports,
contributions and the like.

Note that many algorithms from Rob Ellis's [node-nltools](https://github.com/NaturalNode/node-nltools) are
being merged in to this project and will be maintained here going forward.

At the moment most algorithms are English-specific but long-term some diversity
is in order.

Aside from this README the only current documentation is [here on my blog](http://www.chrisumbel.com/article/node_js_natural_language_porter_stemmer_lancaster_bayes_naive_metaphone_soundex).

Installation
------------

If you're just looking to consume natural without your own node application
please install the NPM

    npm install natural
    
If you're interested in contributing to natural or just hacking it then by all
means fork away!
    
Tokenizers
----------

Word, Regexp and [Treebank tokenizers](http://www.cis.upenn.edu/~treebank/tokenization.html) are provided for breaking text up into
arrays of tokens.

    var natural = require('natural'),
      tokenizer = new natural.WordTokenizer();
    console.log(tokenizer.tokenize("your dog has flees."));
    // [ 'your', 'dog', 'has', 'flees' ]
    
The other tokenizers follow a similar pattern    

    tokenizer = new natural.TreebankWordTokenizer();
    console.log(tokenizer.tokenize("my dog hasn't any flees."));
    // [ 'my', 'dog', 'has', 'n\'t', 'any', 'flees', '.' ]
    
    tokenizer = new natural.RegexpTokenizer({pattern: /\-/});
    console.log(tokenizer.tokenize("flee-dog"));
    // [ 'flee', 'dog' ]

String Similiarity
---------------

The similiarity between two strings can be accomplished with a [Jaro–Winkler](http://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance) distance.

  var jaroWinklerDistance = require('natural').JaroWinklerDistance;

  console.log('apple', 'applet'); // outputs 0.9666666666666667
  console.log(d('not', 'same')); // output NaN
    
Stemmers
--------

Currently stemming is supported via the [Porter](http://tartarus.org/martin/PorterStemmer/index.html) and [Lancaster](http://www.comp.lancs.ac.uk/computing/research/stemming/) (Paice/Husk)
algorithms.

    var natural = require('natural');
    
this example uses a porter stemmer. "word" is returned.

    console.log(natural.PorterStemmer.stem("words")); // stem a single word
    
attach() patches stem() and tokenizeAndStem() to String as a shortcut to
PorterStemmer.stem(token). tokenizeAndStem() breaks text up into single words
and returns an array of stemmed tokens.

    natural.PorterStemmer.attach();
    console.log("i am waking up to the sounds of chainsaws".tokenizeAndStem());
    console.log("chainsaws".stem());

the same thing can be done with a lancaster stemmer

    natural.LancasterStemmer.attach();
    console.log("i am waking up to the sounds of chainsaws".tokenizeAndStem());
    console.log("chainsaws".stem());

Classifiers
----------------------

Two classifiers are currently supported, [Naive Bayes](http://en.wikipedia.org/wiki/Naive_Bayes_classifier) and [logistic regression](http://en.wikipedia.org/wiki/Logistic_regression).
The following examples use the BayesClassifier class, but the 
LogisticRegressionClassifier class could be substituted instead.

    var natural = require('natural'), 
    	classifier = new natural.BayesClassifier();

you can train the classifier on sample text. it will use reasonable defaults to
tokenize and stem the text.
   
    classifier.addDocument('i am long qqqq', 'buy');
    classifier.addDocument('buy the q's', 'buy');
    classifier.addDocument('short gold', 'sell');
    classifier.addDocument('sell gold', 'sell');

    classifier.train();

outputs "sell"

    console.log(classifier.classify('i am short silver'));

outputs "buy"

    console.log(classifier.classify('i am long copper'));

you have access to the set of matched classes and the associated value from the classifier. 

outputs:

    [ { label: 'sell', value: 0.39999999999999997 },
      { label: 'buy', value: 0.19999999999999998 } ]     

from this:

    console.log(classifier.getClassifications('i am long copper'));


the classifier can also be trained on and classify arrays of tokens, strings, or
any mixture. arrays let you use entirely custom data with  your own
tokenization/stemming if any at all.

    classifier.addDocument(['sell', 'gold'], 'sell');

A classifier can also be persisted and recalled so you can reuse a training

    classifier.save('classifier.json', function(err, classifier) {
        // the classifier is saved to the classifier.json file!
    });
    
and to recall from the classifier.json saved above:

    natural.BayesClassifier.load('classifier.json', null, function(err, classifier) {
        console.log(classifier.classify('long SUNW'));
        console.log(classifier.classify('short SUNW'));
    });

A classifier can also be serialized and deserialized as such

    var classifier = new natural.BayesClassifier();
    classifier.addDocument(['sell', 'gold'], 'sell');
    classifier.addDocument(['buy', 'silver'], 'buy');

    // serialize
    var raw = JSON.stringify(classifier);
    // deserialize
    var restoredClassifier = natural.BayesClassifier.restore(raw);
    console.log(restoredClassifier.classify('i should sell that'));

Phonetics
---------

Phonetic matching (sounds-like) matching can be done with the [SoundEx](http://en.wikipedia.org/wiki/Soundex),
[Metaphone](http://en.wikipedia.org/wiki/Metaphone) or [DoubleMetaphone](http://en.wikipedia.org/wiki/Metaphone#Double_Metaphone) algorithms

    var natural = require('natural'),
        metaphone = natural.Metaphone, soundEx = natural.SoundEx;

    var wordA = 'phonetics';
    var wordB = 'fonetix';

test the two words to see if they sound alike

    if(metaphone.compare(wordA, wordB))
        console.log('they sound alike!');
        
the raw phonetics are obtained with process()

    console.log(metaphone.process('phonetics'));

a maximum code length can be supplied

    console.log(metaphone.process('phonetics', 3));    

DoubleMetaphone deals with two encodings returned in an array. This
feature is experimental and subject to change.

    var natural = require('natural'),
      dm = natural.DoubleMetaphone;
    
    var encodings = dm.process('Matrix');
    console.log(encodings[0]);
    console.log(encodings[1]);

attaching will patch String with useful methods

    metaphone.attach();

soundsLike is essentially a shortcut to Metaphone.compare

    if(wordA.soundsLike(wordB))
        console.log('they sound alike!');
        
the raw phonetics are obtained with phonetics()

    console.log('phonetics'.phonetics());   

full text strings can be tokenized into arrays of phonetics similar to stemmers

    console.log('phonetics rock'.tokenizeAndPhoneticize());

same module operations apply with SoundEx

    if(soundEx.compare(wordA, wordB))
        console.log('they sound alike!');

the same String patches apply with soundex

    soundEx.attach();

    if(wordA.soundsLike(wordB))
        console.log('they sound alike!');
        
    console.log('phonetics'.phonetics());
    
    
Inflectors
----------

### Nouns

Nouns can be pluralized/singularized with a NounInflector 

    var natural = require('natural'),
    nounInflector = new natural.NounInflector();
    
to pluralize a word (outputs "radii")

    console.log(nounInflector.pluralize('radius'));

to singularize a word (outputs "beer")

    console.log(nounInflector.singularize('beers'));

Like many of the other features String can be patched to perform the operations
directly. The "Noun" suffix to the methods is necessary as verbs will be
supported in the future.

    nounInflector.attach();
    console.log('radius'.pluralizeNoun());
    console.log('beers'.singularizeNoun());   

### Numbers

Numbers can be counted with a CountInflector

    var countInflector = natural.CountInflector;

outputs "1st"

    console.log(countInflector.nth(1));

outputs "111th"

    console.log(countInflector.nth(111));

### Present Tense Verbs

Present Tense Verbs can be pluralized/singularized with a PresentVerbInflector.
This feature is still experimental as of 0.0.42 so use with caution and please
provide feedback.

    var verbInflector = new natural.PresentVerbInflector();

outputs "becomes"

    console.log(verbInflector.singularize('become'));

outputs "become"

    console.log(verbInflector.pluralize('becomes'));

Like many other natural modules attach() can be used to patch strings with
handy methods.

    verbInflector.attach();
    console.log('walk'.singularizePresentVerb());
    console.log('walks'.pluralizePresentVerb());


N-Grams
-------

n-grams can be obtained for either arrays or strings (which will be tokenized
for you)

    var NGrams = natural.NGrams;
    
### bigrams    
    
    console.log(NGrams.bigrams('some words here'));
    console.log(NGrams.bigrams(['some',  'words',  'here']));
    
both of which output [ [ 'some', 'words' ], [ 'words', 'here' ] ]    
    
### trigrams    
    
    console.log(NGrams.trigrams('some other words here'));
    console.log(NGrams.trigrams(['some',  'other', 'words',  'here']));

both of which output [ [ 'some', 'other', 'words' ],
  [ 'other', 'words', 'here' ] ]

### arbitrary n-grams

    console.log(NGrams.ngrams('some other words here for you', 4));
    console.log(NGrams.ngrams(['some', 'other', 'words', 'here', 'for',
        'you'], 4));

which outputs [ [ 'some', 'other', 'words', 'here' ],
  [ 'other', 'words', 'here', 'for' ],
  [ 'words', 'here', 'for', 'you' ] ]

tf-idf
-----

[Term Frequency–Inverse Document Frequency (tf-idf)](http://en.wikipedia.org/wiki/Tf%E2%80%93idf) is implemented to determine how important a word (or words) is to a 
document relative to a corpus. The following example will add four documents to 
a corpus and determine the weight of the word "node" and then the weight of the 
word "ruby" in each document.

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

which outputs
    
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

Of course you can measure a single document. The following example measures 
the term "node" in the first and second documents.
    
    console.log(tfidf.tfidf('node', 0));
    console.log(tfidf.tfidf('node', 1));

A TfIdf instance can also load documents from files on disk.

    var tfidf = new TfIdf();
    tfidf.addFileSync('data_files/one.txt');
    tfidf.addFileSync('data_files/two.txt');

Multiple terms can be measured as well with their weights being added into 
a single measure value. The following example determines that the last document
is the most relevent to the words "node" and "ruby".

    var natural = require('natural'),
        TfIdf = natural.TfIdf,
        tfidf = new TfIdf();
    
    tfidf.addDocument('this document is about node.');
    tfidf.addDocument('this document is about ruby.');
    tfidf.addDocument('this document is about ruby and node.');
    
    tfidf.tfidfs('node ruby', function(i, measure) {
        console.log('document #' + i + ' is ' + measure);
    });

which outputs

    document #0 is 1.2039728043259361
    document #1 is 1.2039728043259361
    document #2 is 2.4079456086518722

The examples above all use strings in which case natural will tokenize the input.
If you wish to perform your own tokenization or other kinds of processing you 
can do so and then pass in the resultant arrays. That will cause natural to 
bypass its own preprocessing.

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

It's possible to retrieve a list of all terms in a document sorted by their 
importance.

    tfidf.listTerms(0 /*document index*/).forEach(function(item) {
        console.log(item.term + ': ' + item.tfidf);
    });

A TfIdf instance can also be serialized and deserialzed for save and recall.

    var tfidf = new TfIdf();
    tfidf.addDocument('document one', 'un');
    tfidf.addDocument('document Two', 'deux');
    var s = JSON.stringify(tfidf);
    // save "s" to disk, database or otherwise

    // assuming you pulled "s" back out of storage. 
    var tfidf = new TfIdf(JSON.parse(s));

WordNet
-------

Natural provides a partial wrapper over the WordNet database. To use it, 
you'll need to download the sqlite version of the database from 
http://sourceforge.net/projects/wnsql/files/ or http://wordnet.naturalnode.com/wordnet30-sqlite-1.0.1.zip and put it somewhere on your system. 
Then, pass in the path to the database when calling the WordNet constructor. 

Keep in mind the WordNet integration is to be considered experimental at this point
and not production ready. The API is also subject to change.

Here's an exmple of looking up definitions for the word, "node".

    var wordnet = new natural.WordNet('./wordnet30.sqlite');

    wordnet.getWord('node', function(word) {
        console.log(word.lemma);
        word.senses.forEach(function(sense) {
            console.log('------------------------------------');
            console.log(sense.definition);
            console.log(sense.pos);
            sense.getSynonyms(function(synonymns) {
                synonymns.forEach(function(synonymn) {
                    console.log("- " + synonymn.lemma);
                });
            });
        });
    });
    
You can also search for multiple words, using '%' as a wildcard. 

    wordnet.findWords("nod%", function(words) {
        words.forEach(function(word) {
            console.log(word.lemma);
        });
    });


Princeton University "About WordNet." WordNet. Princeton University. 2010. <http://wordnet.princeton.edu>

License
-------

Copyright (c) 2011, Chris Umbel, Rob Ellis, Russell Mull

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
