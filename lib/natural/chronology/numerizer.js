
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

var tensPrefixes = [
  ['twenty', 20],
  ['thirty', 30],
  ['forty', 40],
  ['fourty', 40], // Common mis-spelling
  ['fifty', 50],
  ['sixty', 60],
  ['seventy', 70],
  ['eighty', 80],
  ['ninety', 90]
];

function replaceList(text, list, replaceFunc, expressionFunc) {
    list.forEach(function(num) {
       var regexp;
       
       if(expressionFunc)
	   regexp = expressionFunc(num);
       else
	   regexp = (num[0] instanceof RegExp) ? num[0] : new RegExp(num[0], 'g');
    
        if(replaceFunc) {
            text = text.replace(regexp, function(arg){ return replaceFunc(num[1], arg); });
        } else
            text = text.replace(regexp, '<num>' + num[1]);
    });

    return text.replace(/\<num\>/g, '');
}

function preProcess(text) {
    // will mutilate hyphenated-words but shouldn't matter for date extraction - chronic
    text = text.replace(/(\D+)\-(\D+)/g, "$1 $2");
    
    // take the 'a' out so it doesn't turn into a 1, save the half for the end - chronic
    text = text.replace(/a half/g, "haAlf");
    
    return text;
}

function numerize(text) {
    text = preProcess(text);
    text = replaceList(text, directNums);
    text = replaceList(text, ordinals);
    text = replaceList(text, tensPrefixes, 
      function(num, arg) { return '<num>' + num + Integer.parseInt(arg); }, 
      function(num) { return new RegExp('(?:' + num[0] + ')\ *<num>(\d(?=[^\d]|$))*'); });
    text = replaceList(text, tensPrefixes, function(num) { return '<num>' + num; });
    
    return text;
}

exports.numerize = numerize;
