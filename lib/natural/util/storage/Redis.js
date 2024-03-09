const { v4: uuidv4 } = require('uuid')
require('dotenv').config()
const redis = require('redis')
const redisConnectionString = 'redis://' + process.env.REDIS_HOST + ':' +
  process.env.REDIS_PORT

class RedisPlugin {
  constructor () {
    this.configRedis()
  }

  async configRedis () {
    this.redisClient = await redis.createClient(redisConnectionString)
    this.redisClient
      .on('error', err => console.log('Redis Client Error', err))
      .connect()
  }

  async store (object, options) {
    const key = uuidv4()
    const data = JSON.stringify(object)
    await this.redisClient.set(key, data)
    return key
  }

  async retrieve (key, options) {
    const result = await this.redisClient.get(key)
    return JSON.parse(result)
  }
}

module.exports = RedisPlugin
