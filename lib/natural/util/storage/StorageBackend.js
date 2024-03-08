
const { v4: uuidv4 } = require('uuid')

// Read environment variables from ~/.env
require('dotenv').config()

// Import libraries for different storage backends
const fs = require('fs').promises
const path = process.env.FS_PATH

const PostgresPlugin = require('./Postgres')

const mongoose = require('mongoose')
const mongoDBConnectionString = 'mongodb://' + process.env.MONGO_HOST + ':' +
  process.env.MONGO_PORT + '/' + process.env.MONGO_DATABASE

const redis = require('redis')
const redisConnectionString = 'redis://' + process.env.REDIS_HOST + ':' +
  process.env.REDIS_PORT

const memjs = require('memjs')
const memCachedConnectionString = process.env.MEM_HOST + ':' +
  process.env.MEM_PORT

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
// - If not, a key  must be passed in options.key. This holds for Redis and Memcached
// - File-based storage is different: the filename is passed by the client in options.filename.
//   It is returned after storing (like a key).
class StorageBackend {
  constructor (storageType, options) {
    if (storageType) {
      this.setStorageType(storageType, options)
    }
  }

  // Sets the storage type. Valid values are POSTGRES, REDIS, MONGODB, MEMCACHED, FILE
  async setStorageType (storageType, options) {
    if (!storageType) {
      throw new Error('No storage type specified')
    }
    if (this.storageType) {
      throw new Error('Storage type already set')
    }
    this.storageType = storageType
    switch (storageType) {
      case STORAGE_TYPES.POSTGRES:
        this.client = new PostgresPlugin(options.tableName)
        break
      case STORAGE_TYPES.REDIS:
        this.redisClient = await redis.createClient(redisConnectionString)
          .on('error', err => console.log('Redis Client Error', err))
          .connect()
        break
      case STORAGE_TYPES.MONGODB:
        mongoose.connect(mongoDBConnectionString, {})
        // We do not enforce a schema with MongoDB
        this.ObjectModel = mongoose.model('ObjectModel', new mongoose.Schema({},
          { strict: false, versionKey: false }))
        break
      case STORAGE_TYPES.MEMCACHED:
        this.memcached = memjs.Client.create(memCachedConnectionString)
        break
      case STORAGE_TYPES.FILE:
        // No action required for the file system
        break
      default:
        throw new Error('Invalid storage type')
    }
  }

  // Stores value to the selected storage type.
  async store (object, options) {
    const data = JSON.stringify(object)
    switch (this.storageType) {
      case STORAGE_TYPES.POSTGRES:
        return await this.client.store(object, options)
      case STORAGE_TYPES.REDIS: {
        const key = uuidv4()
        await this.redisClient.set(key, data)
        return key
      }
      case STORAGE_TYPES.MONGODB: {
        // To make sure the payload is stored as a whole and nog merged with the id object
        const objectToStore = { naturalObject: object }
        const storedObject = await this.ObjectModel.create(objectToStore)
        return storedObject._id
      }
      case STORAGE_TYPES.MEMCACHED: {
        const key = uuidv4()
        const isStored = await this.memcached.set(key, data, { expires: 2 })
        return isStored ? key : null
      }
      case STORAGE_TYPES.FILE:
        await fs.writeFile(path + options.filename, data)
        return (options.filename)
      default:
        throw new Error('Invalid storage type')
    }
  }

  async retrieve (key, options) {
    switch (this.storageType) {
      case STORAGE_TYPES.POSTGRES:
        return await this.client.retrieve(key, options)
      case STORAGE_TYPES.REDIS:
        return await this.redisClient.get(key)
      case STORAGE_TYPES.MONGODB: {
        const retrievedObject = await this.ObjectModel.findById(key)
        return retrievedObject.naturalObject
      }
      case STORAGE_TYPES.MEMCACHED: {
        const data1 = await this.memcached.get(key)
        return JSON.parse(data1.value.toString())
      }
      case STORAGE_TYPES.FILE: {
        const data = await fs.readFile(path + key, 'utf8')
        return JSON.parse(data)
      }
      default:
        throw new Error('Invalid storage type')
    }
  }
}

module.exports = { StorageBackend, STORAGE_TYPES }
