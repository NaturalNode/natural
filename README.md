natural
=======

General natural language facilities for nodejs

Porter Stemmer
--------------

require('natural/porter_stemmer').attach();

console.log("i am waking up to the sounds of chainsaws".tokenizeAndStem());

Bayes Naive Classifier
----------------------

    classifier = require('natural/bayes_classifier');

    classifier.train([{classification: 'buy', text: "i am long qqqq"},
                  {classification: 'buy', text: "buy the q's"},
                  {classification: 'sell', text: "short gold"},
                  {classification: 'sell', text: "sell gold"},
]);

    // sell
    console.log(classifier.classify('i am short silver'));

    // buy
    console.log(classifier.classify('i am long copper'));

Copyright
---------

Copyright (c) 2011 Chris Umbel
