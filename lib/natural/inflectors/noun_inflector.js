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

'use strict'

const SingularPluralInflector = require('./singular_plural_inflector')
const FormSet = require('./form_set')

class NounInflector extends SingularPluralInflector {
  constructor () {
    super()
    this.ambiguous = [
      'bison', 'bream', 'carp', 'chassis', 'christmas', 'cod', 'corps', 'debris', 'deer',
      'diabetes', 'equipment', 'elk', 'fish', 'flounder', 'gallows', 'graffiti',
      'headquarters', 'herpes', 'highjinks', 'homework', 'information',
      'mackerel', 'mews', 'money', 'news', 'rice', 'rabies', 'salmon', 'series',
      'sheep', 'shrimp', 'species', 'swine', 'tennis', 'trout', 'tuna', 'whiting', 'wildebeest'
    ]

    this.customPluralForms = []
    this.customSingularForms = []
    this.singularForms = new FormSet()
    this.pluralForms = new FormSet()

    // this.attach = attach

    this.addIrregular('child', 'children')
    this.addIrregular('man', 'men')
    this.addIrregular('person', 'people')
    this.addIrregular('sex', 'sexes')
    this.addIrregular('mouse', 'mice')
    this.addIrregular('ox', 'oxen')
    this.addIrregular('foot', 'feet')
    this.addIrregular('tooth', 'teeth')
    this.addIrregular('goose', 'geese')
    this.addIrregular('ephemeris', 'ephemerides')
    this.addIrregular('cloth', 'clothes')
    this.addIrregular('hero', 'heroes')
    this.addIrregular('torso', 'torsi')

    // see if it is possible to unify the creation of both the singular and
    // plural regexes or maybe even just have one list. with a complete list
    // of rules it may only be possible for some regular forms, but worth a shot
    this.pluralForms.regularForms.push([/([aeiou]y)$/i, '$1s'])
    this.pluralForms.regularForms.push([/y$/i, 'ies'])
    this.pluralForms.regularForms.push([/ife$/i, 'ives'])
    this.pluralForms.regularForms.push([/(antenn|formul|nebul|vertebr|vit)a$/i, '$1ae'])
    this.pluralForms.regularForms.push([/(octop|vir|radi|nucle|fung|cact|stimul|alumn|calcul|hippopotam|macrofung|phoet|syllab|troph)us$/i, '$1i'])
    this.pluralForms.regularForms.push([/(buffal|tomat|tornad)o$/i, '$1oes'])
    this.pluralForms.regularForms.push([/(sis)$/i, 'ses'])
    this.pluralForms.regularForms.push([/(matr|vert|ind|cort)(ix|ex)$/i, '$1ices'])
    this.pluralForms.regularForms.push([/sses$/i, 'sses'])
    this.pluralForms.regularForms.push([/(x|ch|ss|sh|s|z)$/i, '$1es'])
    this.pluralForms.regularForms.push([/^(?!talis|.*hu)(.*)man$/i, '$1men'])
    this.pluralForms.regularForms.push([/(.*)/i, '$1s'])

    // Words ending in -ff or -ffe you just add s to make the plural.
    // Sheriffs | Giraffes
    // this.pluralForms.regularForms.push([/(.+ffe?)$/i, '$1s'])

    // words ending in f that just add s:
    // roof - roofs
    // chief - chiefs
    // oaf -oafs
    // this.pluralForms.regularForms.push([/([^f]+f)$/i, '$1s'])

    // Example of words using the -f / -fe to -ves rule
    // leaf - leaves
    // wolf - wolves
    // calf - calves
    // half - halves
    // knife - knives
    // loaf - loaves
    // life - lives
    // wife - wives
    // shelf - shelves
    // thief - thieves
    // yourself - yourselves
    this.addIrregular('leaf', 'leaves')
    this.addIrregular('wolf', 'wolves')
    this.addIrregular('calf', 'calves')
    this.addIrregular('half', 'halves')
    this.addIrregular('knife', 'knives')
    this.addIrregular('loaf', 'loaves')
    this.addIrregular('life', 'lives')
    this.addIrregular('wife', 'wives')
    this.addIrregular('shelf', 'shelves')
    this.addIrregular('thief', 'thieves')
    this.addIrregular('yourself', 'yourselves')

    // Some words have multiple valid plural forms endings with -ves or -s:
    // scarf - scarfs/scarves
    // dwarf - dwarfs / dwarves
    // wharf - wharfs / wharves
    // handkerchief - handkerchiefs / handkerchieves
    // this.pluralForms.regularForms.push([/(.*r)f/i, '$1ves'])

    // Singular inflections

    // Some words have multiple valid plural forms endings with -ves or -s:
    // scarf - scarfs/scarves
    // dwarf - dwarfs / dwarves
    // wharf - wharfs / wharves
    // handkerchief - handkerchiefs / handkerchieves
    this.singularForms.regularForms.push([/(.*)ves$/i, '$1f'])

    // expenses - expense
    // defenses - defense
    this.singularForms.regularForms.push([/(.*)nses$/i, '$1nse'])

    this.singularForms.regularForms.push([/([^v])ies$/i, '$1y'])
    this.singularForms.regularForms.push([/ives$/i, 'ife'])
    this.singularForms.regularForms.push([/(antenn|formul|nebul|vertebr|vit)ae$/i, '$1a'])
    this.singularForms.regularForms.push([/(octop|vir|radi|nucle|fung|cact|stimul|alumn|calcul|hippopotam|macrofung|phoet|syllab|troph)(i)$/i, '$1us'])
    this.singularForms.regularForms.push([/(buffal|tomat|tornad)(oes)$/i, '$1o'])
    this.singularForms.regularForms.push([/(analy|naly|synop|parenthe|diagno|the)ses$/i, '$1sis'])
    this.singularForms.regularForms.push([/(vert|ind|cort)(ices)$/i, '$1ex'])
    // our pluralizer won''t cause this form of appendix (appendicies)
    // but we should handle it
    this.singularForms.regularForms.push([/(matr|append)(ices)$/i, '$1ix'])
    this.singularForms.regularForms.push([/(x|ch|ss|sh|s|z)es$/i, '$1'])
    this.singularForms.regularForms.push([/men$/i, 'man'])
    this.singularForms.regularForms.push([/ss$/i, 'ss'])
    this.singularForms.regularForms.push([/s$/i, ''])

    this.pluralize = function (token) {
      return this.ize(token, this.pluralForms, this.customPluralForms)
    }

    this.singularize = function (token) {
      return this.ize(token, this.singularForms, this.customSingularForms)
    }
  }
}

module.exports = NounInflector
