/*
Copyright (c) 2011

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

import { Spellcheck } from 'lib/natural'

describe('spellcheck', function () {
  describe('distance 1 corrections', function () {
    const spellcheck = new Spellcheck(['something'])

    it('returns equal-frequency corrections in edit order', function () {
      expect(new Spellcheck(['cat', 'bat', 'rat']).getCorrections('at')).toEqual(['bat', 'cat', 'rat'])
    })

    it('should fix deletions', function () {
      expect(spellcheck.getCorrections('smething')).toContain('something')
    })
    it('should fix insertions', function () {
      expect(spellcheck.getCorrections('somethhing')).toContain('something')
    })
    it('should fix transpositions', function () {
      expect(spellcheck.getCorrections('somehting')).toContain('something')
    })
    it('should fix replacements', function () {
      expect(spellcheck.getCorrections('sometzing')).toContain('something')
    })
  })

  describe('distance 2 corrections', function () {
    const spellcheck = new Spellcheck(['something'])

    it('should fix a deletion then a transposition', function () {
      expect(spellcheck.getCorrections('smtehing', 2)).toContain('something')
    })
  })

  describe('edits', function () {
    const spellcheck = new Spellcheck([])
    const edits = spellcheck.edits('ab')

    it('keeps the first occurrence of each edit in order', function () {
      expect(spellcheck.edits('a').slice(0, 5)).toEqual(['aa', 'ba', 'ca', 'da', 'ea'])
      expect(spellcheck.edits('a').filter(edit => edit === 'aa')).toEqual(['aa'])
    })

    it('should compute insertions', function () {
      const insertions = ['xab', 'axb', 'abx']
      insertions.forEach(insertion => {
        expect(edits.indexOf(insertion)).toBeGreaterThan(-1)
      })
    })
    it('should compute deletions', function () {
      const deletions = ['a', 'b']
      deletions.forEach(deletion => {
        expect(edits.indexOf(deletion)).toBeGreaterThan(-1)
      })
    })
    it('should compute transpositions', function () {
      const transpositions = ['ba']
      transpositions.forEach(transposition => {
        expect(edits.indexOf(transposition)).toBeGreaterThan(-1)
      })
    })
    it('should compute replacements', function () {
      const replacements = ['zb', 'af']
      replacements.forEach(replacement => {
        expect(edits.indexOf(replacement)).toBeGreaterThan(-1)
      })
    })
  })

  describe('edits up to distance', function () {
    const spellcheck = new Spellcheck([])

    it('keeps depth and word order while retaining duplicates between parents', function () {
      const edits = spellcheck.editsWithMaxDistance('a', 2) as unknown as string[][]
      expect(edits[0]).toEqual(['a'])
      expect(edits[1].slice(0, 3)).toEqual(['aa', 'ba', 'ca'])
      expect(edits[2].slice(0, 3)).toEqual(spellcheck.edits('aa').slice(0, 3))
      expect(edits[2].filter(edit => edit === 'a').length).toBeGreaterThan(1)
    })

    it('should correctly compute edits at distance', function () {
      const edits = spellcheck.editsWithMaxDistance('abc', 2)
      expect(edits[1].indexOf('abzc')).toBeGreaterThan(-1) // 1 insertion
      expect(edits[2].indexOf('a')).toBeGreaterThan(-1) // 2 deletions
    })
  })

  describe('boolean spellcheck', function () {
    const spellcheck = new Spellcheck(['cat'])

    it('should consider cat a word', function () {
      expect(spellcheck.isCorrect('cat')).toBe(true)
    })

    it('should not consider dog a word', function () {
      expect(spellcheck.isCorrect('dog')).toBe(false)
    })
  })

  describe('special cases', function () {
    const spellcheck = new Spellcheck(['cat'])

    it('should return the input word as the most probable correction if it is already correct', function () {
      expect(spellcheck.getCorrections('cat').indexOf('cat')).toBe(0)
    })
  })
})
