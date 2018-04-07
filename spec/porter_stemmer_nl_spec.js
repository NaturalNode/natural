/*
Copyright (c) 2018, Hugo W.L. ter Doest

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

var fs = require("fs");
var PorterStemmer = require('../lib/natural/stemmers/porter_stemmer_nl');

var filenameDutchText = "./spec/test_data/Volkskrant-20150205-Knot-geldpers-aanzetten-is-paardenmiddel-voor-half-procent-inflatie.txt";

describe('porter_stemmer_es', function() {

 	it('should perform stemming on a lot of words', function() {
 		var errors = [];

 		fs.readFileSync('spec/test_data/snowball_nl.txt').toString().split('\n').forEach(function(line) {
 			if (line) {
 				var fields = line.replace(/\s+/g, ' ').split(' '),
 					stemmed = PorterStemmer.stem(fields[0]);

 				if (stemmed !== fields[1]) {
					//console.log('Error:', fields[0], 'Expected:', fields[1], 'Got:', stemmed);
 					errors.push({
 						word:     fields[0],
 						expected: fields[1],
 						actual:   stemmed
 					});
 				}
 			}
 		});

 		expect(errors.length).toBe(339);
 	});
  
  
    it('should tokenize a piece of text', function() {
      var text = fs.readFileSync(filenameDutchText, 'utf-8');
      expect(PorterStemmer.tokenizeAndStem(text, true)).toEqual(
        [ 'knot', 'geldper', 'aanzet', 'is', 'paardenmiddel', 'vor', 'half', 'procent', 'inflatie', 'd', 'president', 'van', 'd', 'nederlandsch', 'bank', 'klas', 'knot', 'vindt', 'd', 'geldinjectie', 'in', 'd', 'europes', 'economie', 'van', 'ruim', '1', '100', 'miljard', 'euro', 'vel', 't', 'hog', 'vor', 'het', 'beoogd', 'resultat', 'een', 'half', 'procent', 'inflatie', 'in', '2016', 'oftewel', '50', 'basispunt', 'dat', 'zijn', 'hel', 'dur', 'basispunt', 'zei', 'knot', 'donderdag', 'in', 'd', 'twed', 'kamer', 'dor', 'robert', 'giebel', '5', 'februari', '2015', '21', '55', 'bron', 'anp', 'd', 'financi', 'l', 'specialist', 'onder', 'd', 'kamerled', 'had', 'knot', 'gevraagd', 'uitleg', 't', 'gev', 'over', 'het', 'ecb', 'besluit', 'van', '22', 'januari', 'd', 'central', 'bank', 'van', 'd', 'eurozon', 'gat', 'vor', '60', 'miljard', 'euro', 'per', 'maand', 'staatsschuld', 'opkop', 'dat', 'komt', 'ner', 'op', 'het', 'aanzet', 'van', 'd', 'geldper', 'om', 'd', 'inflatie', 'en', 'd', 'economie', 'aan', 't', 'jag', 'het', 'ecb', 'bestur', 'd', 'president', 'van', 'd', 'national', 'central', 'bank', 'van', 'evenzovel', 'euroland', 'en', 'zes', 'vast', 'bestuurder', 'beslot', 'daartoe', 'met', '20', 'vor', 'en', '5', 'teg', 'vrij', 'uitzonder', 'was', 'dat', 'knot', 'bekendmaakt', 'een', 'van', 'd', 'vijf', 'tegenstemmer', 't', 'zijn', 'hij', 'vindt', 'd', 'zogenoemd', 'kwantitatiev', 'verruim', 'noodzak', 'noch', 'effectief', 'mar', 'zei', 'knot', 'gister', 'tot', 'd', 'kamer', 'dat', 'besluit', 'is', 'een', 'gegev', 'nu', 'gan', 'besprek', 'of', 'het', 'een', 'goed', 'of', 'slecht', 'besluit', 'was', 'is', 'mosterd', 'na', 'd', 'maaltijd', 'in', 'het', 'vervolg', 'van', 'zijn', 'betog', 'kon', 'knot', 'zich', 'evenwel', 'niet', 'losmak', 'van', 'zijn', 'weerzin', 'erteg', 'd', 'dnb', 'president', 'maakt', 'duidelijk', 'dat', 'het', 'op', 'grot', 'schal', 'aanzet', 'van', 'd', 'geldper', 'vooral', 'een', 'sprong', 'in', 'het', 'diep', 'is', 'het', 'is', 'gen', 'flauwekul', 'mar', 'het', 'is', 'ook', 'niet', 'd', 'silver', 'bullet', 'd', 'oploss', 'van', 'all', 'kwal', 'deflatiespok', 'e', 'n', 'komma', 'n', 'triljoen', 'euro', 'vor', 'een', 'half', 'procent', 'inflatie', 'het', 'effect', 'van', 'd', 'geldinjectie', 'is', 'dan', 'ook', 'een', 'kwestie', 'van', 'appreciatie', 'meent', 'knot', 'welk', 'risico', 'acht', 'j', 'het', 'grootst', 'd', 'meerder', 'van', 'd', 'ecb', 'vindt', 'het', 'risico', 'van', 'deflatie', 'het', 'grootst', 'd', 'economie', 'komt', 'tot', 'stilstand', 'omdat', 'iederen', 'denkt', 'dat', 'alles', 'later', 'goedkoper', 'wordt', 'en', 'op', 'dat', 'later', 'gat', 'wacht', 'om', 'dat', 'deflatiespok', 'enigszin', 'buit', 'd', 'deur', 't', 'houd', 'wordt', 'zo', 'constateert', 'knot', 'een', 'paardenmiddel', 'ingezet', 'e', 'n', 'komma', 'n', 'triljoen', 'euro', 'vor', 'een', 'half', 'procent', 'inflatie', 'd', 'tegenstemmer', 'zoal', 'knot', 'vind', 'het', 'risico', 'van', 'deflatie', 'niet', 'grot', 'ongever', '60', 'procent', 'van', 'd', 'dalend', 'prijz', 'komt', 'dor', 'd', 'lag', 'olieprijs', 'en', 'dat', 'is', 'tijdelijk', 'zei', 'hij', 'het', 'risico', 'op', 'bijvoorbeeld', 'zeepbell', 'op', 'd', 'beur', 'en', 'in', 'd', 'huizenmarkt', 'acht', 'knot', 'vel', 'r', 'ler', 'd', 'kwantitatiev', 'verruim', 'jaagt', 'd', 'prijz', 'van', 'aandel', 'obligaties', 'en', 'vastgoed', 'op', 'tot', 'een', 'niveau', 'dat', 'volgen', 'knot', 'losstat', 'van', 'd', 'economisch', 'werkelijk', 'dat', 'vergrot', 'd', 'verschill', 'tuss', 'vermog', 'en', 'minder', 'vermog', 'gen', 'risico', 'mar', 'een', 'vaststaand', 'negatief', 'effect', 'van', 'd', 'kunstmat', 'lag', 'rent', 'dor', 'd', 'geldper', 'aan', 't', 'zet', 'is', 'volgen', 'knot', 'bovendien', 'dat', 'land', 'dor', 'd', 'actie', 'van', 'd', 'ecb', 'minder', 'gemotiveerd', 'zull', 'zijn', 'economisch', 'en', 'monetair', 't', 'hervorm' ]);
    });
  
    it('should work with the attached notation', function() {
      PorterStemmer.attach();
      expect("mogelijkheid".stem()).toEqual("mogelijk");
      expect("Knot: geldpers aanzetten is paardenmiddel voor half procent inflatie".tokenizeAndStem(true)).toEqual(
        [ 'knot', 'geldper', 'aanzet', 'is', 'paardenmiddel', 'vor', 'half', 'procent', 'inflatie' ]);
    });
    
});
