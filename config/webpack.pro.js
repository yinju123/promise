

const {merge} = require('webpack-merge')
const base = require('./webpack.base')

const proConfig = {
  // development 开发环境，不压缩。production正式环境，压缩
  // mode: 'production',
  mode: 'development',
}

module.exports = merge(base, proConfig)
