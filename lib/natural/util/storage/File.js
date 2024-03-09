require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs').promises
const path = process.env.FS_PATH

// Class for creating file-based storage
class FilePlugin {
  async store (object, options) {
    const key = uuidv4()
    const data = JSON.stringify(object)
    await fs.writeFile(path + '/' + key + '.json', data)
    return key
  }

  async retrieve (key, options) {
    const data = await fs.readFile(path + '/' + key + '.json', 'utf8')
    return JSON.parse(data)
  }
}

module.exports = FilePlugin
