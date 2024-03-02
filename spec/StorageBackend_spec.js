const storage = require('../lib/natural/util/StorageBackend.js')

describe('StorageBackend', () => {
  let storageBackend

  beforeEach(() => {
    storageBackend = new storage.StorageBackend(storage.STORAGE_TYPES.FILE)
  })

  it('should store data in the selected storage type', async () => {
    const object = { key: 'value' }
    const options = { filename: 'example.txt' }
    const result = await storageBackend.store(object, options)
    expect(result).toEqual('example.txt')
  })

  it('should throw an error for an invalid storage type', async () => {
    const object = { key: 'value' }
    const options = { filename: 'example.txt' }
    storageBackend.setStorageType('invalidType')
    try {
      await storageBackend.store(object, options)
      // fail('The store function should throw an error for an invalid storage type')
    } catch (error) {
      expect(error.message).toEqual('Invalid storage type')
    }
  })

  it('should retrieve data from the selected storage type', async () => {
    const options = { filename: 'example.txt' }
    const result = await storageBackend.retrieve(null, options)
    expect(result).toEqual('{"key":"value"}')
  })
})
