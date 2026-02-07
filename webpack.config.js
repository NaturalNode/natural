const webpack = require('webpack')
const path = require('path')
const glob = require('glob')

module.exports = {

  mode: 'none',

  target: 'web',

  // Entry point: all compiled spec files
  entry: glob.sync('./dist/cjs/spec/*_spec.js'),

  resolve: {
    extensions: ['.js', '.json'],

    modules: ['node_modules', '.'],

    // Use our versions of Node modules.
    alias: {
      fs: 'browserfs/dist/shims/fs.js',
      buffer: 'browserfs/dist/shims/buffer.js',
      path: 'browserfs/dist/shims/path.js',
      processGlobal: 'browserfs/dist/shims/process.js',
      bufferGlobal: 'browserfs/dist/shims/bufferGlobal.js',
      bfsGlobal: require.resolve('browserfs'),
      // Use browserify util polyfill
      util: 'util/util.js'
    },

    // Webpack 5: Configure Node.js polyfills
    fallback: {
      // BrowserFS provides these
      fs: false,
      path: false,
      buffer: false,
      // Not needed for browser tests (Node.js-only modules)
      os: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      url: false,
      assert: false,
      querystring: false,
      // Database/network modules (Node.js-only, won't work in browser)
      net: false,
      tls: false,
      dns: false,
      child_process: false
    }
  },

  // REQUIRED to avoid issue "Uncaught TypeError: BrowserFS.BFSRequire is not a function"
  // See: https://github.com/jvilk/BrowserFS/issues/201
  module: {
    noParse: /browserfs\.js/
  },

  watch: false,

  output: {
    filename: 'spec.js',
    path: path.resolve(__dirname)
  },

  plugins: [
    // Expose BrowserFS, process, and Buffer globals.
    // NOTE: If you intend to use BrowserFS in a script tag, you do not need
    // to expose a BrowserFS global.
    new webpack.ProvidePlugin({
      BrowserFS: 'bfsGlobal',
      process: 'processGlobal',
      Buffer: 'bufferGlobal'
    })
  ],

  stats: 'normal'

}
