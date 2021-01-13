---
layout: default
title: Spellcheck
nav_order: 17
---

# Spellcheck

A probabilistic spellchecker based on http://norvig.com/spell-correct.html

This is best constructed with an array of tokens from a corpus, but a simple list of words from a dictionary will work.

```javascript
var corpus = ['something', 'soothing'];
var spellcheck = new natural.Spellcheck(corpus);
```

It uses the trie datastructure for fast boolean lookup of a word

```javascript
spellcheck.isCorrect('cat'); // false
```

It suggests corrections (sorted by probability in descending order) that are up to a maximum edit distance away from the input word. According to Norvig, a max distance of 1 will cover 80% to 95% of spelling mistakes. After a distance of 2, it becomes very slow.

```javascript
spellcheck.getCorrections('soemthing', 1); // ['something']
spellcheck.getCorrections('soemthing', 2); // ['something', 'soothing']
```
