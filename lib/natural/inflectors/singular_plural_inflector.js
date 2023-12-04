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

const uppercaseify = (token) => {
  return token.toUpperCase()
}

const capitalize = (token) => {
  return token[0].toUpperCase() + token.slice(1)
}

const lowercaseify = (token) => {
  return token.toLowerCase()
}

class TenseInflector {
  addSingular (pattern, replacement) {
    this.customSingularForms.push([pattern, replacement])
  }

  addPlural (pattern, replacement) {
    this.customPluralForms.push([pattern, replacement])
  }

  ize (token, formSet, customForms) {
    const restoreCase = this.restoreCase(token)
    return restoreCase(this.izeRegExps(token, customForms) || this.izeAbiguous(token) ||
          this.izeRegulars(token, formSet) || this.izeRegExps(token, formSet.regularForms) ||
          token)
  }

  izeAbiguous (token) {
    if (this.ambiguous.indexOf(token.toLowerCase()) > -1) { return token.toLowerCase() }

    return false
  }

  pluralize (token) {
    return this.ize(token, this.pluralForms, this.customPluralForms)
  }

  singularize (token) {
    return this.ize(token, this.singularForms, this.customSingularForms)
  }

  restoreCase (token) {
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

  izeRegulars (token, formSet) {
    token = token.toLowerCase()
    // if (formSet.irregularForms.hasOwnProperty(token) && formSet.irregularForms[token]) {
    if (formSet.irregularForms[token]) {
      return formSet.irregularForms[token]
    }

    return false
  }

  addForm (singularTable, pluralTable, singular, plural) {
    singular = singular.toLowerCase()
    plural = plural.toLowerCase()
    pluralTable[singular] = plural
    singularTable[plural] = singular
  }

  addIrregular (singular, plural) {
    this.addForm(this.singularForms.irregularForms, this.pluralForms.irregularForms, singular, plural)
  }

  izeRegExps (token, forms) {
    let i, form
    for (i = 0; i < forms.length; i++) {
      form = forms[i]

      if (token.match(form[0])) { return token.replace(form[0], form[1]) }
    }

    return false
  }
}

module.exports = TenseInflector
