import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
console.log(process.env.VUE_APP_BASE_API)
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api-v1 的 base_url
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 5000 // request timeout
})
service.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// request interceptor request拦截器
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    const tokenVal = getToken()

    config.headers.Authorization = tokenVal ? `Bearer ${tokenVal}` : ''

    return config
  },
  error => {
    // Do something with request error
    console.log('error', error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get information such as headers or status
   * Please return  response => response
   */
  // response => response,
  response => {
    const res = response.data
    if (res.code !== 0) {
      if (res.message) {
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
      // 10002:非法的token; 10003:其他客户端登录了;  10004:Token 过期了;
      if (res.code === 10002 || res.code === 10003 || res.code === 10004) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('resetToken').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject(res)
    } else {
      return response.data
    }
  },
  (error) => {
    console.log(error) // for debug
    if (error.response) {
      Message({
        message: `${error.message}:${error.response ? error.response.statusText : ''}`,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error.response.data)
  }
)

export default service
