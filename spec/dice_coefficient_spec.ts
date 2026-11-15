'use strict'

import { DiceCoefficient as dice } from 'lib/natural'
import text1 from '../spec/test_data/Wikipedia_EN_FrenchRevolution.json'
import text2 from '../spec/test_data/Wikipedia_EN_InfluenceOfTheFrenchRevolution.json'

describe('dice', function () {
  it('should handle exact matches', function () {
    expect(dice('john', 'john')).toBe(1)
  })

  it('should treat two empty strings as an exact match', function () {
    expect(dice('', '')).toBe(1)
  })

  it('should treat whitespace-only strings as an exact match', function () {
    expect(dice(' \t\n', '\r\n')).toBe(1)
  })

  it('should match an empty string with a whitespace-only string', function () {
    expect(dice('', ' \t\n')).toBe(1)
    expect(dice(' \t\n', '')).toBe(1)
  })

  it('should not match empty input with a single character', function () {
    expect(dice('', 'a')).toBe(0)
    expect(dice('a', '')).toBe(0)
  })

  it('should not match whitespace-only input with a word', function () {
    expect(dice(' \t\n', 'word')).toBe(0)
    expect(dice('word', ' \t\n')).toBe(0)
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
