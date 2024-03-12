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
