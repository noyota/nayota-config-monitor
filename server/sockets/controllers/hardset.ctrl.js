const serialPorts = require('../../middleware/serialport/serialports')
const serialMaps = require('../../middleware/serialport/index')
const HardwareWordCtrl = require('../../controllers/hardwareword.controller')
const HardwareApi = require('../../middleware/com/HardwareApi')
const { bufferToHexStr } = require('../../utils/transformation')
class HardSetSocket {
  constructor(socket) {
    this.socket = socket
  }
  async open(message) {
    const { serialData, hardwareWordId } = message
    if (serialData) {
      this.serialport = await serialMaps.serialPorts.get(serialData.comName)
      if (!this.serialport) {
        await serialPorts.init(message) // 初始串口
        this.serialport = await serialMaps.serialPorts.get(serialData.comName)
      }
      const hardwareWord = await HardwareWordCtrl.getById(hardwareWordId)
      this.hardwareApi = new HardwareApi(this.serialport, { hardwareWord: hardwareWord })
      this.serialport.on('message', (data) => {
        if (data.type === 'Buffer') {
          data = bufferToHexStr(data)
        }
        this.socket.emit('hard-set.message', JSON.stringify({ 'get': data }))
      })
      this.serialport.on('send_message', (data) => {
        this.socket.emit('hard-set.message', data)
      })
      this.serialport.on('get_message', (data) => {
        this.socket.emit('hard-set.message', JSON.stringify({ 'get': data }))
      })
      this.isOpen = true
    }
    return this
  }

  listen() {
    // super.listen()
    const { socket, hardwareApi } = this
    /**
     * 搜索设备
     */
    socket.on('hard-set.find', async(data) => {
      try {
        const result = await hardwareApi.find(data.startAddr, data.endAddr)
        console.log('result', result)
        socket.emit('hard-set.find', { code: 0, data: result })
      } catch (e) {
        socket.emit('hard-set.find', { code: 63001, message: e.message })
      }
    })
    /**
     * 写入配置
     */
    socket.on('hard-set.write-config', async(data) => {
      try {
        const result = await hardwareApi.config(data)
        console.log('config', result)
        socket.emit('hard-set.write-config', { code: 0, data: result })
      } catch (e) {
        socket.emit('hard-set.write-config', { code: 63002, message: e.message })
      }
    })

    /**
     * 读设备
     */
    socket.on('hard-set.read', async(data) => {
      try {
        const result = await hardwareApi.read(data.code)
        console.log('read', result)
        socket.emit('hard-set.read', { code: 0, data: result })
      } catch (e) {
        socket.emit('hard-set.read', { code: 63003, message: e.message })
      }
    })
    /**
     * 关闭串口接管
     */
    socket.once('hard-set.close', () => {
      this.close()
      this._removeAllListeners()
      this.socket.emit('hard-set.close', { code: 0 })
    })
  }

  _removeAllListeners() {
    this.socket.removeAllListeners('hard-set.write-config')
    this.socket.removeAllListeners('hard-set.find')
    this.socket.removeAllListeners('hard-set.read')
    this.serialport.removeAllListeners('message')
    this.socket.removeAllListeners('hard-set.close')
  }

  async close() {
    this.isOpen = false
  }
}

module.exports = HardSetSocket
