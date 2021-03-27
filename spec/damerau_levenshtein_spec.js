'use strict'

const damerauLevenshtein = require('../lib/natural/distance/levenshtein_distance')
  .DamerauLevenshteinDistance
const damerauLevenshteinSearch = require('../lib/natural/distance/levenshtein_distance')
  .DamerauLevenshteinDistanceSearch

describe('DamerauLevenshtein', function () {
  describe('default', function () {
    it('should be 0 when given equal strings', function () {
      expect(damerauLevenshtein('test', 'test')).toBe(0)
    })

    it('should calculate 1 for adjacent transposition', function () {
      expect(damerauLevenshtein('za', 'az')).toBe(1)
      expect(damerauLevenshtein('Tomato', 'oTmato')).toBe(1)
    })

    it('should handle custom transposition_cost', function () {
      expect(damerauLevenshtein('za', 'az', { transposition_cost: 0 })).toBe(0)
    })

    it('should calculate 2 when there are 2 transpositions', function () {
      expect(damerauLevenshtein('tomato', 'otmaot')).toBe(2)
    })

    it('should calculate 2 for 1 transposition and 1 insertion', function () {
      expect(damerauLevenshtein('CA', 'ABC')).toBe(2)
      expect(damerauLevenshtein('a cat', 'a abct')).toBe(2)
    })
  })

  describe('options.restricted = true', function () {
    const restricted = { restricted: true }
    it('should calculate 0 for equal strings', function () {
      expect(damerauLevenshtein('identity', 'identity', restricted)).toBe(0)
    })
    it('should calculate 1 for an adjacent transposition', function () {
      expect(damerauLevenshtein('za', 'az', restricted)).toBe(1)
    })
    it('should not count transposition more than 1 char away', function () {
      expect(damerauLevenshtein('CA', 'ABC', restricted)).toBe(3)
    })
  })

  it('should combine search with Damerau', function () {
    const source = 'The RainCoat BookStore';
    const target = 'All the best books are here at the Rain Coats Book Store';
    const result = damerauLevenshteinSearch(source, target)
    expect(result).toEqual({
      substring: 'the Rain Coats Book Store',
      distance: 4,
      offset: 31
    })
  })

})
