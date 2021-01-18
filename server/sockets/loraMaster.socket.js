const BaseSocket = require('./BaseSocket')
const { strToJson } = require('../utils/transformation')
const LoraMaster = require('./controllers/loraMaster.ctrl')
const LoraMaster_ = require('./controllers/loraMaster_.ctrl')
const ScanJob = require('../apis/scanJob')
const config = require('../config/config')
class LoraMasterSocket extends BaseSocket {
  socketListener(io, socket) {
    super.socketListener(io, socket)
    socket.on('lora-master.open', async(message) => {
      if (!socket.configPro || !socket.configPro.isOpen) {
        try {
          socket.configPro = await new LoraMaster(socket).open(message)
          socket.configPro.listen()
        } catch (e) {
          return socket.emit('lora-master.open', strToJson(e.message))
        }
        socket.emit('lora-master.open', { code: 0 })
      } else {
        socket.emit('lora-master.open', { code: 10000, message: '已开启了一个串口，请先关闭原端口' })
      }
    })
    socket.on('lora-set.open_lora', async(message) => {
      if (!socket.configPro || !socket.configPro.isOpen) {
        try {
          socket.configPro = await new LoraMaster_(socket).open(message)
          socket.configPro.listen()
        } catch (e) {
          return socket.emit('lora-set.open_lora', strToJson(e.message))
        }
        socket.emit('lora-set.open_lora', { code: 0 })
      } else {
        socket.emit('lora-set.open_lora', { code: 10000, message: '已开启了一个串口，请先关闭原端口' })
      }
    })
    socket.on('lora-master.use-config', async(message) => {
      try {
        if (config.scanJob) {
          config.scanJob.load(message)
        } else {
          config.scanJob = new ScanJob()
          config.scanJob.load(message)
        }
        socket.emit('lora-master.use-config', { code: 0 })
      } catch (e) {
        socket.emit('lora-master.use-config', { code: 61004, message: e.message })
      }
    })
    // 关闭串口
    socket.once('disconnect', () => {
      if (socket.serialport) { socket.serialport.close() }
    })
  }
}

module.exports = new LoraMasterSocket()
