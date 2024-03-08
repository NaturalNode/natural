const storage = require('../lib/natural/util/storage/StorageBackend.js')

const STORAGESERVERS = true

describe('StorageBackend', () => {
  let storageBackend = null

  beforeEach(() => {
    storageBackend = new storage.StorageBackend()
  })

  if (STORAGESERVERS) { // Test storage servers
    const object = {
      attr1: 'val1',
      attr2: 'val2'
    }
    // Javascript object in and out, filename is passed as key when retrieving
    it('should store data in and retrieve data from file', async () => {
      const options = { filename: 'example.txt' }
      await storageBackend.setStorageType(storage.STORAGE_TYPES.FILE)
      const result1 = await storageBackend.store(object, options)
      expect(result1).toEqual('example.txt')
      const result2 = await storageBackend.retrieve(options.filename, {})
      expect(result2).toEqual(object)
    })

    // Javascript object in and out, key is set by the client in options and returned
    it('should store data in and retrieve data from Memcached', async () => {
      await storageBackend.setStorageType(storage.STORAGE_TYPES.MEMCACHED)
      const returnKey = await storageBackend.store(object, {})
      expect(returnKey).not.toEqual(null)
      const result2 = await storageBackend.retrieve(returnKey, {})
      expect(result2).toEqual(object)
    })

    // Javascript object in and out, MongoDB key object returned
    it('should store data in and retrieve data from MongoDB', async () => {
      await storageBackend.setStorageType(storage.STORAGE_TYPES.MONGODB)
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
      const returnedKey = await storageBackend.store(object, {})
      expect(returnedKey).not.toEqual(null)
      const retrievedObject = await storageBackend.retrieve(returnedKey, {})
      expect(retrievedObject).toEqual(JSON.stringify(object))
    })

    // Javascript object in and out, key is set by Postgres and returned
    it('should store data in and retrieve data from Postgres', async () => {
      await storageBackend.setStorageType(storage.STORAGE_TYPES.POSTGRES, { tableName: 'lexicon6' })
      const id = await storageBackend.store(object, {})
      const retrievedObject = await storageBackend.retrieve(id)
      expect(retrievedObject).toEqual(object)
    })

    it('should throw an error for an invalid storage type', async () => {
      try {
        await storageBackend.setStorageType('invalidType')
      } catch (error) {
        expect(error.message).toEqual('Invalid storage type')
      }
    })

    it('should throw an error for changing the storage type', async () => {
      storageBackend.setStorageType('FILE')
      try {
        await storageBackend.setStorageType('FILE')
      } catch (error) {
        expect(error.message).toEqual('Storage type already set')
      }
    })
  }
})
