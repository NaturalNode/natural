const { v4: uuidv4 } = require('uuid')
require('dotenv').config()
const memjs = require('memjs')
const memCachedConnectionString = process.env.MEM_HOST + ':' +
  process.env.MEM_PORT

// Class for creating memcached client including store and retrieve methods
class MemcachedPlugin {
  constructor () {
    this.client = memjs.Client.create(memCachedConnectionString)
  }

  async store (object, options) {
    const key = uuidv4()
    const data = JSON.stringify(object)
    const isStored = await this.client.set(key, data, { expires: 2 })
    return isStored ? key : null
  }

  async retrieve (key, options) {
    const result = await this.client.get(key)
    return JSON.parse(result.value.toString())
  }
}

module.exports = MemcachedPlugin
