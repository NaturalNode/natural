---
layout: default
title: Support for TypeScript
nav_order: 3
---

# TypeScript

Natural offers type declarations for TypeScript. Each module has a index.d.ts file with the type and class declarations that are needed to use the module in a TypeScript project. Also the main index file has a TypeScript sibling.

# Example: importing tokenizer module

```
import { WordTokenizer } from '../lib/natural/tokenizers'

let tokenizer = new WordTokenizer()
console.log(tokenizer.tokenize('your dog has fleas.'))
// [ 'your', 'dog', 'has', 'fleas' ]
```
You can also import from the complete library:
```
import { WordTokenizer } from '../lib/natural'
```
