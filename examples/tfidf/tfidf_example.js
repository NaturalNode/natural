/*
Copyright (c) 2011, Rob Ellis, Chris Umbel

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

var natural = require('natural'),
    TfIdf = natural.TfIdf,
    tfidf = new TfIdf();

tfidf.addDocument('this document is about node.');
tfidf.addDocument('this document is about ruby.');
tfidf.addDocument('this document is about ruby and node.');
tfidf.addDocument('this document is about node. it has node examples');

console.log('node --------------------------------');
tfidf.tfidfs('node', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});

console.log('ruby --------------------------------');
tfidf.tfidfs('ruby', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});

console.log('-------------------------------------');
console.log(tfidf.tfidf('ruby', 0));
console.log(tfidf.tfidf('ruby', 1));
