import {
  NounInflector,
  CountInflector,
  PresentVerbInflector
} from '../lib/natural/inflectors'

// Inflectors
const nounInflector = new NounInflector()
console.log(nounInflector.pluralize('radius'))
console.log(nounInflector.singularize('beers'))
const countInflector = CountInflector
console.log(countInflector.nth(1))
console.log(countInflector.nth(111))
const verbInflector = new PresentVerbInflector()
console.log(verbInflector.singularize('become'))
console.log(verbInflector.pluralize('becomes'))
