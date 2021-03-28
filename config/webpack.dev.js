
const {merge} = require('webpack-merge')
const base = require('./webpack.base')

const devConfig = {
  devServer: {
    port: 8080,
    // index: 'index2.html'
  },
  // development 开发环境，不压缩。production正式环境，压缩
  mode: 'development',
  // sourceMap
  devtool: 'source-map'
}


module.exports = merge(base, devConfig)
