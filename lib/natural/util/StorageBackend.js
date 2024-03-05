
// Read environment variables from ~/.env
require('dotenv').config()

// Import libraries for different storage backends
const fs = require('fs').promises
const path = process.env.FS_PATH

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

  async configPostgres (tableName) {
    // Initialize connection to Postgres
    const client = new postgres.Client({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT
    })
    this.postgresClient = client
    this.postgresTableName = tableName
    // Connect to the database
    return new Promise((resolve, reject) => {
      client.connect()
        .then(() => {
          console.log('Connected to the database')
          // Call the function to create the table
          createTable(tableName)
          resolve()
        })
        .catch(err => {
          console.error('Error connecting to the database:', err)
          reject(err)
        })
    })

    // Function to create the table
    function createTable (tableName) {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id SERIAL PRIMARY KEY,
          key VARCHAR(255) UNIQUE NOT NULL,
          data JSONB
        );
      `
      return new Promise((resolve, reject) => {
        client.query(createTableQuery)
          .then(() => {
            console.log('Table created successfully')
            resolve()
          })
          .catch(error => {
            console.error('Error creating table:', error)
            reject(error)
          })
      })
    }
  }

  // Sets the storage type. Valid values are POSTGRES, REDIS, MONGODB, MEMCACHED, FILE
  async setStorageType (storageType, options) {
    this.storageType = storageType
    switch (storageType) {
      case STORAGE_TYPES.POSTGRES:
        await this.configPostgres(options.tableName)
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

  // Function to insert a JavaScript object by key
  async postgresInsertObject (key, object) {
    try {
      const query = `INSERT INTO ${this.postgresTableName} (key, data) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data`
      await this.postgresClient.query(query, [key, object])
      console.log('Object inserted successfully')
    } catch (error) {
      console.error('Error inserting object:', error)
    }
  }

  // Function to retrieve a JavaScript object by key
  async postgresGetObjectByKey (key) {
    try {
      const query = `SELECT data FROM ${this.postgresTableName} WHERE key = $1`
      const result = await this.postgresClient.query(query, [key])
      if (result.rows.length > 0) {
        return result.rows[0].data
      } else {
        console.log('No object found with the specified key')
        return null
      }
    } catch (error) {
      console.error('Error retrieving object:', error)
      return null
    }
  }

  // Stores value to the selected storage type.
  async store (object, options) {
    const data = JSON.stringify(object)
    switch (this.storageType) {
      case STORAGE_TYPES.POSTGRES:
        await this.postgresInsertObject(options.key, object)
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
        return await this.postgresGetObjectByKey(key)
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
