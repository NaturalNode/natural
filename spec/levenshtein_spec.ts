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

import {
  LevenshteinDistance as levenshteinDistance,
  LevenshteinDistanceSearch as levenshteinDistanceSearch
} from 'lib/natural/distance/levenshtein_distance'

function referenceDistance (source: string, target: string, insertion: number, deletion: number, substitution: number): number {
  const matrix: number[][] = [[0]]
  for (let row = 1; row <= source.length; row++) matrix[row] = [matrix[row - 1][0] + deletion]
  for (let column = 1; column <= target.length; column++) matrix[0][column] = matrix[0][column - 1] + insertion
  for (let row = 1; row <= source.length; row++) {
    for (let column = 1; column <= target.length; column++) {
      const insert = matrix[row][column - 1] + insertion
      const remove = matrix[row - 1][column] + deletion
      const replace = source[row - 1] === target[column - 1]
        ? matrix[row - 1][column - 1]
        : matrix[row - 1][column - 1] + substitution
      matrix[row][column] = Math.min(insert, remove, replace)
    }
  }
  return matrix[source.length][target.length]
}

describe('levenshtein_distance', function () {
  describe('options.search = true', function () {
    it('should find cheapest substring', function () {
      expect(levenshteinDistanceSearch('kitten', 'sitting'))
        .toEqual({ substring: 'sittin', distance: 2, offset: 0 })
    })

    it('should find 0 cost substring in target', function () {
      expect(levenshteinDistanceSearch('doctor', 'the doctor is in'))
        .toEqual({ substring: 'doctor', distance: 0, offset: 4 })
    })

    it('should find 1 cost substring in target', function () {
      expect(levenshteinDistanceSearch('doctor', 'the doktor is in'))
        .toEqual({ substring: 'doktor', distance: 1, offset: 4 })
    })

    it('should return empty substring when that is cleapest match', function () {
      expect(levenshteinDistanceSearch('doctor', '000000000000'))
        .toEqual({ substring: '', distance: 6, offset: 0 })
    })

    it('different insertion costs should work', function () {
      // delete 10 0's at cost 1 and insert the letters for doctor at cost -1
      expect(levenshteinDistanceSearch('0000000000', 'doctor', { insertion_cost: -1 }))
        .toEqual({ substring: 'doctor', distance: 4, offset: 0 })
    })

    it('different deletion costs should work', function () {
      // delete 10 0's at cost -10
      expect(levenshteinDistanceSearch('0000000000', 'doctor', { deletion_cost: -1 }))
        .toEqual({ substring: '', distance: -10, offset: 0 })
    })
  })

  describe('default / options.search = false', function () {
    it('matches a full matrix for randomized strings and costs', function () {
      let seed = 123456789
      const random = (): number => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
        return seed / 0x100000000
      }
      const costs = [-2, -0.5, 0, 0.25, 1, 2, 4]
      const alphabet = 'abc😀'
      for (let trial = 0; trial < 600; trial++) {
        let source = ''
        let target = ''
        for (let i = 0, length = Math.floor(random() * 9); i < length; i++) source += alphabet[Math.floor(random() * alphabet.length)]
        for (let i = 0, length = Math.floor(random() * 9); i < length; i++) target += alphabet[Math.floor(random() * alphabet.length)]
        const insertion = costs[Math.floor(random() * costs.length)]
        const deletion = costs[Math.floor(random() * costs.length)]
        const substitution = costs[Math.floor(random() * costs.length)]
        expect(levenshteinDistance(source, target, {
          insertion_cost: insertion,
          deletion_cost: deletion,
          substitution_cost: substitution
        })).toBe(referenceDistance(source, target, insertion, deletion, substitution))
      }
    })

    it('handles empty and identical strings and surrogate code units', function () {
      expect(levenshteinDistance('', '')).toBe(0)
      expect(levenshteinDistance('', '😀')).toBe(2)
      expect(levenshteinDistance('😀', '')).toBe(2)
      expect(levenshteinDistance('😀', '😀')).toBe(0)
      expect(levenshteinDistance('😀', '😃')).toBe(1)
    })

    it('keeps array input on the original path', function () {
      expect(levenshteinDistance(['a', 'b'] as any, 'a')).toBe(1)
    })

    it('should replace 2', function () {
      expect(levenshteinDistance('doctor', 'doktor')).toBe(1)
    })

    it('should allow altering replacement value', function () {
      expect(levenshteinDistance('doctor', 'doktor', { substitution_cost: 1 })).toBe(1)
    })

    it('should delete 1', function () {
      expect(levenshteinDistance('doctor', 'docto')).toBe(1)
    })

    it('should insert 1', function () {
      expect(levenshteinDistance('flat', 'flats')).toBe(1)
    })

    it('should combine operations', function () {
      expect(levenshteinDistance('flad', 'flaten')).toBe(3)
      expect(levenshteinDistance('flaten', 'flad')).toBe(3)
    })

    it('should consider perfect matches 0', function () {
      expect(levenshteinDistance('one', 'one')).toBe(0)
    })

    it('different deletion cost should work', function () {
      expect(levenshteinDistance('ones', 'one', { deletion_cost: 3 })).toBe(3)
    })

    it('different insertion cost should work', function () {
      expect(levenshteinDistance('one', 'ones', { deletion_cost: 3, insertion_cost: 5 })).toBe(5)
    })

    it('delete all characters with -ve cost', function () {
      expect(levenshteinDistance('delete', '', { deletion_cost: -1 })).toBe(-6)
    })

    it('insert all characters', function () {
      expect(levenshteinDistance('', 'insert')).toBe(6)
    })
  })
})
