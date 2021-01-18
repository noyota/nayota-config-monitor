const BaseSocket = require('./BaseSocket')
const { strToJson } = require('../utils/transformation')
const Qrcode = require('./controllers/qrcode.ctrl')
class QrcodeSocket extends BaseSocket {
  socketListener(io, socket) {
    super.socketListener(io, socket)
    socket.on('qrcode.open', async(message) => {
      if (!socket.configPro || !socket.configPro.isOpen) {
        try {
          socket.configPro = await new Qrcode(socket).open(message)
          socket.configPro.listen()
        } catch (e) {
          return socket.emit('qrcode.open', strToJson(e.message))
        }
        socket.emit('qrcode.open', { code: 0 })
      } else {
        socket.emit('qrcode.open', { code: 10000, message: '已开启了一个串口，请先关闭原端口' })
      }
    })
  }
}

module.exports = new QrcodeSocket()
