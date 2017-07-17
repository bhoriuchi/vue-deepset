var liteutils = require('liteutils')
var path = require('path')

var config = {
  dash: {
    minify: false,
    browserify: false,
    name: '_',
    dest: path.resolve(__dirname, '../src/liteutils/liteutils.dash.browser.js'),
    compileDir: path.resolve(__dirname, '../src/liteutils'),
    eslint: false,
    babelrc: false,
    include: [
      'forEach',
      'uniq',
      'isString',
      'reduce',
      'toPath',
      'isArray',
      'has',
      'isNumber',
      'get',
      'isString',
      'isObject'
    ]
  }
}

liteutils(config).then(function () {
  console.log('liteutils build complete')
})
  .catch(console.error)
