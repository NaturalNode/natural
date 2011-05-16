natural
=======

General natural language facilities for nodejs. Stemming, classification and
phonetics are currently supported.

Stemmers
--------

Currently stemming is supported via the Porter and Lancaster (Paice/Husk)
algorithms.

    var natural = require('natural');
    
    // this example uses a porter stemmer.
    console.log(natural.PorterStemmer.stem("words")); // stem a single word
    
    // attach() patches stem() and tokenizeAndStem() to String as a shortcut to 
    // PorterStemmer.stem(token)
    natural.PorterStemmer.attach();
    console.log("i am waking up to the sounds of chainsaws".tokenizeAndStem());
    console.log("chainsaws".stem());

    // same thing can be done with a lancaster stemmer
    natural.LancasterStemmer.attach();
    console.log("i am waking up to the sounds of chainsaws".tokenizeAndStem());
    console.log("chainsaws".stem());


Bayes Naive Classifier
----------------------

    var natural = require('natural'), 
    	classifier = new natural.BayesClassifier();

    classifier.train([{classification: 'buy', text: "i am long qqqq"},
                  {classification: 'buy', text: "buy the q's"},
                  {classification: 'sell', text: "short gold"},
                  {classification: 'sell', text: "sell gold"}
    ]);

    // sell
    console.log(classifier.classify('i am short silver'));

    // buy
    console.log(classifier.classify('i am long copper'));

Metaphone Phonetics
-------------------

    var natural = require('natural'), metaphone = natural.Metaphone;

    var wordA = 'phonetics';
    var wordB = 'fonetix';

    // test the two words to see if they sound alike
    if(metaphone.compare(wordA, wordB))
        console.log('they sound alike!');

    // attaching will patch string with a soundsLike method                         
    metaphone.attach();

    // soundsLike is essentially a shortcut to Metaphone.compare
    if(wordA.soundsLike(wordB))
        console.log('they sound alike!');    

Copyright
---------

Copyright (c) 2011 Chris Umbel
