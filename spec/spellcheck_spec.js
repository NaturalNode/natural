'use strict'

const Spellcheck = require('../lib/natural/spellcheck/spellcheck.js')

describe('spellcheck', function () {
  describe('distance 1 corrections', function () {
    const spellcheck = new Spellcheck(['something'])

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

    it('should compute insertions', function () {
      const insertions = ['xab', 'axb', 'abx']
      for (const i in insertions) {
        expect(edits.indexOf(insertions[i])).toBeGreaterThan(-1)
      }
    })
    it('should compute deletions', function () {
      const deletions = ['a', 'b']
      for (const i in deletions) {
        expect(edits.indexOf(deletions[i])).toBeGreaterThan(-1)
      }
    })
    it('should compute transpositions', function () {
      const transpositions = ['ba']
      for (const i in transpositions) {
        expect(edits.indexOf(transpositions[i])).toBeGreaterThan(-1)
      }
    })
    it('should compute replacements', function () {
      const replacements = ['zb', 'af']
      for (const i in replacements) {
        expect(edits.indexOf(replacements[i])).toBeGreaterThan(-1)
      }
    })
  })

  describe('edits up to distance', function () {
    const spellcheck = new Spellcheck([])

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
