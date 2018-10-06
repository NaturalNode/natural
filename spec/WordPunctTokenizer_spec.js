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

var natural = require('../lib/natural');
var tokenizer = new natural.WordPunctTokenizer();

var sentences = [
  "Knot: geldpers aanzetten is paardenmiddel voor half procent inflatie",
  "De president van De Nederlandsche Bank, Klaas Knot, vindt de geldinjectie in de Europese economie van ruim 1.100 miljard euro veel te hoog voor het beoogde resultaat: een half procent inflatie in 2016.",
  "'Oftewel 50 basispunten, dat zijn heel dure basispunten', zei Knot donderdag in de Tweede Kamer.",
  "Door: Robert Giebels 5 februari 2015, 21:55 Bron: ANP",
  "De financiële specialisten onder de Kamerleden hadden Knot gevraagd uitleg te geven over het ECB-besluit van 22 januari.;",
  "Hoe gaat de tokenizer om met? vraagtekens ?",
  "Verbindingsstreepje in  een woord: ECB-besluit",
  "Gedachtestreepje in een zin met spaties eromheen - dit is de gedachte na het streepje ! "
];

var expectedResults = [
  ["Knot",":","geldpers","aanzetten","is","paardenmiddel","voor","half","procent","inflatie"],
  ["De","president","van","De","Nederlandsche","Bank",",","Klaas","Knot",",","vindt","de","geldinjectie","in","de","Europese","economie","van","ruim","1.100","miljard","euro","veel","te","hoog","voor","het","beoogde","resultaat",":","een","half","procent","inflatie","in","2016."],
  ["'","Oftewel","50","basispunten",",","dat","zijn","heel","dure","basispunten","'",",","zei","Knot","donderdag","in","de","Tweede","Kamer","."],
  ["Door",":","Robert","Giebels","5","februari","2015",",","21",":","55","Bron",":","ANP"],
  ["De","financiële","specialisten","onder","de","Kamerleden","hadden","Knot","gevraagd","uitleg","te","geven","over","het","ECB-besluit","van","22","januari",".",";"],
  ["Hoe","gaat","de","tokenizer","om","met","?","vraagtekens","?"],
  ["Verbindingsstreepje","in","een","woord",":","ECB-besluit"],
  ["Gedachtestreepje","in","een","zin","met","spaties","eromheen","-","dit","is","de","gedachte","na","het","streepje","!"]
];

describe("Word Punctuation Tokenizer", function() {
  it('should correctly tokenize words and punctuation symbols', function() {
    sentences.forEach((sentence, index) => {
      var result = tokenizer.tokenize(sentence);
      expect(result).toEqual(expectedResults[index]);
    });
  });
});
