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

function FormSet() {
    this.regularForms = [];
    this.irregularForms = {};
}

var WordInflector = function () {}

WordInflector.prototype.pluralize = function (token) {
        return this.ize(token, this.pluralForms, this.customPluralForms);
    };

WordInflector.prototype.singularize = function(token) {
        return this.ize(token, this.singularForms, this.customSingularForms);
    };    

WordInflector.prototype.izeRegExps = function(token, forms) {
    for(i = 0; i < forms.length; i++) {
        form = forms[i];
        
        if(token.match(form[0]))
            return token.replace(form[0], form[1]);
    }
    
    return false;
}
    
WordInflector.prototype.singularForms = new FormSet();
WordInflector.prototype.pluralForms = new FormSet();

module.exports = WordInflector;