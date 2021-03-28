const env = process.env.NODE_ENV
let url = ''
if(env === 'development'){
  url = {
    api:'http://localhost:3000'
  }
} else if(env === 'production'){
  url = {
    api:'http://localhost:3001'
  }
}

module.exports = url



