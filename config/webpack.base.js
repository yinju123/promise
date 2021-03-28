
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const url = require('../src/utils/url')
const cssLoader = require('./utils/css-loader')
const resolve = dir => {
  return path.join(__dirname,'../', dir)
}
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;


const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  entry: {
    main: "./src/main.js",
  },
  output: {
    // 多入口配置
    filename: 'js/[name].[chunkhash].js',
    // 输入路径是个绝对路径 E:\webpack\dist
    path: resolve('dist')
  },
  plugins: [
    new htmlWebpackPlugin({
      // 设置title
      title: '这是3333',
      // 被编译的模板
      template: './public/index.html',
      // 引入的js文件，这里只引入b
      // chunks: ['b'],
      // 生成文件的名称
      // filename: 'index2.html',
      // 引入js时是否加入hash值
      hash: true
    }),
    new VueLoaderPlugin(),
    new miniCssExtractPlugin({
      //默认地址是是output.path+模块名
      filename: 'css/[name].[chunkhash].css'
    }),
    new CleanWebpackPlugin(),
    // 设置全局变量，应该是设置全局,其实是全局替换。将全局的http.url替换成
    /* 
      {
        url1:'http://localhost:8080',
        url2:'http://localhost:8080'
      } 
      但是http是不存在的
    */
    // new webpack.DefinePlugin({
    //   'http.url':JSON.stringify({
    //     url1:'http://localhost:8080',
    //     url2:'http://localhost:8080'
    //   }),
    //   env:true
    // }),
    new webpack.BannerPlugin("mark by shiqi"),
    // 获取moment引入其他的locale资源，如果引用资源有我们想要的，可以单独引入
    // new webpack.IgnorePlugin(/\.\/locale/, /moment$/),
    // new BundleAnalyzerPlugin(),
    // new webpack.DllReferencePlugin({
    //   'manifest':path.resolve(__dirname,'../dist/dll/mainfest.json')
    // })
  ],
  module: {
    rules:[
      // vue
      {
        test:/\.vue$/,
        exclude: /(node_modules|bower_components)/,
        loader:'vue-loader'
      },
      // 图片
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 图片大小限制，小于此值，使用base64，超过用原图，因为图片过大还使用base64，会是原来的图更大
              limit: 10 * 1024,
              // 输入文件的地址，想对output.path（图片的真正地址）
              outputPath: 'images',
              // 图片路径的公共地址，在css中加入（css的引入地址）
              publicPath: '../images',
              // 图片的文件名称[hash:8] 表示8位数的hash值
              name: '[name].[hash:8].[ext]',
              esModule:false
            }
          }
        ]
      },
      // 字体
      {
        test: /\.(ttf|eot|svg|woff|woff2|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'fonts',
              // 图片路径的公共地址，在css中加入（css的引入地址）
              publicPath: '../fonts',
              name: '[name].[hash:8].[ext]',
            }
          }
        ]
      },
      // es6
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        // use: {
        //   loader: 'happypack/loader?id=babel'
        // }
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
    ].concat(cssLoader)
  },
  resolve:{
    // 别名， import getName from api/user 实际地址是 /src/api/user
    alias:{
      '@':resolve('src'),
      '@views':resolve('src/views'),
      '@api':resolve('src/api'),
      '@utils':resolve('src/utils'),
    },
    // 引入文件的后缀， import a from 'b' b可能是js文件，也可能是css样式，也可以是json文件,引入顺序从左到右
    extensions:[".js", ".vue",".json"],
    // 当从 npm 包中导入模块时（例如，import * as D3 from "d3"），此选项将决定在 package.json 中使用哪个字段导入模块
    mainFields: ["browser", "module", "main"],
    // 入口文件的名称
    mainFiles:['index'],
    // 在当前运行目录下进行查找依赖包，不然会一直向上找,可设置多个值
    modules:['node_modules'],
  },
  devServer:{
    // 前置请求响应，如果有匹配的路径，则走这边的路径，如果没有则向服务器发送请求
    before(app){
      app.get('/api/user', function(req, res) {
        res.json({ custom: 'before' });
      });
    },
    // 代理,以
    proxy:{
      // 以/api 开头的请求 可以是/api2,也是可以的
      "/api":{
        target:url.api,
        // 路径以api3开头的字符串修改为空,如果没有^则表示查到的第一个api字符串
        pathRewrite:{'^api3':''},
        // 将header里面的host修改为target，false则不修改，浏览器看不出来，但是后端打印能看出区别
        changeOrigin: true
      }
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}


