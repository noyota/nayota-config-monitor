const BaseSocket = require('./BaseSocket')
const { strToJson } = require('../utils/transformation')
const HardSet = require('./controllers/hardset.ctrl')
class HardSetSocket extends BaseSocket {
  socketListener(io, socket) {
    super.socketListener(io, socket)
    socket.on('hard-set.open', async(message) => {
      if (!socket.configPro || !socket.configPro.isOpen) {
        try {
          socket.configPro = await new HardSet(socket).open(message)
          socket.configPro.listen()
        } catch (e) {
          return socket.emit('hard-set.open', strToJson(e.message))
        }
        socket.emit('hard-set.open', { code: 0 })
      } else {
        socket.emit('hard-set.open', { code: 10000, message: '已开启了一个串口，请先关闭原端口' })
      }
    })
  }
}

module.exports = new HardSetSocket()
