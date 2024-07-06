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
