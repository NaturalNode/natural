
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

var numbers = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14,
    "fifteen": 15,
    "sixteen": 16,
    "eighteen": 18,
    "nineteen": 19,
    "twenty": 20,
    "twenty-one": 21,
    "twenty-two": 22,
    "twenty-three": 23
};

function parse(str) {
    tokens = tokenizer.tokenize(str.toLowerCase());
    
    var now = this.providedNow ? this.providedNow : new Date();
    var result = new Date(0, 0, 0, 0, 0, 0, 0); 
    var hourModifier = 0;
 
    for(var i = 0; i < tokens.length; i++) {
        switch(tokens[i]) {
            case 'today':
                result.setFullYear(now.getFullYear());
                result.setMonth(now.getMonth());
                result.setDate(now.getDate());
                break;
            case 'noon':
                result.setHours(12);
                break;
            case 'midnight':
                result.setHours(0);
                break;
            case 'passed':
                if(i > 0) {
                    if(tokens[i - 1] == 'half')
                        result.setMinutes(30);
                    else if(tokens[i - 1] == 'quarter')
                        result.setMinutes(15);
                    else if(numbers[tokens[i - 1]])
                        result.setMinutes(numbers[tokens[i - 1]]);

                    if(numbers[tokens[i + 1]]) {
                        result.setHours(numbers[tokens[++i]]);
                    }
                }
                
                break;
            case 'till':
            case 'to':            
                if(i < tokens.length) {
                    if(tokens[i - 1] == 'quarter') {
                        result.setMinutes(45);
                        hourModifier = -1;
                    } else if(numbers[tokens[i - 1]]) {
                        result.setMinutes(60 - numbers[tokens[i - 1]]);
                        hourModifier = -1;
                    }
                    
                    if(numbers[tokens[i + 1]]) {
                        result.setHours(numbers[tokens[++i]]);
                    }                    
                }
                
                break;
         }
    }
    
    result.setHours(result.getHours() + hourModifier);
    
    return result;
}

var Chronology = function(providedNow) {
    this.parse = parse;
    this.providedNow = providedNow;
};

module.exports = Chronology;