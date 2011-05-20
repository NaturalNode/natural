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

function addForm(singularTable, pluralTable, singular, plural) {
    pluralTable[singular] = plural;
    singularTable[plural] = singular;    
}

function FormSet() {
    this.regularForms = [];
    this.irregularForms = {};
}

var singularForms = new FormSet();
var pluralForms = new FormSet();

function addIrregular(singular, plural) {
    addForm(singularForms.irregularForms, pluralForms.irregularForms, singular, plural);
}

function addRegular(singular, plural) {
    pluralForms.regularForms
    singularForms.regularForms.push(new RegExp(), singular);
}

(function() {
    addIrregular("child", "children");
    addIrregular("man", "men");
    addIrregular("person", "people");
    addIrregular("sex", "sexes");
    
    // see if it is possible to unify the creation of both the singular and
    // plural regexes or maybe even just have one list. with a complete list
    // of rules it may only be possible for some regular forms, but worth a shot    
    pluralForms.regularForms.push([/(sis)$/i, 'ses']);
    pluralForms.regularForms.push([/(matr|vert|ind)(ix|ex)$/i, '$1ices']);
    pluralForms.regularForms.push([/(x|ch|ss|sh|s|z)$/i, '$1es']);
    pluralForms.regularForms.push([/(.*)/i, '$1s']);

    singularForms.regularForms.push([/(analy|naly|synop|parenthe|diagno|the)ses$/i, '$1sis']);
    singularForms.regularForms.push([/(vert|ind)(ices)$/i, '$1ex']);
    // our pluralizer won''t cause this form of appendix (appendicies)
    // but we should handle it
    singularForms.regularForms.push([/(matr|append)(ices)$/i, '$1ix']);
    singularForms.regularForms.push([/(x|ch|ss|sh|s|z)es$/i, '$1']);
    singularForms.regularForms.push([/s$/i, '']);
})();

function ize(token, formSet) {
    if(ambiguous.indexOf(token) > -1)
        return token;

    if(formSet.irregularForms[token.toLowerCase()])
        return formSet.irregularForms[token];

    for(i = 0; i < formSet.regularForms.length; i++) {
        form = formSet.regularForms[i];
        
        if(token.match(form[0]))
            return token.replace(form[0], form[1]);
    }
    
    return token;
}

function pluralize(token) {
    return ize(token, pluralForms);
}

function singularize(token) {
    return ize(token, singularForms);
}

var Inflector = function() {};
module.exports = Inflector;

Inflector.pluralize = pluralize;
Inflector.singularize = singularize;

Inflector.attach = function() {
    String.prototype.singularize = function() {
        return Inflector.singularize(this);
    }
    
    String.prototype.pluralize = function() {
        return Inflector.pluralize(this);
    }    
};
