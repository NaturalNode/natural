---
layout: default
title: Wordnet
nav_order: 16
---


# WordNet

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
