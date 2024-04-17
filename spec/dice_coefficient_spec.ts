'use strict'

import { DiceCoefficient as dice } from 'lib/natural'
import text1 from '../spec/test_data/Wikipedia_EN_FrenchRevolution.json'
import text2 from '../spec/test_data/Wikipedia_EN_InfluenceOfTheFrenchRevolution.json'

describe('dice', function () {
  it('should handle exact matches', function () {
    expect(dice('john', 'john')).toBe(1)
  })

  it('should match single character words', function () {
    expect(dice('a', 'a')).toBe(1)
    expect(dice('a', 'b')).toBe(0)
  })

  it('should handle total mis-matches', function () {
    expect(dice('john', 'matt')).toBe(0)
  })

  // Example from http://en.wikipedia.org/wiki/Dice's_coefficient
  it('should handle a typical case', function () {
    expect(dice('night', 'nacht')).toBe(0.25)
  })

  it('should sanitize case', function () {
    expect(dice('night', 'NIGHT')).toBe(1)
  })

  it('should sanitize spacing', function () {
    expect(dice('the   space', 'the space')).toBe(1)
  })

  it('should compare complete texts', function () {
    expect(dice(text1.text, text2.text)).toBe(0.7939374395356337)
  })
})
