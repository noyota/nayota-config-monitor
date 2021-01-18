import axios from 'axios'
import { Message } from 'element-ui'

// create an axios instance
const service = axios.create({
  baseURL: `http://${document.domain}:${process.env.VUE_APP_SUPER_PORT}`, // api-v1 的 base_url
  timeout: 5000 // request timeout
})
service.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// request interceptor request拦截器
service.interceptors.request.use(
  config => {
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
    return Promise.reject(error.response ? error.response.data : null)
  }
)

export default service
