---
layout: default
title: String distance
nav_order: 4
---

# String Distance

Natural provides an implementation of three algorithms for calculating string distance: Hamming distance, Jaro-Winkler, Levenshtein distance, and Dice coefficient.

[Hamming distance](https://en.wikipedia.org/wiki/Hamming_distance) measures the distance between two strings of equal length by counting the number of different characters. The third parameter indicates whether case should be ignored. By default the algorithm is case sensitive.
```javascript
var natural = require('natural');
console.log(natural.HammingDistance("karolin", "kathrin", false));
console.log(natural.HammingDistance("karolin", "kerstin", false));
// If strings differ in length -1 is returned
console.log(natural.HammingDistance("short string", "longer string", false));
```

Output:
```javascript
3
3
-1
```


The [Jaro–Winkler](http://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance) string distance measuring algorithm will return a number between 0 and 1 which tells how closely the strings match (0 = not at all, 1 = exact match):

```javascript
var natural = require('natural');
console.log(natural.JaroWinklerDistance("dixon","dicksonx"));
console.log(natural.JaroWinklerDistance('not', 'same'));
```

Output:

```javascript
0.7466666666666666
0
```

If the distance between the strings is already known you can pass it as a third parameter. And you can force the algorithm to ignore case by passing a fourth parameter as follows:
```javascript
var natural = require('natural');
console.log(natural.JaroWinklerDistance("dixon","dicksonx", undefined, true));
```


Natural also offers support for [Levenshtein](https://en.wikipedia.org/wiki/Levenshtein_distance) distances:

```javascript
var natural = require('natural');
console.log(natural.LevenshteinDistance("ones","onez"));
console.log(natural.LevenshteinDistance('one', 'one'));
```

Output:

```javascript
1
0
```

The cost of the three edit operations are modifiable for Levenshtein:

```javascript
console.log(natural.LevenshteinDistance("ones","onez", {
    insertion_cost: 1,
    deletion_cost: 1,
    substitution_cost: 1
}));
```

Output:

```javascript
1
```

Full Damerau-Levenshtein matching can be used if you want to consider character transpositions as a valid edit operation.

```javascript
console.log(natural.DamerauLevenshteinDistance("az", "za"));
```

Output:
```javascript
1
```

The transposition cost can be modified as well:

```javascript
console.log(natural.DamerauLevenshteinDistance("az", "za", { transposition_cost: 0 }))
```

Output:
```javascript
0
```

A restricted form of Damerau-Levenshtein (Optimal String Alignment) is available.

This form of matching is more space efficient than unrestricted Damerau-Levenshtein, by only considering a transposition if there are no characters between the transposed characters.

Comparison:

```javascript
// Optimal String Alignment
console.log(natural.DamerauLevenshteinDistance('ABC', 'ACB'), { restricted: true });
1
console.log(natural.DamerauLevenshteinDistance('CA', 'ABC', { restricted: true }));
2
// Unrestricted Damerau-Levenshtein
console.log(natural.DamerauLevenshteinDistance('CA', 'ABC', { restricted: false }));
1
```

And [Dice's co-efficient](https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient):

```javascript
var natural = require('natural');
console.log(natural.DiceCoefficient('thing', 'thing'));
console.log(natural.DiceCoefficient('not', 'same'));
```

Output:

```javascript
1
0
```

## Approximate String Matching
Currently matching is supported via the Levenshtein algorithm.

```javascript
var natural = require('natural');
var source = 'The RainCoat BookStore';
var target = 'All the best books are here at the Rain Coats Book Store';

console.log(natural.LevenshteinDistance(source, target, {search: true}));
```

Output:

```javascript
{ substring: 'the Rain Coats Book Store', distance: 4 }
```

The following
