var natural = require('natural'),
    nounInflector = new natural.NounInflector();

plural = nounInflector.pluralize('radius');
console.log(plural);

plural = nounInflector.pluralize('beer');
console.log(plural);

singular = nounInflector.singularize('radii');
console.log(singular);

singular = nounInflector.singularize('beers');
console.log(singular);

