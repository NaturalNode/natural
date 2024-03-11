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

    // A for loop to test all five storage methods
    Object.keys(storage.STORAGE_TYPES).forEach(storageType => {
      it('should store data in and retrieve data from ' + storageType, async () => {
        await storageBackend.setStorageType(storageType)
        const key = await storageBackend.store(object)
        expect(key).not.toEqual(null)
        const result = await storageBackend.retrieve(key)
        expect(result).toEqual(object)
      })
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
