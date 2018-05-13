/*
Copyright (c) 2018, Luís Rodrigues (adapted for Spanish stemmer)

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

var PorterStemmer = require('../lib/natural/stemmers/porter_stemmer_es'),
	fs = require('fs');

describe('porter_stemmer_es', function() {

 	it('should perform stemming on a lot of words', function() {
 		var errors = [];

 		fs.readFileSync('spec/test_data/snowball_es.txt').toString().split('\n').forEach(function(line) {
 			if (line) {
 				var fields = line.replace(/\s+/g, ' ').split(' '),
 					stemmed = PorterStemmer.stem(fields[0]);

 				if (stemmed !== fields[1]) {
					console.log('Error:', fields[0], 'Expected:', fields[1], 'Got:', stemmed);
 					errors.push({
 						word:     fields[0],
 						expected: fields[1],
 						actual:   stemmed
 					});
 				}
 			}
 		});

 		expect(errors.length).toBe(0);
 	});
  
    it('should tokenize a piece of text', function() {
      expect(PorterStemmer.tokenizeAndStem("Pues, en efecto, es solo el plano y lo que muestra aquello que interesa a Zemeckis.", true)).toEqual(
        [ 'pues', 'en', 'efect', 'es', 'sol', 'el', 'plan', 'y', 'lo', 'que', 'muestr', 'aquell', 'que', 'interes', 'a', 'zemeckis' ]);
    });
  
    it('should work with the attached notation', function() {
      PorterStemmer.attach();
      expect("efecto".stem()).toEqual("efect");
      expect("Pues, en efecto, es solo el plano y lo que muestra aquello que interesa a Zemeckis.".tokenizeAndStem(true)).toEqual(
        [ 'pues', 'en', 'efect', 'es', 'sol', 'el', 'plan', 'y', 'lo', 'que', 'muestr', 'aquell', 'que', 'interes', 'a', 'zemeckis' ]);
    });

});
