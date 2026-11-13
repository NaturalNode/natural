---
layout: default
title: N-grams
nav_order: 12
---

# N-Grams

n-grams can be obtained for either arrays or strings (which will be tokenized
for you):

```javascript
var NGrams = natural.NGrams;
```

## bigrams

```javascript
console.log(NGrams.bigrams('some words here'));
console.log(NGrams.bigrams(['some',  'words',  'here']));
```

Both of the above output: `[ [ 'some', 'words' ], [ 'words', 'here' ] ]`

## trigrams

```javascript
console.log(NGrams.trigrams('some other words here'));
console.log(NGrams.trigrams(['some',  'other', 'words',  'here']));
```

Both of the above output: `[ [ 'some', 'other', 'words' ],
  [ 'other', 'words', 'here' ] ]`

## arbitrary n-grams

```javascript
console.log(NGrams.ngrams('some other words here for you', 4));
console.log(NGrams.ngrams(['some', 'other', 'words', 'here', 'for',
    'you'], 4));
```

The above outputs: `[ [ 'some', 'other', 'words', 'here' ],
  [ 'other', 'words', 'here', 'for' ],
  [ 'words', 'here', 'for', 'you' ] ]`

## padding

n-grams can also be returned with left or right padding by passing a start and/or end symbol to the bigrams, trigrams or ngrams.

```javascript
console.log(NGrams.ngrams('some other words here for you', 4, '[start]', '[end]'));
```

The above will output:
```
[ [ '[start]', '[start]', '[start]', 'some' ],
  [ '[start]', '[start]', 'some', 'other' ],
  [ '[start]', 'some', 'other', 'words' ],
  [ 'some', 'other', 'words', 'here' ],
  [ 'other', 'words', 'here', 'for' ],
  [ 'words', 'here', 'for', 'you' ],
  [ 'here', 'for', 'you', '[end]' ],
  [ 'for', 'you', '[end]', '[end]' ],
  [ 'you', '[end]', '[end]', '[end]' ] ]
```

For only end symbols, pass `null` for the start symbol, for instance:
```javascript
console.log(NGrams.ngrams('some other words here for you', 4, null, '[end]'));
```

Will output:
```
[ [ 'some', 'other', 'words', 'here' ],
  [ 'other', 'words', 'here', 'for' ],
  [ 'words', 'here', 'for', 'you' ],
  [ 'here', 'for', 'you', '[end]' ],
  [ 'for', 'you', '[end]', '[end]' ],
  [ 'you', '[end]', '[end]', '[end]' ] ]
```

### Short and empty sequences

Each requested boundary is padded with `n - 1` copies of its symbol before
the n-grams are generated. Every returned n-gram has exactly `n` elements,
including when the input contains fewer than `n` tokens. A window can contain
both start and end symbols:

```javascript
console.log(NGrams.trigrams('hello', '[start]', '[end]'));
// [ [ '[start]', '[start]', 'hello' ],
//   [ '[start]', 'hello', '[end]' ],
//   [ 'hello', '[end]', '[end]' ] ]

console.log(NGrams.ngrams(['hello'], 4, '[start]'));
// [ [ '[start]', '[start]', '[start]', 'hello' ] ]
```

Only complete windows are returned. An empty input with padding on just one
side produces no n-grams; with both sides padded, it can produce windows made
entirely of boundary symbols:

```javascript
console.log(NGrams.trigrams([], '[start]', '[end]'));
// [ [ '[start]', '[start]', '[end]' ],
//   [ '[start]', '[end]', '[end]' ] ]
```

The same padding rules apply to `NGramsZH`.

## NGramsZH

For Chinese like languages, you can use NGramsZH to do a n-gram, and all apis are the same:

```javascript
var NGramsZH = natural.NGramsZH;
console.log(NGramsZH.bigrams('中文测试'));
console.log(NGramsZH.bigrams(['中',  '文',  '测', '试']));
console.log(NGramsZH.trigrams('中文测试'));
console.log(NGramsZH.trigrams(['中',  '文', '测',  '试']));
console.log(NGramsZH.ngrams('一个中文测试', 4));
console.log(NGramsZH.ngrams(['一', '个', '中', '文', '测',
    '试'], 4));
```
