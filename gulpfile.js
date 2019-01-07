const { src, dest } = require('gulp');
var jasmineBrowser = require('gulp-jasmine-browser');
var webpackStream = require('webpack-stream');

exports.default = function() {
  return src(['spec/ngram_spec.js'])
    .pipe(webpackStream(require('webpack.config')))
    //.pipe(dest('.'))
    .pipe(jasmineBrowser.specRunner({}))
    //.pipe(jasmineBrowser.headless({driver: "chrome", random: false}));
    .pipe(jasmineBrowser.server())
};
