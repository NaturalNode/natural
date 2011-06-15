
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

var tokenizer = require('./whitespace_tokenizer');

var numbers = [
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
    ["nineteen", '19'],
    ["twenty", '20'],
    ["twenty-one", '21'],
    ["twenty-two", '22'],
    ["twenty-three", '23'],
    ["twenty-four", '24'],
    ["twenty-five", '25'],
    ["twenty-six", '26'],
    ["twenty-seven", '27'],
    ["twenty-eight", '28'],
    ["twenty-nine", '29']
];

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function preNormalize(text) {
    text = text.toLowerCase();
    //text = text.replace(/[\'\"\.,]/, '');
    text = text.replace(/\bsecond (of|day|month|hour|minute|second)\b/, '2nd \1');
    //text = numericize_numbers(text)
    //text = text.replace(/ \-(\d{4})\b/, ' tzminus\1');
    //text = text.replace(/([\/\-\,\@])/) { ' ' + $1 + ' ' }
    text = text.replace(/\b0(\d+:\d+\s*pm?\b)/, '\1');
    text = text.replace(/\btoday\b/, 'this day');
    text = text.replace(/\btomm?orr?ow\b/, 'next day');
    text = text.replace(/\byesterday\b/, 'last day');
    text = text.replace(/\bnoon\b/, '12:00');
    text = text.replace(/\bmidnight\b/, '24:00');
    text = text.replace(/\bbefore now\b/, 'past');
    text = text.replace(/\bnow\b/, 'this second');
    text = text.replace(/\b(ago|before)\b/, 'past');
    text = text.replace(/\bthis past\b/, 'last');
    text = text.replace(/\bthis last\b/, 'last');
    text = text.replace(/\b(?:in|during) the (morning)\b/, '\1');
    text = text.replace(/\b(?:in the|during the|at) (afternoon|evening|night)\b/, '\1');
    text = text.replace(/\btonight\b/, 'this night');
    text = text.replace(/\b\d+:?\d*[ap]\b/,'\0m');
    text = text.replace(/(\d)([ap]m|oclock)\b/, '\1 \2');
    text = text.replace(/\b(hence|after|from)\b/, 'future');

    return text;
}

function parse(text) {
    text = preNormalize(text);
    return this.providedNow;
}

var Chronology = function(providedNow) {
    this.parse = parse;
    this.providedNow = providedNow;
};

module.exports = Chronology;

// exports for testing
Chronology.preNormalize = preNormalize;
