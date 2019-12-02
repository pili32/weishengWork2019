'use strict'

const tagert = process.env.npm_lifecycle_event
process.stdout.write('the env config file is '+ tagert +'\n')

let base = {}
if (tagert === 'test') {
  base = {
    NODE_ENV: '"production"',
    baseUrl: '"http://119.96.188.213:5432"',
    ACCOUNT_API_HOST:'"/hbwsrc-account/"',
    COMMON_API_HOST:'"/hbwsrc-pub-server/"',
    INFOPLATFORM_API_HOST:'"/hbwsrc-infoplatform/"',
    Login_API_HOST:"'/hbwsrc-infoplatform-account/'",
    fileUrl:'"http://119.96.188.213:8082"'
  }
}else if (tagert === 'build') {
  base = {
    NODE_ENV: '"production"',
    baseUrl: '"http://gatewayapi.hbwsrc.cn"',
    ACCOUNT_API_HOST:'"/hbwsrc-account/"',
    COMMON_API_HOST:'"/hbwsrc-pub-server/"',
    INFOPLATFORM_API_HOST:'"/hbwsrc-infoplatform/"',
    Login_API_HOST:"'/hbwsrc-infoplatform-account/'",
    fileUrl:'"http://static.hbwsrc.cn"'
  }
}else if (tagert === 'development') {
  base = {
    NODE_ENV: '"dev"',
    baseUrl: '"http://192.168.20.110:4011"',
    ACCOUNT_API_HOST:'"/hbwsrc-account/"',
    COMMON_API_HOST:'"/hbwsrc-pub-server/"',
    INFOPLATFORM_API_HOST:'"/hbwsrc-infoplatform/"',
    Login_API_HOST:"'/hbwsrc-infoplatform-account/'",
    fileUrl:'"http://192.168.20.110:8082"',
  }
}

module.exports = base;