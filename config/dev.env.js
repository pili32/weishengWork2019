'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"dev"',
  //开发环境的请求地址
  baseUrl: '"http://192.168.20.110:4011"',
  //baseUrl: '"http://192.168.10.110:9002"',
  fileUrl:'"http://192.168.20.110:8082"',
  ACCOUNT_API_HOST:'"/hbwsrc-account/"',
  COMMON_API_HOST:'"/hbwsrc-pub-server/"',
  INFOPLATFORM_API_HOST:'"/hbwsrc-infoplatform/"',
  Login_API_HOST:"'/hbwsrc-infoplatform-account/'"
})
