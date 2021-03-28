
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
module.exports = {
  mode:'development',
  entry: {
    // 入口文件必须是数组
    jquery: ['jquery']
  },
  output: {
    // 多入口配置
    filename: '[name].[chunkhash].js',
    // 输入路径是个绝对路径 E:\webpack\dist
    path: path.join(__dirname, '../dist/dll'),
    library:"__dll__[name]"
  },
  plugins:[
    new webpack.DllPlugin({
      // name 必须与library一致
      name:'__dll__[name]',
      path:path.resolve(__dirname,'../dist/dll', 'mainfest.json')
    }),
    // new CleanWebpackPlugin()
  ]
}


