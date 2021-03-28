const h5 = process.env.h5
const test = ['css', 'scss']
const miniCssExtractPlugin = require('mini-css-extract-plugin');

const baseCssLoader = [
  {
    loader:miniCssExtractPlugin.loader
  },
  {
    loader:'css-loader'
  },
]

if(h5){
  baseCssLoader.push({
    loader: 'postcss-loader',
  })
}

const loader = test.map(item => {
  if(item === 'css'){
    return {
      test: new RegExp(`\\.${item}\$`),
      loader:baseCssLoader.slice(0)
    }
  } else {
    let test = new RegExp(`\\.${item}\$`)
    let loader = baseCssLoader.slice(0)
    item === 'scss' && (item = 'sass')
    loader.push({
      loader:`${item}-loader`
    })
    return {
      test,
      loader
    }
  }
})

module.exports = loader




