natural
=======

General natural language facilities for nodejs

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

Copyright
---------

Copyright (c) 2011 Chris Umbel
