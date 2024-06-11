---
layout: default
title: Phonetics
nav_order: 11
---

# Phonetics
Phonetic matching (sounds-like) matching can be done with the [SoundEx](http://en.wikipedia.org/wiki/Soundex),
[Metaphone](http://en.wikipedia.org/wiki/Metaphone) or [DoubleMetaphone](http://en.wikipedia.org/wiki/Metaphone#Double_Metaphone) algorithms

```javascript
const natural = require('natural');
const metaphone = new natural.Metaphone();
const soundEx = new natural.SoundEx();

const wordA = 'phonetics';
const wordB = 'fonetix';
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
const natural = require('natural');
const dm = natural.DoubleMetaphone();

const encodings = dm.process('Matrix');
console.log(encodings[0]);
console.log(encodings[1]);
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
