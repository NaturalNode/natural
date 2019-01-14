/*
Copyright (c) 2019, Leonardo Fenu, Chris Umbel, Hugo W.L. ter Doest

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var stemmer = require('../lib/natural/stemmers/porter_stemmer_it');
const snowBallDict = require('spec/test_data/snowball_it.json');

describe('porter_stemmer_it', function() {
  it('should perform stem', function() {
    var errors = [];
    Object.keys(snowBallDict).forEach(word => {
      var stemmed = stemmer.stem(word);
      var expectedStem = snowBallDict[word];
      if (stemmed !== snowBallDict[word]) {
        console.log('Error:', word, 'Expected:', expectedStem, 'Got:', stemmed);
        errors.push({
          word: word,
          expected: expectedStem,
          actual: stemmed
        });
      }
    });

    expect(errors.length).toEqual(0);
  });

  it('should tokenize and stem attached', function() {
    stemmer.attach();

    expect('SOPRA la panca la capra CAMPA'.tokenizeAndStem()).toEqual([ 'sopr', 'panc', 'capr', 'camp' ]);
    expect('SOTTO la panca la capra CREPA'.tokenizeAndStem()).toEqual([ 'sott', 'panc', 'capr', 'crep' ]);
  });
});
