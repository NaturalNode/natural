---
layout: default
title: Development
nav_order: 19
---

# Development

## Contributing

When developing, please:

+ Write unit tests for jasmine
+ Make sure your unit tests pass
+ Do not use the file system <code>fs</code>. If you need to read files, use JSON and <code>require</code>.

The current configuration of the unit tests requires the following environment variable to be set:
```javascript
    export NODE_PATH=.
````

## CD/CD

The repository uses Github Actions for testing and publishing. Testing is done with the four most recent releases of Nodejs. The natural package is automatically published to NPM when a release is created.

Github workflows can be found at `./.github/workflows`.

## Using the library in a browser

The package can be used in the browser using Webpack. It is tested using Webpack, Gulp and Jasmine. The test suite is run using the command: `npm run test_browser`. The server is at http://localhost:8888. You should  uncheck "run tests in random order" in the browser to make it work. There are some tests that are sensitive to the order in which tests are run.
