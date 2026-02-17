import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..', '..')

const PORT = 8888
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.mjs': 'text/javascript'
}

async function serveFile (res, filePath) {
  try {
    const content = await readFile(filePath)
    const ext = extname(filePath)
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream'
    
    res.writeHead(200, { 'Content-Type': mimeType })
    res.end(content)
  } catch (err) {
    res.writeHead(404)
    res.end('File not found')
  }
}

const server = createServer(async (req, res) => {
  let filePath = req.url === '/' || req.url === '/test.html'
    ? join(__dirname, 'test.html')
    : join(projectRoot, req.url.slice(1))

  await serveFile(res, filePath)
})

server.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`)
  console.log('Browser Test Server Started')
  console.log(`${'='.repeat(60)}`)
  console.log(`\nServer running at: http://localhost:${PORT}`)
  console.log(`\nOpen the following URL in your browser to run the tests:`)
  console.log(`\n  → http://localhost:${PORT}/test.html\n`)
  console.log(`Press Ctrl+C to stop the server`)
  console.log(`${'='.repeat(60)}\n`)
})
