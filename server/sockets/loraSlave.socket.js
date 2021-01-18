const BaseSocket = require('./BaseSocket')
const { strToJson } = require('../utils/transformation')
const LoraSlave = require('./controllers/loraSlave.ctrl')

class LoraSlaveSocket extends BaseSocket {
  socketListener(io, socket) {
    super.socketListener(io, socket)

    socket.on('lora-slave.open', async(message) => {
      if (!socket.configPro || !socket.configPro.serialport.isOpen) {
        try {
          socket.configPro = await new LoraSlave(socket).open(message)
          socket.configPro.listen()
        } catch (e) {
          return socket.emit('lora-slave.open', strToJson(e.message))
        }
        socket.emit('lora-slave.open', { code: 0 })
      } else {
        socket.emit('lora-slave.open', { code: 10000, message: '已开启了一个串口，请先关闭原端口' })
      }
    })
  }
}

module.exports = new LoraSlaveSocket()
