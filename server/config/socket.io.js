const socketio = require('socket.io')
const socketioJwt = require('socketio-jwt')
const http = require('http')
const path = require('path')
const config = require('./config')
// const rtsp = require('rtsp-ffmpeg')

module.exports = function(app) {
  const server = http.createServer(app)
  const io = socketio.listen(server)
  io.use(socketioJwt.authorize({
    secret: config.jwtSecret,
    handshake: true
  }))
  io
    .on('connection', function(socket) {
      // console.log(socket.decoded_token)
      socket.join('user-room-' + socket.decoded_token._id)
      config.files.sockets.forEach(function(socketConfiguration) {
        require(path.resolve(socketConfiguration)).socketListener(io, socket)
      })
    })
  config.files.sockets.forEach(socket => {
    require(path.resolve(socket)).setIo(io)
  })

  // const uri = 'rtsp://admin:abc88223080@192.168.1.118'
  // const stream = new rtsp.FFMpeg({ input: uri, rate: 10, resolution: '640x480', quality: 10 })
  // stream.on('data', (data) => {
  //   const fs = require('fs').promises
  //   fs.writeFile('11.jpg', data)
  //   console.log(1)
  // })
  //
  // const uri2 = 'rtsp://admin:abc88223080@192.168.1.64'
  // const stream2 = new rtsp.FFMpeg({ input: uri2 })
  // stream2.on('data', (data) => {
  //   io.emit('video_data2', data.toString('base64'))
  // })
  return server
}
