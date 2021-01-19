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

const TenseInflector = function () {
}

TenseInflector.prototype.addSingular = function (pattern, replacement) {
  this.customSingularForms.push([pattern, replacement])
}

TenseInflector.prototype.addPlural = function (pattern, replacement) {
  this.customPluralForms.push([pattern, replacement])
}

TenseInflector.prototype.ize = function (token, formSet, customForms) {
  const restoreCase = this.restoreCase(token)
  return restoreCase(this.izeRegExps(token, customForms) || this.izeAbiguous(token) ||
        this.izeRegulars(token, formSet) || this.izeRegExps(token, formSet.regularForms) ||
        token)
}

TenseInflector.prototype.izeAbiguous = function (token) {
  if (this.ambiguous.indexOf(token.toLowerCase()) > -1) { return token.toLowerCase() }

  return false
}

TenseInflector.prototype.pluralize = function (token) {
  return this.ize(token, this.pluralForms, this.customPluralForms)
}

TenseInflector.prototype.singularize = function (token) {
  return this.ize(token, this.singularForms, this.customSingularForms)
}

const uppercaseify = function (token) {
  return token.toUpperCase()
}
const capitalize = function (token) {
  return token[0].toUpperCase() + token.slice(1)
}
const lowercaseify = function (token) {
  return token.toLowerCase()
}

TenseInflector.prototype.restoreCase = function (token) {
  if (token[0] === token[0].toUpperCase()) {
    if (token[1] && token[1] === token[1].toLowerCase()) {
      return capitalize
    } else {
      return uppercaseify
    }
  } else {
    return lowercaseify
  }
}

TenseInflector.prototype.izeRegulars = function (token, formSet) {
  token = token.toLowerCase()
  // if (formSet.irregularForms.hasOwnProperty(token) && formSet.irregularForms[token]) {
  if (formSet.irregularForms[token]) {
    return formSet.irregularForms[token]
  }

  return false
}

TenseInflector.prototype.addForm = function (singularTable, pluralTable, singular, plural) {
  singular = singular.toLowerCase()
  plural = plural.toLowerCase()
  pluralTable[singular] = plural
  singularTable[plural] = singular
}

TenseInflector.prototype.addIrregular = function (singular, plural) {
  this.addForm(this.singularForms.irregularForms, this.pluralForms.irregularForms, singular, plural)
}

TenseInflector.prototype.izeRegExps = function (token, forms) {
  let i, form
  for (i = 0; i < forms.length; i++) {
    form = forms[i]

    if (token.match(form[0])) { return token.replace(form[0], form[1]) }
  }

  return false
}

module.exports = TenseInflector
