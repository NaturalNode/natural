---
layout: default
title: Installation
nav_order: 1
---

# Installation

If you're just looking to use natural without your own node application,
you can install via NPM like so:

    npm install natural

If you're interested in contributing to natural, or just hacking on it, then by all
means fork away!

# Modularity

Each part of the library has its own `index.js` file. You only have to include the module you are actually using. For instance, if you are using one of the tokenizers:
```javascript
const tokenizers = require('natural/lib/natural/tokenizers')
const tokenizer = new tokenizers.SentenceTokenizer()
```

