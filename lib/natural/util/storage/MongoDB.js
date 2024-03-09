require('dotenv').config()
const mongoose = require('mongoose')
const mongoDBConnectionString = 'mongodb://' + process.env.MONGO_HOST + ':' +
  process.env.MONGO_PORT + '/' + process.env.MONGO_DATABASE

class MongoDBPlugin {
  constructor () {
    mongoose.connect(mongoDBConnectionString, {})
    // We do not enforce a schema with MongoDB
    this.ObjectModel = mongoose.model('ObjectModel', new mongoose.Schema({},
      { strict: false, versionKey: false }))
  }

  async store (object, options) {
    // To make sure the payload is stored as a whole and nog merged with the id object
    const objectToStore = { naturalObject: object }
    const storedObject = await this.ObjectModel.create(objectToStore)
    return storedObject._id
  }

  async retrieve (key, options) {
    const retrievedObject = await this.ObjectModel.findById(key)
    return retrievedObject.naturalObject
  }
}

module.exports = MongoDBPlugin
