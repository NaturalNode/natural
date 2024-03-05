
// Read environment variables from ~/.env
require('dotenv').config()

// Import libraries for different storage backends
const fs = require('fs').promises
const path = ''

const mongoose = require('mongoose')
const mongoDBConnectionString = 'mongodb://' + process.env.MONGO_HOST + ':' +
  process.env.MONGO_PORT + '/' + process.env.MONGO_DATABASE

const postgres = require('pg')

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

class StorageBackend {
  constructor (storageType, options) {
    if (storageType) {
      this.setStorageType(storageType, options)
    }
  }

  configPostgres (tableName) {
    // Initialize connection to Postgres
    const client = new postgres.Client({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT
    })

    // Connect to the database
    client.connect()
      .then(() => {
        console.log('Connected to the database')
        // Call the function to create the table
        createTable()
      })
      .catch(err => {
        console.error('Error connecting to the database:', err)
      })

    // Function to create the table
    function createTable () {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id SERIAL PRIMARY KEY,
          key VARCHAR(255) UNIQUE NOT NULL,
          data JSONB
        );
      `

      client.query(createTableQuery)
        .then(() => {
          console.log('Table created successfully')
        })
        .catch(error => {
          console.error('Error creating table:', error)
        })
        .finally(() => {
          // Close the database connection after creating the table
          client.end()
        })
    }
  }

  // Sets the storage type. Valid values are POSTGRES, REDIS, MONGODB, MEMCACHED, FILE
  async setStorageType (storageType, options) {
    this.storageType = storageType
    switch (storageType) {
      case STORAGE_TYPES.POSTGRES:
        // Initialize connection to Postgres
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
        // Initialize connection to Postgres
        break
      case STORAGE_TYPES.REDIS:
        await this.redisClient.set(options.key, data)
        break
      case STORAGE_TYPES.MONGODB:
        return await this.ObjectModel.create(object)
      case STORAGE_TYPES.MEMCACHED:
        return await this.memcached.set(options.key, data, { expires: 2 })
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
        // Initialize connection to Postgres
        break
      case STORAGE_TYPES.REDIS:
        return await this.redisClient.get(key)
      case STORAGE_TYPES.MONGODB:
        return await this.ObjectModel.findById(key)
      case STORAGE_TYPES.MEMCACHED:
        return await this.memcached.get(key)
      case STORAGE_TYPES.FILE:
        return await fs.readFile(path + options.filename, 'utf8')
      default:
        throw new Error('Invalid storage type')
    }
  }
}

module.exports = { StorageBackend, STORAGE_TYPES }
