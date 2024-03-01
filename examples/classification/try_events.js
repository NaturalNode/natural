const natural = require('../../lib/natural')
const PorterStemmerEs = require('../../lib/natural/stemmers/porter_stemmer_es')
const classifier = new natural.LogisticRegressionClassifier(PorterStemmerEs)

classifier.addDocument('ranchero golpe', 'Huevos')
classifier.addDocument('bbq', 'Huevos')
classifier.addDocument('salchichas ranchero', 'Tortas')

classifier.on('trainedWithDocument', (v) => console.log(v))
classifier.on('doneTraining', (v) => console.log(v))
classifier.train()

classifier.save('classifier.json', (err) => console.log(err))
