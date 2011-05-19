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

var ambiguous = [
    'bison', 'bream', 'carp', 'chassis', 'cod', 'corps', 'debris', 'deer',
    'diabetes', 'equipment', 'elk', 'fish', 'flounder', 'gallows', 'graffiti',
    'headquarters', 'herpes', 'highjinks', 'homework', 'information',
    'mackerel', 'mews', 'money', 'news', 'rice', 'rabies', 'salmon', 'series',
    'sheep', 'species', 'swine', 'trout', 'tuna', 'whiting', 'wildebeest'
];

var irregularsSingular = {};
var irregularsPlural = {};

function addIrregular(singular, plural) {
    irregularsPlural[singular] = plural;
    irregularsSingular[plural] = singular;    
}

addIrregular("child", "children");
addIrregular("man", "men");
addIrregular("person", "people");
addIrregular("sex", "sexes");

function handleAmbiguous(token) {
    if(ambiguous.indexOf(token) > -1)
        return token;
}

function ize(token, formTable) {
    var match = handleAmbiguous(token);
    
    if(match)
        return match;    

    if(formTable[token])
        return formTable[token];
}

function pluralize(token) {
    var result = ize(token, irregularsPlural);
    
    if(result)
        return result;
    
    if(token.substr(-1) == 's')
        return token + 'es';
        
    return token + 's';
}

function singularize(token) {
    var result = ize(token, irregularsSingular);
    
    if(result)
        return result;
    
    if(token.substr(-1) == 's')
        return token.substr(0, token.length - 1);
    
    return token;
}

var Inflector = function() {};
module.exports = Inflector;

Inflector.pluralize = pluralize;
Inflector.singularize = singularize;
