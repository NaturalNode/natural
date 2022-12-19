import { BayesClassifier } from '../lib/natural/classifiers'

let classifier = new BayesClassifier()

classifier.addDocument('i am long qqqq', 'buy')
classifier.addDocument("buy the q's", 'buy')
classifier.addDocument('short gold', 'sell')
classifier.addDocument('sell gold', 'sell')

classifier.train()
console.log(classifier.classify('i am short silver'))
console.log(classifier.classify('i am long copper'))
const classifications = classifier.getClassifications('i am long copper')
classifications.forEach(function (classification) {
  const label = classification.label
  const value = classification.value
  console.log('label: ' + label + ', value: ' + value.toString())
})
classifier.addDocument(['sell', 'gold'], 'sell')
classifier.events.on('trainedWithDocument', function (obj: any) {
  console.log(obj)
})

classifier.save('classifier.json', function (err: any, classifier: BayesClassifier) {
  // the classifier is saved to the classifier.json file!
  console.log('The classifier is saved to the classifier.json file!')
  BayesClassifier.load('classifier.json', null, function (err: any, classifier: BayesClassifier) {
    if (err) {
      console.log(err)
    }
    else {
      console.log(classifier.classify('long SUNW'))
      console.log(classifier.classify('short SUNW'))
    }
  })
})

classifier = new BayesClassifier()
classifier.addDocument(['sell', 'gold'], 'sell')
classifier.addDocument(['buy', 'silver'], 'buy')
classifier.train()
const raw = JSON.stringify(classifier)
const restoredClassifier = BayesClassifier.restore(JSON.parse(raw))
console.log('Restored classifier from raw JSON')
console.log(restoredClassifier.classify('i should sell that'))
