const serialPorts = require('../../middleware/serialport/serialports')
const serialMaps = require('../../middleware/serialport/index')
const { hexCharCodeToStr, bufferToHexStr } = require('../../utils/transformation')
class LoraMasterSocket {
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
        this.socket.emit('lora-set.message', hexCharCodeToStr(data))
      })
      this.serialport.on('get_message', (data) => {
        this.socket.emit('lora-set.message', hexCharCodeToStr(data))
      })
      this.isOpen = true
    }
    return this
  }

  listen() {
    // super.listen()
    const { socket } = this

    socket.on('lora-set.port-write', async(data) => {
      if (data.hex) {
        await this.serialport.writeReOne(data.message, 500)
      } else {
        await this.serialport.writeReOne(bufferToHexStr(Buffer.from(data.message)), 500)
      }
    })
    /**
     * 关闭串口接管
     */
    socket.once('lora-set.close', () => {
      this.close()
      this._removeAllListeners()
      this.socket.emit('lora-set.close', { code: 0 })
    })
  }

  _removeAllListeners() {
    this.socket.removeAllListeners('lora-set.port-write')
    this.serialport.removeAllListeners('message')
    this.socket.removeAllListeners('lora-set.close')
  }

  async close() {
    this.isOpen = false
  }
}

module.exports = LoraMasterSocket
