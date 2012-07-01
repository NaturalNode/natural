var dice = require('lib/natural/distance/dice_coefficient');

describe('dice', function () {

  it('should handle exact matches', function () {
    expect(dice('john', 'john')).toBe(1);
  });

  it('should handle total mis-matches', function () {
    expect(dice('john', 'matt')).toBe(0);
  });

  // Example from http://en.wikipedia.org/wiki/Dice's_coefficient
  it('should handle a typical case', function () {
    expect(dice('night', 'nacht')).toBe(0.25);
  });

  it('should sanitize case', function () {
    expect(dice('night', 'NIGHT')).toBe(1);
  });

  it('should sanitize spacing', function () {
    expect(dice('the   space', 'the space')).toBe(1);
  });

});
