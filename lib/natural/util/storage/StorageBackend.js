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

const PostgresPlugin = require('./Postgres')
const MongoDBPlugin = require('./MongoDB')
const RedisPlugin = require('./Redis')
const MemcachedPlugin = require('./Memcached')
const FilePlugin = require('./File')

// Enum for different types of storage backends that can be used
const STORAGE_TYPES = {
  POSTGRES: 'POSTGRES',
  REDIS: 'REDIS',
  MONGODB: 'MONGODB',
  MEMCACHED: 'MEMCACHED',
  FILE: 'FILE'
}

// Standard behaviour of the backend is:
// - Javascript in and out, so JSON.stringify and JSON.parse is done here.
// - A key is returned after storing an object.
// - The key is determined by the storage method, if possible: MongoDB and Postgres can do this.
//   If not, a uuid is created.
// - File-based storage is no different: a uuid is created and used as filename: uuid.json
class StorageBackend {
  constructor (storageType, options) {
    if (storageType) {
      this.setStorageType(storageType, options)
    }
  }

  // Sets the storage type. Valid values are POSTGRES, REDIS, MONGODB, MEMCACHED, FILE
  async setStorageType (storageType) {
    if (!storageType) {
      throw new Error('No storage type specified')
    }
    if (this.storageType) {
      throw new Error('Storage type already set')
    }
    this.storageType = storageType
    switch (storageType) {
      case STORAGE_TYPES.POSTGRES:
        this.client = new PostgresPlugin()
        await this.client.configPostgres()
        break
      case STORAGE_TYPES.REDIS:
        this.client = new RedisPlugin()
        break
      case STORAGE_TYPES.MONGODB:
        this.client = new MongoDBPlugin()
        break
      case STORAGE_TYPES.MEMCACHED:
        this.client = new MemcachedPlugin()
        break
      case STORAGE_TYPES.FILE:
        this.client = new FilePlugin()
        break
      default:
        throw new Error('Invalid storage type')
    }
  }

  // Stores value to the selected storage type.
  async store (object) {
    if (this.storageType && this.client) {
      return await this.client.store(object)
    } else {
      throw new Error('Storage type or client not set')
    }
  }

  async retrieve (key) {
    if (this.storageType && this.client) {
      return await this.client.retrieve(key)
    } else {
      throw new Error('Storage type or client not set')
    }
  }
}

module.exports = { StorageBackend, STORAGE_TYPES }
