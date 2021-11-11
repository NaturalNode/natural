'use strict'

const dice = require('../lib/natural/distance/dice_coefficient')

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
    const text1 = require('./test_data/Wikipedia_EN_FrenchRevolution.json').text
    const text2 = require('./test_data/Wikipedia_EN_InfluenceOfTheFrenchRevolution.json').text
    expect(dice(text1, text2)).toBe(0.7939374395356337)
  })
})
