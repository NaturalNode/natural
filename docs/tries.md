---
layout: default
title: Tries
nav_order: 14
---

# Tries

Tries are a very efficient data structure used for prefix-based searches.
Natural comes packaged with a basic Trie implementation which can support match collection along a path,
existence search and prefix search.

## Building The Trie

You need to add words to build up the dictionary of the Trie, this is an example of basic Trie set up:

```javascript
var natural = require('natural');
var Trie = natural.Trie;

var trie = new Trie();

// Add one string at a time
trie.addString("test");

// Or add many strings
trie.addStrings(["string1", "string2", "string3"]);
```

## Searching

### Contains

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
trie.addString("test");
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
