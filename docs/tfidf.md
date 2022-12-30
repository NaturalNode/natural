---
layout: default
title: TF-IDF
nav_order: 13
---

# tf-idf

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
