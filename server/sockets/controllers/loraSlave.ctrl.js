const LoraMasterSocket = require('./loraMaster.ctrl')
const AgreementCtrl = require('../../controllers/agreement.controller')
const HardwareWordCtrl = require('../../controllers/hardwareword.controller')
const SlaveApi = require('../../middleware/com/SlaveApi')
// const { numToHexStr, hexStrAdd } = require('../../utils/transformation')

class LoraSlaveSocket extends LoraMasterSocket {
  async open(message) {
    await super.open(message)
    this.slaveApi = new SlaveApi(this.masterApi, {})
    return this
  }

  listen() {
    super.listen()
    const { client, socket, masterApi, slaveApi } = this
    masterApi.listenLoraNode(async(data) => {
      const loraSlave = {
        isNew: true,
        type: data.type
      }
      console.log(data.netAddr)
      socket.emit('lora-slave.lora-node', loraSlave)
    })
    /**
     * 写入配置
     */
    socket.on('lora-slave.write-config', async(data) => {
      console.log(data)
      const hardwareWord = await HardwareWordCtrl.getById(data.hardwareWord, null, { autopopulate: false })
      const agreement = await AgreementCtrl.getById(data.agreement, null, { autopopulate: false })
      slaveApi.setAmAndHww(agreement, hardwareWord)
      try {
        data.netAddr = this.control.number
        await slaveApi.configSlave(data)
        socket.emit('lora-slave.write-config', { code: 0 })
      } catch (e) {
        console.log(e)
        socket.emit('lora-slave.write-config', { code: 62001, message: '配置从站失败:' + e.message })
      }
    })

    /**
     * 退出配置模式
     */
    socket.on('lora-slave.close-config', () => {
      this.outLoraSlaveConfig()
    })

    /**
     * 广播找从站
     */
    socket.on('lora-slave.broadcast', () => {
      masterApi.broadcast()
    })
    /**
     * TODO
     * 空调encode配置
     */
    socket.on('lora-slave.encode-config', async(data) => {
      const hardwareWord = await HardwareWordCtrl.getById(data.hardwareWord, null, { autopopulate: false })
      const agreement = await AgreementCtrl.getById(data.agreement, null, { autopopulate: false })
      slaveApi.setAmAndHww(agreement, hardwareWord)
      try {
        data.netAddr = this.control.number
        await slaveApi.encode(data)
        socket.emit('lora-slave.encode-config', { code: 0 })
      } catch (e) {
        socket.emit('lora-slave.encode-config', { code: 62001, message: '配置从站失败:' + e.message })
      }
    })
    /**
     * 关闭串口接管
     */
    socket.once('lora-slave.close', () => {
      this._removeAllListeners()
      this.close()
      socket.emit('lora-slave.close', { code: 0 })
    })
  }

  async outLoraSlaveConfig() {
    const { socket, slaveApi } = this
    try {
      if (await slaveApi.outConfig()) {
        socket.emit('lora-slave.close-config', { code: 0, data: 0 })
      } else {
        socket.emit('lora-slave.close-config', { code: 62003, message: '未收发从站退出配置模式响应' })
      }
    } catch (e) {
      socket.emit('lora-slave.close-config', { code: 62003, message: e.message })
    }
  }

  _removeAllListeners() {
    super._removeAllListeners()
    this.socket.removeAllListeners('lora-slave.close')
    this.socket.removeAllListeners('lora-slave.broadcast')
    this.socket.removeAllListeners('lora-slave.encode-config')
    this.socket.removeAllListeners('lora-slave.close-config')
    this.socket.removeAllListeners('lora-slave.write-config')
  }

  // /**
  //  * 自增地址建议
  //  * @return {Promise<boolean>}
  //  * @private
  //  */
  // async _incAddress() {
  //   const preModel = (await loraSlaveCtrl.list({ control: this.control, limit: 1 })).rows
  //   if (preModel.length === 1 && preModel[0].shortAddress) {
  //     return hexStrAdd(preModel[0].shortAddress)
  //   } else {
  //     this.shortAddress = '0001'
  //   }
  //   return false
  // }
}

module.exports = LoraSlaveSocket
