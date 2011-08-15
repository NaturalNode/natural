natural
=======

"Natural" is a general natural language facility for nodejs. Stemming,
classification, phonetics and some inflection are currently supported.

It's still in the VERY (and I mean VERY) early stages, and I'm VERY (yes, again,
VERY) interested in bug reports, contributions and the like.

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
    
Stemmers
--------

Currently stemming is supported via the Porter and Lancaster (Paice/Husk)
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

Naive Bayes Classifier
----------------------

    var natural = require('natural'), 
    	classifier = new natural.BayesClassifier();

you can train the classifier on sample text. it will use reasonable defaults to
tokenize and stem the text.

    classifier.train([{classification: 'buy', text: "i am long qqqq"},
                  {classification: 'buy', text: "buy the q's"},
                  {classification: 'sell', text: "short gold"},
                  {classification: 'sell', text: "sell gold"}
    ]);

outputs "sell"

    console.log(classifier.classify('i am short silver'));

outputs "buy"

    console.log(classifier.classify('i am long copper'));

    classifier = new natural.BayesClassifier();

the classifier can also be trained on and classify arrays of tokens, strings, or
any mixture. arrays let you use entirely custom data with  your own
tokenization/stemming if any at all.

    classifier.train([{classification: 'hockey', text: ['puck', 'shoot']},
                  {classification: 'hockey', text: 'goalies stop pucks.'},
                  {classification: 'stocks', text: ['stop', 'loss']},
                  {classification: 'stocks', text: 'creat a stop order'}
                  ]);

    console.log(classifier.classify('stop out at $100'));
    console.log(classifier.classify('stop the puck, fool!'));
    
    console.log(classifier.classify(['stop', 'out']));
    console.log(classifier.classify(['stop', 'puck', 'fool']));

A classifier can also be persisted and recalled so you can reuse a training.

    var classifier = new natural.BayesClassifier();
    
    classifier.train([{classification: 'buy', text: ['long', 'qqqq']},
                  {classification: 'buy', text: "buy the q's"},
                  {classification: 'sell', text: "short gold"},
                  {classification: 'sell', text: ['sell', 'gold']}
    ]);
        
persist to a file on disk named "classifier.json"

    classifier.save('classifier.json', function(err, classifier) {
        // the classifier is saved to the classifier.json file!
    });
    
and to recall from the classifier.json saved above:

    natural.BayesClassifier.load('classifier.json', function(err, classifier) {
        console.log(classifier.classify('long SUNW'));
        console.log(classifier.classify('short SUNW'));
    });

A classifier can also be serialized and deserialized as such

    var classifier = new natural.BayesClassifier();

    classifier.train([{classification: 'buy', text: ['long', 'qqqq']},
        {classification: 'buy', text: "buy the q's"},
        {classification: 'sell', text: "short gold"},
        {classification: 'sell', text: ['sell', 'gold']}
    ]);

    // serialize
    var raw = JSON.stringify(classifier);
    // deserialize
    var restoredClassifier = natural.BayesClassifier.restore(raw);
    console.log(restoredClassifier.classify('i am short silver'));
    console.log(restoredClassifier.classify('i am long silver'));

Phonetics
---------

Phonetic matching (sounds-like) matching can be done with either the SoundEx or
Metaphone algorithms

    var natural = require('natural'),
        metaphone = natural.Metaphone, soundEx = natural.SoundEx;

    var wordA = 'phonetics';
    var wordB = 'fonetix';

test the two words to see if they sound alike

    if(metaphone.compare(wordA, wordB))
        console.log('they sound alike!');
        
the raw phonetics are obtained with process()

    console.log(metaphone.process('phonetics'));

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

    console.log(soundEx.process('phonetics'));

the same String patches apply with soundex

    soundEx.attach();

    if(wordA.soundsLike(wordB))
        console.log('they sound alike!');
        
    console.log('phonetics'.phonetics());
    
    
Inflectors
----------

Nouns can be pluralized/singularized and numbers counted with inflectors

    var natural = require('natural'),
    nounInflector = new natural.NounInflector;
    
to pluralize a word (outputs "radii")

    console.log(nounInflector.pluralize('radius'));

to singularize a word (outputs "beer")

    console.log(nounInflector.singularize('beers'));

like many of the other features String can be patched to perform the operations
directly. the "Noun" suffix to the methods is necessary as verbs will be
supported in the future.

    nounInflector.attach();
    console.log('radius'.pluralizeNoun());
    console.log('beers'.singularizeNoun());   

counters can also be produced from integers with CountInflector
    
    countInflector = natural.CountInflector;

outputs "1st"

    console.log(countInflector.nth(1));

outputs "111th"

    console.log(countInflector.nth(111));

WordNet
-------

One of the newest and most experimental features is WordNet integration. Here's an
example of using natural to look up definitions of the word node. The parameter in
the WordNet constructor is the local directory that will store the WordNet 
database files. If the database files are not present in the specified directories
natural will download them for you.

Keep in mind the WordNet integration is to be considered experimental at this point
and not production ready.

    var wordnet = new natural.WordNet('.');

    wordnet.lookup('node', function(results) {
        results.forEach(function(result) {
            console.log('------------------------------------');
            console.log(result.lemma);
            console.log(result.pos);
            console.log(result.gloss);
        });
    });

You can also lookup synonyms for all meanings of a word.

    var wordnet = new natural.WordNet('.');

    wordnet.lookupSynonyms('device', function(results) {
        results.forEach(function(result) {
            console.log('------------------------------------');
            console.log(result.lemma);
            console.log(result.pos);
            console.log(result.gloss);
        });
    });

It's also possible to lookup synonyms for a single meaning.

    var wordnet = new natural.WordNet('.');

    wordnet.lookup('entity', function(results) {
        wordnet.getSynonyms(results[0].synsetOffset, results[0].pos, function(results) {
            results.forEach(function(result) {
                console.log('------------------------------------');
                console.log(result.lemma);
                console.log(result.pos);
                console.log(result.gloss);
            });
        });
    });

Princeton University "About WordNet." WordNet. Princeton University. 2010. <http://wordnet.princeton.edu>

License
-------

Copyright (c) 2011, Chris Umbel

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