# Browser Tests

This directory contains browser tests for the Natural library.

## Overview

The browser tests verify that the Natural library works correctly when bundled for browser environments using Rollup. The tests use Jasmine and run in your browser.

## Files

- `test.html` - HTML test page that loads Jasmine and runs browser-based tests
- `test.mjs` - Simple HTTP server to serve the test files
- `README.md` - This file

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the browser bundle:
   ```bash
   npm run build:browser
   ```

### Run Tests

Start the test server:

```bash
npm run test:browser
```

This will start a local HTTP server and display a URL. Open the URL in your browser to run the tests and see the results in the Jasmine UI.

### Alternative: Open Directly

If you prefer, you can also open `test.html` directly in your browser, though you may need to allow file:// protocol access depending on your browser's security settings.

## Test Coverage

The browser tests cover core Natural library functionality:

- **Stemmers**: PorterStemmer, LancasterStemmer
- **Tokenizers**: WordTokenizer, TreebankWordTokenizer, SentenceTokenizer
- **NGrams**: Bigrams, Trigrams
- **Distance Functions**: JaroWinklerDistance, LevenshteinDistance, DiceCoefficient, HammingDistance
- **Phonetics**: Metaphone, Soundex, DoubleMetaphone

## How It Works

1. **Rollup Bundle**: The `rollup.browser.config.mjs` configuration creates an IIFE bundle at `dist/browser/natural.js` that exposes the Natural library as a global `natural` object.

2. **Jasmine Tests**: The test page loads Jasmine and defines tests using the standard `describe`/`it` syntax, similar to the tests in the `spec/` directory.

3. **HTTP Server**: The test runner starts a simple Node.js HTTP server to serve the test files, allowing you to run tests in any browser.

## Adding New Tests

To add new browser tests, edit `test.html` and add new `describe` or `it` blocks following the Jasmine testing pattern.
