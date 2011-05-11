natural
=======

General natural language facilities for nodejs

Porter Stemmer
--------------    
    var natural = require('natural');
    // attach() patches stem() and tokenizeAndStem() to String
    // as a shortcut to PorterStemmer.stem(token) and .tokenizeAndStem(token)
    natural.PorterStemmer.attach();

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
