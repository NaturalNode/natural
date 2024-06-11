import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

export default {
  input: 'lib/natural/index.js', // Your entry point
  output: {
    dir: 'dist/esm', // Output directory for ESM build
    format: 'esm', // Output format as ESM
    sourcemap: true // Optional: generate source maps
  },
  plugins: [
    resolve({
      preferBuiltins: true // Prefer Node.js built-in modules over local modules
    }), // Resolve modules from node_modules
    commonjs(), // Convert CommonJS modules to ES modules
    json() // Add the JSON plugin to handle JSON imports
  ]
}
