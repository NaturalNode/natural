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

import { NounInflector } from 'lib/natural'
const inflector = new NounInflector()

describe('noun inflector', function () {
  describe('singularization', function () {
    it('should drop an S by default', function () {
      expect(inflector.singularize('rrrs')).toBe('rrr')
      expect(inflector.singularize('hackers')).toBe('hacker')
      expect(inflector.singularize('movies')).toBe('movie')

      // MAN cases that don't pluralize to MEN
      expect(inflector.singularize('talismans')).toBe('talisman')
      expect(inflector.singularize('humans')).toBe('human')
      expect(inflector.singularize('prehumans')).toBe('prehuman')
    })

    it('should handle ambiguous form', function () {
      expect(inflector.singularize('deer')).toBe('deer')
      expect(inflector.singularize('fish')).toBe('fish')
      expect(inflector.singularize('series')).toBe('series')
      expect(inflector.singularize('sheep')).toBe('sheep')
      expect(inflector.singularize('trout')).toBe('trout')
    })

    it('should convert plurals ending SES to S', function () {
      expect(inflector.singularize('statuses')).toBe('status')
      expect(inflector.singularize('buses')).toBe('bus')
    })

    it('should match irregulars', function () {
      expect(inflector.singularize('people')).toBe('person')
      expect(inflector.singularize('children')).toBe('child')
      expect(inflector.singularize('oxen')).toBe('ox')
      expect(inflector.singularize('clothes')).toBe('cloth')
      expect(inflector.singularize('heroes')).toBe('hero')
      expect(inflector.singularize('torsi')).toBe('torso')
    })

    it('should handle IX cases', function () {
      expect(inflector.singularize('matrices')).toBe('matrix')
      expect(inflector.singularize('indices')).toBe('index')
      expect(inflector.singularize('cortices')).toBe('cortex')

      // our pluralizer won''t cause this form of appendix (appendicies)
      // but we should handle it
      expect(inflector.singularize('appendices')).toBe('appendix')
    })

    it('should regulars to ES', function () {
      expect(inflector.singularize('churches')).toBe('church')
      expect(inflector.singularize('appendixes')).toBe('appendix')
      expect(inflector.singularize('messes')).toBe('mess')
      expect(inflector.singularize('quizes')).toBe('quiz')
      expect(inflector.singularize('shoes')).toBe('shoe')
      expect(inflector.singularize('funguses')).toBe('fungus')
    })

    it('should handle SIS cases', function () {
      expect(inflector.singularize('synopses')).toBe('synopsis')
      expect(inflector.singularize('parentheses')).toBe('parenthesis')
    })

    it('should handle special OES cases', function () {
      expect(inflector.singularize('tomatoes')).toBe('tomato')
    })

    it('should handle I cases', function () {
      expect(inflector.singularize('octopi')).toBe('octopus')
      expect(inflector.singularize('stimuli')).toBe('stimulus')
      expect(inflector.singularize('radii')).toBe('radius')
      expect(inflector.singularize('nuclei')).toBe('nucleus')
      expect(inflector.singularize('fungi')).toBe('fungus')
      expect(inflector.singularize('cacti')).toBe('cactus')
      expect(inflector.singularize('alumni')).toBe('alumnus')
      expect(inflector.singularize('calculi')).toBe('calculus')
      expect(inflector.singularize('hippopotami')).toBe('hippopotamus')
      expect(inflector.singularize('macrofungi')).toBe('macrofungus')
      expect(inflector.singularize('phoeti')).toBe('phoetus')
      expect(inflector.singularize('syllabi')).toBe('syllabus')
      expect(inflector.singularize('trophi')).toBe('trophus')
    })

    it('should handle IVES cases', function () {
      expect(inflector.singularize('lives')).toBe('life')
      expect(inflector.singularize('knives')).toBe('knife')
    })

    it('should handle Y cases', function () {
      expect(inflector.singularize('parties')).toBe('party')
      expect(inflector.singularize('flies')).toBe('fly')
      expect(inflector.singularize('victories')).toBe('victory')
      expect(inflector.singularize('monstrosities')).toBe('monstrosity')
    })

    it('should handle SS cases', function () {
      expect(inflector.singularize('dresses')).toBe('dress')
      expect(inflector.singularize('dress')).toBe('dress')
      expect(inflector.singularize('messes')).toBe('mess')
    })

    it('should handle MAN->MAN cases', function () {
      expect(inflector.singularize('men')).toBe('man')
      expect(inflector.singularize('women')).toBe('woman')
      expect(inflector.singularize('workmen')).toBe('workman')
      expect(inflector.singularize('riflemen')).toBe('rifleman')
    })

    it('should handle irregular cases', function () {
      expect(inflector.singularize('feet')).toBe('foot')
      expect(inflector.singularize('geese')).toBe('goose')
      expect(inflector.singularize('teeth')).toBe('tooth')
      expect(inflector.singularize('ephemerides')).toBe('ephemeris')
    })

    it('should handle AE cases', function () {
      expect(inflector.singularize('antennae')).toBe('antenna')
      expect(inflector.singularize('formulae')).toBe('formula')
      expect(inflector.singularize('nebulae')).toBe('nebula')
      expect(inflector.singularize('vertebrae')).toBe('vertebra')
      expect(inflector.singularize('vitae')).toBe('vita')
    })

    it('should allow AE cases to be S', function () {
      expect(inflector.singularize('antennas')).toBe('antenna')
      expect(inflector.singularize('formulas')).toBe('formula')
    })
  })

  describe('pluralization', function () {
    it('should append an S by default', function () {
      expect(inflector.pluralize('rrr')).toBe('rrrs')
      expect(inflector.pluralize('hacker')).toBe('hackers')
      expect(inflector.pluralize('movie')).toBe('movies')
    })

    it('should handle ambiguous form', function () {
      expect(inflector.pluralize('deer')).toBe('deer')
      expect(inflector.pluralize('fish')).toBe('fish')
      expect(inflector.pluralize('series')).toBe('series')
      expect(inflector.pluralize('sheep')).toBe('sheep')
      expect(inflector.pluralize('trout')).toBe('trout')
    })

    it('should convert singulars ending s to ses', function () {
      expect(inflector.pluralize('status')).toBe('statuses')
      expect(inflector.pluralize('bus')).toBe('buses')
    })

    it('should match irregulars', function () {
      expect(inflector.pluralize('person')).toBe('people')
      expect(inflector.pluralize('child')).toBe('children')
      expect(inflector.pluralize('ox')).toBe('oxen')
    })

    it('should maintain case of irregulars', function () {
      expect(inflector.pluralize('OX')).toBe('OXEN')
      expect(inflector.pluralize('Person')).toBe('People')
      expect(inflector.pluralize('child')).toBe('children')
      expect(inflector.pluralize('cloth')).toBe('clothes')
    })

    it('should handle IX cases', function () {
      expect(inflector.pluralize('matrix')).toBe('matrices')
      expect(inflector.pluralize('index')).toBe('indices')
      expect(inflector.pluralize('cortex')).toBe('cortices')
    })

    it('should regulars to ES', function () {
      expect(inflector.pluralize('church')).toBe('churches')
      expect(inflector.pluralize('appendix')).toBe('appendixes')
      expect(inflector.pluralize('mess')).toBe('messes')
      expect(inflector.pluralize('quiz')).toBe('quizes')
      expect(inflector.pluralize('shoe')).toBe('shoes')
    })

    it('should handle SIS cases', function () {
      expect(inflector.pluralize('synopsis')).toBe('synopses')
      expect(inflector.pluralize('parenthesis')).toBe('parentheses')
    })

    it('should handle special OES cases', function () {
      expect(inflector.pluralize('tomato')).toBe('tomatoes')
      expect(inflector.pluralize('buffalo')).toBe('buffaloes')
      expect(inflector.pluralize('tornado')).toBe('tornadoes')
    })

    it('should handle I cases', function () {
      expect(inflector.pluralize('radius')).toBe('radii')
      expect(inflector.pluralize('octopus')).toBe('octopi')
      expect(inflector.pluralize('stimulus')).toBe('stimuli')
      expect(inflector.pluralize('nucleus')).toBe('nuclei')
      expect(inflector.pluralize('fungus')).toBe('fungi')
      expect(inflector.pluralize('cactus')).toBe('cacti')
    })

    it('should handle IVES cases', function () {
      expect(inflector.pluralize('knife')).toBe('knives')
      expect(inflector.pluralize('life')).toBe('lives')
    })

    it('should handle Y cases', function () {
      expect(inflector.pluralize('party')).toBe('parties')
      expect(inflector.pluralize('fly')).toBe('flies')
      expect(inflector.pluralize('victory')).toBe('victories')
      expect(inflector.pluralize('monstrosity')).toBe('monstrosities')
    })

    it('should handle [aeiou]Y cases', function () {
      expect(inflector.pluralize('day')).toBe('days')
      expect(inflector.pluralize('toy')).toBe('toys')
      expect(inflector.pluralize('journey')).toBe('journeys')
    })

    it('should handle SS cases', function () {
      expect(inflector.pluralize('dress')).toBe('dresses')
      expect(inflector.pluralize('dresses')).toBe('dresses')
      expect(inflector.pluralize('mess')).toBe('messes')
    })

    it('should handle MAN->MEN cases', function () {
      expect(inflector.pluralize('man')).toBe('men')
      expect(inflector.pluralize('woman')).toBe('women')
      expect(inflector.pluralize('workman')).toBe('workmen')
      expect(inflector.pluralize('rifleman')).toBe('riflemen')
    })

    it('should handle irregular cases', function () {
      expect(inflector.pluralize('foot')).toBe('feet')
      expect(inflector.pluralize('goose')).toBe('geese')
      expect(inflector.pluralize('tooth')).toBe('teeth')
      expect(inflector.pluralize('ephemeris')).toBe('ephemerides')

      // MAN cases that don't pluralize to MEN
      expect(inflector.pluralize('talisman')).toBe('talismans')
      expect(inflector.pluralize('human')).toBe('humans')
      expect(inflector.pluralize('prehuman')).toBe('prehumans')
    })

    it('should handle AE cases', function () {
      expect(inflector.pluralize('antenna')).toBe('antennae')
      expect(inflector.pluralize('formula')).toBe('formulae')
      expect(inflector.pluralize('nebula')).toBe('nebulae')
      expect(inflector.pluralize('vertebra')).toBe('vertebrae')
      expect(inflector.pluralize('vita')).toBe('vitae')
    })
  })

  it('should pluralize and singularize string from patch', function () {
    expect(inflector.pluralize('synopsis')).toBe('synopses')
    expect(inflector.singularize('synopses')).toBe('synopsis')
    expect(inflector.pluralize('mess')).toBe('messes')
    expect(inflector.singularize('messes')).toBe('mess')
  })

  describe('custom inflections', function () {
    it('should pluralize and singularize custom forms', function () {
      const myInflector = new NounInflector()
      myInflector.addPlural(/(code|ware)/i, '$1z')
      myInflector.addSingular(/(code|ware)z/i, '$1')
      expect(myInflector.pluralize('code')).toBe('codez')
      expect(myInflector.pluralize('ware')).toBe('warez')
      expect(myInflector.singularize('codez')).toBe('code')
      expect(myInflector.singularize('warez')).toBe('ware')
    })

    it('should not break regular forms', function () {
      const myInflector = new NounInflector()
      myInflector.addPlural(/(code|ware)/i, '$1z')
      myInflector.addSingular(/(code|ware)z/i, '$1')
      expect(myInflector.pluralize('bus')).toBe('buses')
      expect(myInflector.singularize('buses')).toBe('bus')
    })
  })

  describe('should handle words ending in f, ff, ffe', function () {
    it('should handle words ending in ff and ffe', function () {
      const myInflector = new NounInflector()
      expect(myInflector.pluralize('sherriff')).toBe('sherriffs')
      expect(myInflector.pluralize('giraffe')).toBe('giraffes')
      expect(myInflector.singularize('sherriffs')).toBe('sherriff')
      expect(myInflector.singularize('giraffes')).toBe('giraffe')
    })

    it('should handle words ending in f', function () {
      const myInflector = new NounInflector()
      expect(myInflector.pluralize('roof')).toBe('roofs')
      expect(myInflector.pluralize('chief')).toBe('chiefs')
      expect(myInflector.pluralize('oaf')).toBe('oafs')
      expect(myInflector.singularize('roofs')).toBe('roof')
      expect(myInflector.singularize('chiefs')).toBe('chief')
      expect(myInflector.singularize('oafs')).toBe('oaf')
    })

    it('should handle words ending in f or fe', function () {
      const myInflector = new NounInflector()
      expect(myInflector.pluralize('leaf')).toBe('leaves')
      expect(myInflector.pluralize('wolf')).toBe('wolves')
      expect(myInflector.pluralize('calf')).toBe('calves')
      expect(myInflector.pluralize('half')).toBe('halves')
      expect(myInflector.pluralize('knife')).toBe('knives')
      expect(myInflector.pluralize('loaf')).toBe('loaves')
      expect(myInflector.pluralize('life')).toBe('lives')
      expect(myInflector.pluralize('wife')).toBe('wives')
      expect(myInflector.pluralize('shelf')).toBe('shelves')
      expect(myInflector.pluralize('thief')).toBe('thieves')
      expect(myInflector.pluralize('yourself')).toBe('yourselves')

      expect(myInflector.singularize('leaves')).toBe('leaf')
      expect(myInflector.singularize('wolves')).toBe('wolf')
      expect(myInflector.singularize('calves')).toBe('calf')
      expect(myInflector.singularize('halves')).toBe('half')
      expect(myInflector.singularize('knives')).toBe('knife')
      expect(myInflector.singularize('loaves')).toBe('loaf')
      expect(myInflector.singularize('lives')).toBe('life')
      expect(myInflector.singularize('wives')).toBe('wife')
      expect(myInflector.singularize('shelves')).toBe('shelf')
      expect(myInflector.singularize('thieves')).toBe('thief')
      expect(myInflector.singularize('yourselves')).toBe('yourself')
    })

    it('should handle words ending in rf', function () {
      const myInflector = new NounInflector()
      expect(myInflector.pluralize('scarf')).toBe('scarfs')
      expect(myInflector.pluralize('dwarf')).toBe('dwarfs')
      expect(myInflector.pluralize('handkerchief')).toBe('handkerchiefs')
      expect(myInflector.pluralize('wharf')).toBe('wharfs')
      expect(myInflector.singularize('scarfs')).toBe('scarf')
      expect(myInflector.singularize('dwarfs')).toBe('dwarf')
      expect(myInflector.singularize('wharfs')).toBe('wharf')
      expect(myInflector.singularize('handkerchiefs')).toBe('handkerchief')
      expect(myInflector.singularize('scarves')).toBe('scarf')
      expect(myInflector.singularize('dwarves')).toBe('dwarf')
      expect(myInflector.singularize('wharves')).toBe('wharf')
      expect(myInflector.singularize('handkerchieves')).toBe('handkerchief')
    })

    it('should handle words ending in rf (ves case)', function () {
      const myInflector = new NounInflector()
      expect(myInflector.singularize('expenses')).toBe('expense')
      expect(myInflector.singularize('defenses')).toBe('defense')
      expect(myInflector.pluralize('expense')).toBe('expenses')
      expect(myInflector.pluralize('defense')).toBe('defenses')
    })
  })
})
