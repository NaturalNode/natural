
// Import libraries for different storage backends
const fs = require('fs').promises
// const mongoose = require('mongoose')
// const postgres = require('pg')
// const redis = require('redis')
const memjs = require('memjs')
const memCachedServer = 'localhost:11211'

// Enum for different types of storage backends that can be used
const STORAGE_TYPES = {
  POSTGRES: 'POSTGRES',
  REDIS: 'REDIS',
  MONGODB: 'MONGODB',
  MEMCACHED: 'MEMCACHED',
  FILE: 'FILE'
}

class StorageBackend {
  constructor (storageType) {
    if (storageType) {
      this.setStorageType(storageType)
    }
  }

  // Sets the storage type. Valid values are POSTGRES, REDIS, MONGODB, MEMCACHED, FILE
  setStorageType (storageType) {
    this.storageType = storageType
    switch (storageType) {
      case STORAGE_TYPES.POSTGRES:
        // Initialize connection to Postgres
        break
      case STORAGE_TYPES.REDIS:
        // Initialize connection to Redis
        break
      case STORAGE_TYPES.MONGODB:
        // Initialize connection to MongoDB
        break
      case STORAGE_TYPES.MEMCACHED:
        this.memcached = memjs.Client.create(memCachedServer)
        break
      case STORAGE_TYPES.FILE:
        // No action required for the file system
        break
      default:
        throw new Error('Invalid storage type')
    }
  }

  // Stores value to the selected storage type.
  async store (object, options, callback) {
    const data = JSON.stringify(object)
    switch (this.storageType) {
      case STORAGE_TYPES.POSTGRES:
        // Initialize connection to Postgres
        break
      case STORAGE_TYPES.REDIS:
        // Initialize connection to Redis
        break
      case STORAGE_TYPES.MONGODB:
        // Initialize connection to MongoDB
        break
      case STORAGE_TYPES.MEMCACHED:
        return await this.memcached.set(options.key, data, { expires: 2 })
        break
      case STORAGE_TYPES.FILE:
        await fs.writeFile(options.filename, data)
        return (options.filename)
      default:
        throw new Error('Invalid storage type')
    }
  }

  async retrieve (key, options, callback) {
    switch (this.storageType) {
      case STORAGE_TYPES.POSTGRES:
        // Initialize connection to Postgres
        break
      case STORAGE_TYPES.REDIS:
        // Initialize connection to Redis
        break
      case STORAGE_TYPES.MONGODB:
        // Initialize connection to MongoDB
        break
      case STORAGE_TYPES.MEMCACHED:
        return await this.memcached.get(key)
      case STORAGE_TYPES.FILE:
        return await fs.readFile(options.filename, 'utf8')
      default:
        throw new Error('Invalid storage type')
    }
  }
}

module.exports = { StorageBackend, STORAGE_TYPES }
