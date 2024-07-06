/*
Copyright (c) 2024, Hugo W.L. ter Doest

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

require('dotenv').config()
const mongoose = require('mongoose')
const mongoDBConnectionString = 'mongodb://' + process.env.MONGO_HOST + ':' +
  process.env.MONGO_PORT + '/' + process.env.MONGO_DATABASE
const objectModelName = process.env.MONGO_OBJECTMODEL

class MongoDBPlugin {
  constructor () {
    mongoose.connect(mongoDBConnectionString, {})

    if (!mongoose.models[objectModelName]) {
      // We do not enforce a schema with MongoDB
      this.ObjectModel = mongoose.model(objectModelName, new mongoose.Schema({},
        { strict: false, versionKey: false }))
    } else {
      this.ObjectModel = mongoose.models[objectModelName]
    }
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
