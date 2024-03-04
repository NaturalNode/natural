const storage = require('../lib/natural/util/StorageBackend.js')

const STORAGESERVERS = FALSE 

describe('StorageBackend', () => {
  let storageBackend = null

  beforeEach(() => {
    storageBackend = new storage.StorageBackend()
  })

  if (STORAGESERVERS) {
    it('should store data in and retrieve data from Postgres', async () => {
      storageBackend.setStorageType(storage.STORAGE_TYPES.POSTGRES)
      const object = { key: 'value' }
      const options = { key: '1' }
      const result1 = await storageBackend.store(object, options)
      expect(result1).toEqual(true)
      const result2 = await storageBackend.retrieve('1', {})
      expect(result2.key).toEqual('value')
    })

    it('should store data in and retrieve data from file', async () => {
      const object = { key: 'value' }
      const options = { filename: 'example.txt' }
      storageBackend.setStorageType(storage.STORAGE_TYPES.FILE)
      const result1 = await storageBackend.store(object, options)
      expect(result1).toEqual('example.txt')
      const result2 = await storageBackend.retrieve(null, options)
      expect(result2).toEqual('{"key":"value"}')
    })

    it('should store data in and retrieve data from Memcached', async () => {
      storageBackend.setStorageType(storage.STORAGE_TYPES.MEMCACHED)
      const object = { key: 'value' }
      const options = { key: '1' }
      const result1 = await storageBackend.store(object, options)
      expect(result1).toEqual(true)
      const result2 = await storageBackend.retrieve('1', {})
      expect(result2.value.toString()).toEqual('{"key":"value"}')
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
