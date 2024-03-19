require('dotenv').config()
const Jasmine = require('jasmine')
const jasmine = new Jasmine()
// additional configuration or bootstrapping if needed
jasmine.loadConfigFile('spec/support/jasmine.json') // Adjust the path as necessary.
jasmine.execute()