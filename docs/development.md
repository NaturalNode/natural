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
- Node CI: tests natural on the four most recent releases of Nodejs.
- Nodejs package: The natural package is automatically published to NPM when a release is created (tagged).
- Lint Code Base: the repository is linted using the Github super linter which includes `jslint` and `jscpd`.

Github workflows can be found at `./.github/workflows`.

## Using the library in a browser

The package can be used in the browser using Webpack. It is tested using Webpack, Gulp and Jasmine. The test suite is run using the command: `npm run test_browser`. The server is at http://localhost:8888. You should  uncheck "run tests in random order" in the browser to make it work. There are some tests that are sensitive to the order in which tests are run.
