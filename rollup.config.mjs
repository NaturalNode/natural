import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { builtinModules, createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const deps = Object.keys(pkg.dependencies || {})
const peerDeps = Object.keys(pkg.peerDependencies || {})

const jsonEntryDeps = new Set(
  deps.filter((dep) => {
    try {
      return require.resolve(dep).endsWith('.json')
    } catch {
      return false
    }
  })
)
const nodeBuiltins = builtinModules.flatMap((name) => (
  name.startsWith('node:') ? [name, name.slice(5)] : [name, `node:${name}`]
))

const external = (id) => (
  nodeBuiltins.includes(id) ||
  deps.some((dep) => (id === dep || id.startsWith(`${dep}/`)) && !jsonEntryDeps.has(dep)) ||
  peerDeps.some((dep) => id === dep || id.startsWith(`${dep}/`))
)

export default {
  input: 'lib/natural/index.js', // Your entry point
  external,
  output: {
    dir: 'dist/esm', // Output directory for ESM build
    format: 'esm', // Output format as ESM
    sourcemap: true, // Optional: generate source maps
    preserveModules: true,
    preserveModulesRoot: 'lib/natural'
  },
  plugins: [
    resolve({
      preferBuiltins: true // Prefer Node.js built-in modules over local modules
    }), // Resolve modules from node_modules
    commonjs({
      esmExternals: (id) => !nodeBuiltins.includes(id),
      requireReturnsDefault: 'auto'
    }), // Convert CommonJS modules to ES modules
    json() // Add the JSON plugin to handle JSON imports
  ]
}
