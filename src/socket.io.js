import SocketIO from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import store from '@/store'
import router from './router'
import Vue from 'vue'
import { getToken } from '@/utils/auth' // get token from cookie

let io

router.beforeEach(async(to, from, next) => {
  const hasToken = getToken()

  if (hasToken && !io) { // socketio需要在登录以后并且没有实例化io
    io = SocketIO(process.env.VUE_APP_BASE_API.replace('/api-v1', ''), {
      query: 'token=' + hasToken, // 验证信息
      autoConnect: false // 是否自动连接 如果要保持登录以后一直保持连接 就设为true  如果只有部分页面需要socket.io建议false,
    })
    io.on('connect', function() {
      console.log('socket connect')
    })

    io.on('reconnect', function() {
      console.log('socket reconnect')
    })
    io.on('disconnect', function() {
      console.log('socket disconnect')
    })

    io.on('error', function(error) {
      if (error.type === 'UnauthorizedError' || error.code === 'invalid_token') { // 验证失败
        // redirect user to login page perhaps?
        console.log("User's token has expired")
        io.close()
      }
    })

    const socket = new VueSocketIO({
      debug: true,
      connection: io,
      vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
      }
    })

    Vue.use(socket)
  }

  next()
})
