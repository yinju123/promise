
const express = require('express')

const app = express()

const webpack = require('webpack')
const middle = require('webpack-dev-middleware')
const config = require('./config/webpack.dev')

const compiler = webpack(config)
app.use(middle(compiler))

app.get('/list', (req, res) => {
  res.json([{name:"shiqi", title:'校区'}])
})

app.get('*', (req, res) => {
  console.log('req', req.url)
  res.json("没有该请求")
})



app.listen(3000)

