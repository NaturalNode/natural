import {
  JaroWinklerDistance,
  LevenshteinDistance,
  DamerauLevenshteinDistance,
  DiceCoefficient
} from '../lib/natural/distance'

// String Distance
console.log(JaroWinklerDistance('dixon', 'dicksonx', {}));
console.log(JaroWinklerDistance('not', 'same', {}));

console.log(LevenshteinDistance('ones', 'onez'));
console.log(LevenshteinDistance('one', 'one'));

console.log(
    LevenshteinDistance('ones', 'onez', {
        insertion_cost: 1,
        deletion_cost: 1,
        substitution_cost: 1,
    }),
);
// $ExpectType SubstringDistanceResult
DamerauLevenshteinDistance('ones', 'onez', { search: true });
// $ExpectType number
DamerauLevenshteinDistance('ones', 'onez', { search: false });
// $ExpectType number
DamerauLevenshteinDistance('ones', 'onez');
// $ExpectType number | SubstringDistanceResult
DamerauLevenshteinDistance('ones', 'onez', { search: Math.random() > 0.5 });

console.log(DiceCoefficient('thing', 'thing'));
console.log(DiceCoefficient('not', 'same'));
