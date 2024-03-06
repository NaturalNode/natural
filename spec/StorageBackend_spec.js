const storage = require('../lib/natural/util/storage/StorageBackend.js')

const STORAGESERVERS = false

describe('StorageBackend', () => {
  let storageBackend = null

  beforeEach(() => {
    storageBackend = new storage.StorageBackend()
  })

  if (STORAGESERVERS) { // Test storage servers
    // Javascript object in and out, filename is returned
    it('should store data in and retrieve data from file', async () => {
      const object = { key: 'value' }
      const options = { filename: 'example.txt' }
      storageBackend.setStorageType(storage.STORAGE_TYPES.FILE)
      const result1 = await storageBackend.store(object, options)
      expect(result1).toEqual('example.txt')
      const result2 = await storageBackend.retrieve(null, options)
      expect(result2).toEqual(object)
    })

    // Javascript object in and out, key is set by the client in options and returned
    it('should store data in and retrieve data from Memcached', async () => {
      storageBackend.setStorageType(storage.STORAGE_TYPES.MEMCACHED)
      const object = { key: 'value' }
      const options = { key: '1' }
      const returnKey = await storageBackend.store(object, options)
      expect(returnKey).not.toEqual(null)
      const result2 = await storageBackend.retrieve('1', {})
      expect(result2).toEqual(object)
    })

    // Javascript object in and out, MongoDB key object returned
    it('should store data in and retrieve data from MongoDB', async () => {
      storageBackend.setStorageType(storage.STORAGE_TYPES.MONGODB)
      const object = { key: 'value' }
      await storageBackend.store(object, {}).then(id => {
        expect(typeof id).toEqual('object')
        storageBackend.retrieve(id, {}).then(retrievedObject => {
          expect(retrievedObject).toEqual(object)
        }).catch(error => {
          console.log(error)
        })
      }).catch(error => {
        console.log(error)
      })
    })

    // Javascript object in and out, key is set by the client in options and returned
    it('should store data in and retrieve data from Redis', async () => {
      await storageBackend.setStorageType(storage.STORAGE_TYPES.REDIS)
      const object = { key: 'value' }
      const options = { key: '1' }
      const returnedKey = await storageBackend.store(object, options)
      expect(returnedKey).not.toEqual(null)
      const retrievedObject = await storageBackend.retrieve('1')
      expect(retrievedObject).toEqual(JSON.stringify(object))
    })

    // Javascript object in and out, key is set by Postgres and returned
    it('should store data in and retrieve data from Postgres', async () => {
      await storageBackend.setStorageType(storage.STORAGE_TYPES.POSTGRES, { tableName: 'lexicon6' })
      const object = { key: 'value' }
      const id = await storageBackend.store(object, {})
      const retrievedObject = await storageBackend.retrieve(id)
      expect(retrievedObject).toEqual(object)
    })

    /*
    it('should throw an error for an invalid storage type', async () => {
      const object = { key: 'value' }
      const options = { filename: 'example.txt' }
      storageBackend.setStorageType('invalidType')
      try {
        await storageBackend.store(object, options)
        fail('The store function should throw an error for an invalid storage type')
      } catch (error) {
        expect(error.message).toEqual('Invalid storage type')
      }
    })
    */
  }
})
