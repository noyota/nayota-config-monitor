const serialPorts = require('../../middleware/serialport/serialports')
const serialMaps = require('../../middleware/serialport/index')
const { strToHex } = require('../../utils/transformation')
class QrcodeSocket {
  constructor(socket) {
    this.socket = socket
  }
  async open(message) {
    const { serialData } = message
    if (serialData) {
      this.serialport = await serialMaps.serialPorts.get(serialData.comName)
      if (!this.serialport) {
        await serialPorts.init(message) // 初始串口
        this.serialport = await serialMaps.serialPorts.get(serialData.comName)
      }
      this.serialport.on('message', (data) => {
        this.socket.emit('qrcode.message', data)
      })
      this.serialport.on('get_message', (data) => {
        this.socket.emit('qrcode.message', data)
      })
      this.isOpen = true
    }
    return this
  }

  listen() {
    // super.listen()
    const { socket } = this
    /**
     * 搜索设备
     */
    socket.on('qrcode.write', async(data) => {
      await this.serialport.write(strToHex(data.message))
    })

    /**
     * 关闭串口接管
     */
    socket.once('qrcode.close', () => {
      this.close()
      this._removeAllListeners()
      this.socket.emit('qrcode.close', { code: 0 })
    })
  }

  _removeAllListeners() {
    this.socket.removeAllListeners('qrcode.write')
    this.serialport.removeAllListeners('message')
    this.socket.removeAllListeners('qrcode.close')
  }

  async close() {
    this.isOpen = false
  }
}

module.exports = QrcodeSocket
