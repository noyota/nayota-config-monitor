/**
 * @author lifeng
 * @date 19-7-15
 * @Description: lora的任务类
 */
const serialPorts = require('../middleware/serialport/serialports')
const LoraMaster = require('../../models/loraMaster.model')
const Master = require('./master')

class Loras {
  constructor(control) {
    this.control = control
    this.masters = new Map()
    this.init()
  }

  async init() {
    const maters = await LoraMaster.find({ control: this.control._id })
    maters.forEach(item => {
      this.masters.set(item.address,)
      serialPorts.on(item.address, (serialport) => {
        this.masters.push(new Master(serialport, item))
      })
    })
  }

  // 主站连接自检

  // 从站连接自检
  // 设备连接自检
}

module.exports = Loras
