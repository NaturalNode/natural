
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
    [/one/g, "1"],
    [/two/g, "2"],
    [/three/g, "3"],
    [/four/g, "4"],
    [/five/g, "5"],
    [/six/g, "6"],
    [/seven/g, "7"],
    [/eight/g, "8"],
    [/nine/g, "9"],
    [/ten/g, "10"],
    [/eleven/g, "11"],
    [/twelve/g, "12"],
    [/thirteen/g, "13"],
    [/fourteen/g, "14"],
    [/fifteen/g, "15"],
    [/sixteen/g, "16"],
    [/eighteen/g, "18"],
    [/nineteen/g, "19"]
];

var ordinals = [
    [/first/g, "1"],
    [/third/g, "3"],
    [/fourth/g, "4"],
    [/fifth/g, "5"],
    [/sixth/g, "6"],
    [/seventh/g, "7"],
    [/eighth/g, "8"],
    [/ninth/g, "9"],
    [/tenth/g, "10"]
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

function preProcess(text) {
    // will mutilate hyphenated-words but shouldn't matter for date extraction - chronic
    // / +|([^\d])-([^\d])/
    text = text.replace(/([^\d])\-([^\d])/g, "\1 \2");
    
    // take the 'a' out so it doesn't turn into a 1, save the half for the end - chronic
    text = text.replace(/a half/g, "haAlf");
    
    return text;
}

function numerize(text) {
    text = preProcess(text);
    text = replaceList(text, directNums);
    text = replaceList(text, ordinals);
    
    return text;
}

exports.numerize = numerize;
