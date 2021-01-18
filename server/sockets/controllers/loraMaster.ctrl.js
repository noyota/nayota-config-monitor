const loraMasterCtrl = require('../../controllers/loraMaster.controller')
const MasterApi = require('../../middleware/com/MasterApi')
const serialPorts = require('../../middleware/serialport/serialports')
const mongoose = require('mongoose')
const LoraMaster = mongoose.model('LoraMaster')
const serialMaps = require('../../middleware/serialport/index')
const { bufferToHexStr, hexStrToBuffer } = require('../../utils/transformation')
class LoraMasterSocket {
  constructor(socket) {
    this.socket = socket
  }
  async open(message) {
    const { loraMasterId } = message
    if (loraMasterId) {
      this.loraMaster = await loraMasterCtrl.getById(loraMasterId, null, { autopopulate: false })
      message.comName = message.comName || this.loraMaster.serialData.comName
      await serialPorts.init(this.loraMaster) // 初始串口
      this.serialport = await serialMaps.serialPorts.get(message.comName)
      this.serialport.on('message', (data) => {
        this.socket.emit('lora-master.message', bufferToHexStr(data))
      })
      this.isOpen = true
      this.masterApi = await new MasterApi(this.serialport, this.loraMaster || {})
    }
    return this
  }

  listen() {
    // super.listen()
    const { socket, masterApi, serialport } = this
    /**
     * 主站写入配置
     */
    socket.on('lora-master.write-config', async(data) => {
      try {
        if (await masterApi.writeConfig(data.lora.factor, data.lora.bandwidth, data.lora.codingrate, data.lora.frequency)) {
          await LoraMaster.update({}, { status: false }, { multi: true })
          await LoraMaster.update({ _id: data.loraMasterId }, { status: true })
          socket.emit('lora-master.write-config', { code: 0 })
        } else {
          socket.emit('lora-master.write-config', { code: 61005, message: '写入配置失败' })
        }
      } catch (e) {
        socket.emit('lora-master.write-config', { code: 61004, message: e.message })
      }
    })

    /**
     * 双模主站第二站写入配置
     */
    socket.on('lora-master.write-config2', async(data) => {
      try {
        if (await masterApi.writeConfig2(data.lora.factor, data.lora.bandwidth, data.lora.codingrate, data.lora.frequency)) {
          socket.emit('lora-master.write-config2', { code: 0 })
        } else {
          socket.emit('lora-master.write-config2', { code: 61005, message: '写入配置失败' })
        }
      } catch (e) {
        socket.emit('lora-master.write-config2', { code: 61004, message: e.message })
      }
    })

    socket.on('lora-master.port-write', async(data) => {
      console.log(data)
      if (data.hex) {
        serialport.write(data.message)
      } else {
        serialport.write(bufferToHexStr(Buffer.from(data.message))
        )
      }
    })
    this.listenChangeModel()
    /**
     * 关闭串口接管
     */
    socket.once('lora-master.close', () => {
      this.close()
      this._removeAllListeners()
      socket.emit('lora-master.close', { code: 0 })
    })
  }

  /**
   * 进出配置模式
   */
  listenChangeModel() {
    const { socket } = this
    socket.on('lora-master.change-model', async(data) => {
      try {
        if (data.model !== 'dev') {
          await this.outConfig()
        } else {
          await this.inConfig()
        }
      } catch (e) {
        socket.emit('lora-master.change-model', { code: 61004, message: '主站切换模式失败' })
      }
    })
  }

  async inConfig() {
    const { socket, masterApi, loraMaster } = this
    const bool = await masterApi.inConfig()
    if (bool) {
      if (loraMaster)loraMasterCtrl.update(loraMaster, { model: 'dev' })
      socket.emit('lora-master.change-model', { code: 0, data: 'dev' })
    } else {
      socket.emit('lora-master.change-model', { code: 61003, message: '主站进入配置模式失败' })
    }
  }

  async outConfig() {
    const { socket, masterApi, loraMaster } = this
    if (await masterApi.outConfig()) {
      if (loraMaster)loraMasterCtrl.update(loraMaster, { model: 'prod' })
      socket.emit('lora-master.change-model', { code: 0, data: 'prod' })
    } else {
      socket.emit('lora-master.change-model', { code: 61003, message: '主站退出配置模式失败' })
    }
  }

  _removeAllListeners() {
    this.socket.removeAllListeners('lora-master.change-model')
    this.socket.removeAllListeners('lora-master.write-config')
    this.socket.removeAllListeners('lora-master.write-config2')
    this.socket.removeAllListeners('lora-master.port-write')
    this.serialport.removeAllListeners('message')
    this.socket.removeAllListeners('lora-master.close')
  }

  async close() {
    if (this.masterApi.model === 'dev') await this.outConfig()
    this.isOpen = false
    // this.serialport.close()
  }
}

module.exports = LoraMasterSocket
