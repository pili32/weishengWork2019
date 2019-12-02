import axios from 'axios'
import { getAccessToken, removeAccessToken, removeUserInfo, removeUserAccess } from '@/libs/util'
import { Message, Modal } from 'iview'
import router from '../router'

// 创建axios实例
const service = axios.create({
    baseURL: process.env.baseUrl,
    timeout: 10000, // 请求超时时间.
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    responseType: 'json'
})

// request interceptor
service.interceptors.request.use(config => {
    if (getAccessToken()) {
      config.headers['Authorization'] = `${getAccessToken()}`; // 让每个请求携带token
    }
    if (config.data){
      if (config.data.page){
          config.headers['pageNum'] = config.data.page.pageNum
          config.headers['pageSize'] = config.data.page.pageSize
          if (config.data.page.orderBy) {
            config.headers['orderBy'] = config.data.page.orderBy
          }
          delete config.data['page']
      }
    }
    return config
  }, error => {
    console.log(error)
    Promise.reject(error)
  })

  // respone interceptor
service.interceptors.response.use(response => {
  const res = response
  if (res) {
    if (res.status === 200) {
      const token = response.headers.Authorization
      if (res.data && res.data.code && res.data.code !== '10000'){
        Message.error(res.data && res.data.msg)
      }
    }
    return response
  }
}, error => {
  if(error && error.response) {
    switch(error.response.status) {
      case 400:
        error.message = '错误请求'
        break
      case 401:
        Modal.confirm({
            title: '确定登出',
            content: '未授权，请重新登录',
            okText: '重新登录',
            cancelText: '取消',
            onOk: () => {
              // store.dispatch('FedLogOut').then(() => {
              //   location.reload()// 为了重新实例化vue-router对象 避免bug
              // })
              removeAccessToken();
              removeUserInfo();
              removeUserAccess();
              localStorage.removeItem("tagNaveList");
              if (process.env.NODE_ENV == 'dev') {
                router.replace({
                  path: '/login2',
                  query: {
                    redirect: router.currentRoute.fullPath
                  }
                })
              } else {
                // window.location.href = 'https://main.hbwsrc.cn'
                router.replace({
                  path: '/login'
                })
              }
            }
          })
          break
      case 404:
          error.message = '请求错误,未找到该资源'
          break
        case 415:
          error.message = '请求方法未允许'
          break
        case 408:
          error.message = '请求超时'
          break
      case 500: 
          error.message = '服务器端出错'
          break
      default:
          error.message = '连接错误' + error.response.status
    }
    Message.error(error.message)
  }
  return Promise.reject(error)
})

export default {
  get: function (baseUrl, url, data) {
    const requrl = `${baseUrl}${url}`;
    let config = {
        url: url ,
        method: 'get'
      },
      get = function (requrl, data) {
        if(data){
          requrl = requrl+ '/' + data
        }
        return service.get(requrl)
      }
    return get(requrl, data)
  },
  post:function (baseUrl, url, data) {
    const requrl = `${baseUrl}${url}`;
    let config = {
      url: url,
      method: 'post',
      transformRequest: [function (data) {
        return JSON.stringify(data);
      }],
      data: data
    }
    return service.post(requrl, data)
  },
  put: function (baseUrl, url, data) {
    const requrl = `${baseUrl}${url}`;
    let config = {
      url: url,
      method: 'put',
      transformRequest: [function (data) {
        return JSON.stringify(data)
      }],
      data: data
    }
    return service.put(requrl, data)
  },
  delete: function(baseUrl, url, data) {
    const requrl = `${baseUrl}${url}`;
    let config = {
      url: url,
      method: 'delete',
      data: data
    }
    return service.delete(requrl, {data})
  },
  iviewUpload: function (baseUrl, url, data) {
    const requrl = `${baseUrl}${url}`;
    let config = {
      url: url,
      method: 'post',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return service.post(requrl, data)
  },
  upload: function (baseUrl, url, data) {
    const requrl = `${baseUrl}${url}`;
    let config = {
      url: url,
      method: 'post',
      data: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    return service.post(requrl, data)
  },
  download: function (baseUrl, url, data) {
    const requrl = `${baseUrl}${url}`;
    let config = {
      responseType: 'arraybuffer'
    }
    return service.post(requrl, data, config);
  },
  downloadById: function (baseUrl, url, data) {
    const requrl = `${baseUrl}${url}`;
    let config = {
      responseType: 'arraybuffer'
    },
    get = function (requrl, data, config) {
      if(data){
        requrl = requrl+ '/' + data
      }
      return service.get(requrl, config)
    }
    return get(requrl, data, config)
  },
}