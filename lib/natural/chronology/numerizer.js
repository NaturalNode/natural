
/*
Copyright (c) 2011, Chris Umbel

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

var directNums = [
    ["one", '1'],
    ["two", '2'],
    ["three", '3'],
    ["four", '4'],
    ["five", '5'],
    ["six", '6'],
    ["seven", '7'],
    ["eight", '8'],
    ["nine", '9'],
    ["ten", '10'],
    ["eleven", '11'],
    ["twelve", '12'],
    ["thirteen", '13'],
    ["fourteen", '14'],
    ["fifteen", '15'],
    ["sixteen", '16'],
    ["eighteen", '18'],
    ["nineteen", '19']
];

var ordinals = [
    ['first', '1'],
    ['third', '3'],
    ['fourth', '4'],
    ['fifth', '5'],
    ['sixth', '6'],
    ['seventh', '7'],
    ['eighth', '8'],
    ['ninth', '9'],
    ['tenth', '10']
];

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function replaceList(text, list) {
    list.forEach(function(num) {
        text = text.replace(num[0], num[1]);
    });

    return text;
}

function numerize(text) {
    text = replaceList(text, directNums);
    text = replaceList(text, ordinals);
    
    return text;
}

exports.numerize = numerize;
