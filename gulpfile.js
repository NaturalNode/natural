const { src, dest } = require('gulp');
var jasmineBrowser = require('gulp-jasmine-browser');
var webpackStream = require('webpack-stream');

exports.default = function() {
  return src(['spec/*_spec.js'])
    .pipe(webpackStream(require('webpack.config')))
    .pipe(jasmineBrowser.specRunner({}))
    .pipe(jasmineBrowser.server())

    //.pipe(jasmineBrowser.specRunner({console: true, random: false}))
    //.pipe(jasmineBrowser.headless({driver: 'phantomjs'}));
};
