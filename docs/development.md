---
layout: default
title: Development
nav_order: 19
---

# Development

## Contributing

When developing, please:

+ Comply with [Standard JS](https://standardjs.com/). This is tested when you commit to natural.
+ Prevent code duplication. Use [jscpd](https://www.npmjs.com/package/jscpd) to test this. This is tested when you commit to natural.
+ Write unit tests for jasmine. Make sure your unit tests pass.
+ For compatibility with browsers, do not use the file system <code>fs</code>. If you need to read files, use JSON and <code>require</code>.
+ Write documentation and commit this to the `gh-pages` branch.

The current configuration of the unit tests requires the following environment variable to be set:
```javascript
    export NODE_PATH=.
````

## CD/CD pipeline

The repository uses Github Actions for testing and publishing.

Currently, there three workflows:
- Node CI: tests natural on the four most recent releases of Nodejs. Code coverage is analysed with [Istanbul](https://istanbul.js.org/). Results are forwarded to [Coveralls](https://coveralls.io/). In the README a badge shows the coverage.
- Nodejs package: The natural package is automatically published to NPM when a release is created (tagged).
- Lint Code Base: the repository is linted using the Github super linter which includes `jslint` and `jscpd`.

Github workflows can be found at `./.github/workflows`.

## Versioning

We apply [semantic versioning](https://semver.org/). Given natural's version number MAJOR.MINOR.PATCH, increment the:

+ MAJOR version when you make incompatible API changes,
+ MINOR version when you add functionality in a backwards compatible manner, and
+ PATCH version when you make backwards compatible bug fixes.

## Using the library in a browser

The package can be used in the browser using Webpack. It is tested using Webpack, Gulp and Jasmine. The test suite is run using the command: `npm run test_browser`. The server is at http://localhost:8888. You should  uncheck "run tests in random order" in the browser to make it work. There are some tests that are sensitive to the order in which tests are run.

## Modularity

Each part of the library has its own `index.js` file. You only have to include the module you are actually using. For instance, if you are using one of the tokenizers:
```javascript
const tokenenizers = require('natural/lib/natural/tokenizers')
const tokenizer = new tokenizers.SentenceTokenizer()
```
