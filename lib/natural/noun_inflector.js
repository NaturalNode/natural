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
    'sheep', 'shrimp', 'species', 'swine', 'trout', 'tuna', 'whiting', 'wildebeest'
];

var forms = {
    regulars: {
        plurals: [],
        singulars: []
    },
    irregulars: {
        plurals: {},
        singulars: {}
    }
};

function addIrregular(singular, plural) {
    forms.irregulars.plural[singular] = plural;
    forms.irregulars.plural[plural] = singular;
}

(function() {
    addIrregular("child", "children");
    addIrregular("man", "men");
    addIrregular("person", "people");
    addIrregular("sex", "sexes");
    addIrregular("mouse", "mice");
    
    // see if it is possible to unify the creation of both the singular and
    // plural regexes or maybe even just have one list. with a complete list
    // of rules it may only be possible for some regular forms, but worth a shot    
    forms.regulars.plurals.push([/(octop|vir)us$/i, '$1i']);
    forms.regulars.plurals.push([/(buffal|tomat)o$/i, '$1oes']);    
    forms.regulars.plurals.push([/(sis)$/i, 'ses']);
    forms.regulars.plurals.push([/(matr|vert|ind)(ix|ex)$/i, '$1ices']);
    forms.regulars.plurals.push([/(x|ch|ss|sh|s|z)$/i, '$1es']);
    forms.regulars.plurals.push([/(.*)/i, '$1s']);

    forms.regulars.singulars.push([/(octop|vir)(i)$/i, '$1us']);
    forms.regulars.singulars.push([/(buffal|tomat)(oes)$/i, '$1o']);
    forms.regulars.singulars.push([/(analy|naly|synop|parenthe|diagno|the)ses$/i, '$1sis']);
    forms.regulars.singulars.push([/(vert|ind)(ices)$/i, '$1ex']);
    // our pluralizer won''t cause this form of appendix (appendicies)
    // but we should handle it
    forms.regulars.singulars.push([/(matr|append)(ices)$/i, '$1ix']);
    forms.regulars.singulars.push([/(x|ch|ss|sh|s|z)es$/i, '$1']);
    forms.regulars.singulars.push([/s$/i, '']);
})();

function izeRegExps(token, forms) {
    for(i = 0; i < forms.length; i++) {
        form = forms[i];
        
        if(token.match(form[0]))
            return token.replace(form[0], form[1]);
    }
    
    return false;
}

function izeAbiguous(token) {
    if(ambiguous.indexOf(token) > -1)
        return token;

    return false;
}

function izeRegulars(token, formSet) {
    if(formSet.irregularForms[token.toLowerCase()])
        return formSet.irregularForms[token];

    return false;
}

function ize(token, formSet, customForms) {
    return izeRegExps(token, customForms) || izeAbiguous(token) ||
        izeRegulars(token, formSet) || izeRegExps(token, formSet.regularForms) ||
        token;
}

function attach() {
    var inflector = this;
    
    String.prototype.singularizeNoun = function() {
        return inflector.singularize(this);
    }
    
    String.prototype.pluralizeNoun = function() {
        return inflector.pluralize(this);
    }
}
    
var Inflector = function() {
    this.customPluralForms = [];
    this.customSingularForms = [];

    this.addSingular = function(pattern, replacement) {
        this.customSingularForms.push([pattern, replacement]);
    };
    
    this.addPlural = function(pattern, replacement) {
        this.customPluralForms.push([pattern, replacement]);
    };
    
    this.ize = ize;
        
    this.pluralize = function (token) {
        return this.ize(token, pluralForms, this.customPluralForms);
    };

    this.singularize = function(token) {
        return this.ize(token, singularForms, this.customSingularForms);
    };
    
    this.attach = attach;
};

module.exports = Inflector;
