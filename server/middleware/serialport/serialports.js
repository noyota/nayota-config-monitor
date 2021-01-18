const EventEmitter = require('events').EventEmitter
const SerialPort = require('./index')

class SerialPorts extends EventEmitter {
  /**
   * 初始化串口，包括重置功能
   * @param control 中控对象
   * @return {Promise<void>}
   */
  async init(loraMaster) {
    await SerialPort.clear() // 重新初始化时,停止原开启的串口信息,根据新设备上的串口重新开启
    const item = loraMaster.serialData
    if (item) {
      const port = SerialPort.open(item.comName, {
        baudRate: item.baud,
        parity: item.verification, // 'none', 'even', 'mark', 'odd', 'space'.
        stopBits: item.stopBit,
        dataBits: item.dataBit
      })
      port.on('open', () => { // 开启成功
        console.log('开启成功')
        // online({ message: { comName: item.comName, state: true, time: Date.now() }})
        // TODO 开启成功后才可进行主站的在线判断
        item.state = true
        // control.save() // TODO 串口在线保存,使用另外方式
      })

      port.on('error', (err) => { // 开启失败
        console.log('串口开启失败', err.message)
        // online({ message: { comName: item.comName, state: false, time: Date.now() }})
        item.state = false
        // control.save()
      })
      port.on('close', () => { // 关闭接口
        // online({ message: { comName: item.comName, state: false, time: Date.now() }})
        item.state = false
        // control.save()
      })
    }
  }
}

module.exports = new SerialPorts()
