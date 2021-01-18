/**
 * @author lifeng
 * @date 19-7-9
 * @Description: 主站命令执行对象  依赖 mqtt serve (用于远程命令) serialport 用于本地串口命令 （两个口重叠的serialport）
*/
const EventEmitter = require('events').EventEmitter
const { he, validateLora } = require('../../utils/verification')
const { bufferToHexStr } = require('../../utils/transformation')

class Master extends EventEmitter {
  /**
   * @param serialport 串口对象
   * @param model  主站配置信息
   */
  constructor(serialport, model) {
    super()
    this.serialport = serialport
    this.line = false
    this.model = model
    this.status = model.model || 'prod'
  }
  setModel(model) {
    this.model = model
    this.status = model.status || 0
  }
  /**
   * 进入配置模式
   * @return {Promise<boolean>}
   */
  async inConfig() {
    const data = await this.serialport.writeReOne('aa05ff22', 1000)
    const bool = (data === 'aa85ff22')
    if (bool) this.status = 'dev'
    return bool
  }

  getSerialPort() {
    return this.serialport
  }

  /**
   * 退出配置模式
   * @return {Promise<boolean>}
   */
  async outConfig() {
    const data = await this.serialport.writeReOne('aa06ff22', 1000)
    const bool = (data === 'aa86ff22')
    if (bool) this.status = 'prod'
    return bool
  }

  /**
   * 在线判定
   * @return {Promise<void>}
   */
  async isLine() {

  }

  /**
   * 广播
   */
  broadcast() {
    const data = 'AA0000AA000001ABFF22'
    this.serialport.write(data)
  }

  /**
   * 配置主站参数 传入16进制参数
   * @param factor 扩频因子
   * @param bandwidth 带宽
   * @param codingrate 编码率
   * @param frequency 频率
   */
  async writeConfig(factor, bandwidth, codingrate, frequency) {
    let data = `AA12${factor} ${bandwidth}${frequency} ${codingrate}`
    data = he(data) + 'FF22'
    const res = await this.serialport.writeReOne(data, 1000)
    return res.includes('aa92')
  }

  async writeConfig2(factor, bandwidth, codingrate, frequency) {
    let data = `AA15${factor} ${bandwidth}${frequency} ${codingrate}`
    data = he(data) + 'FF22'
    const res = await this.serialport.writeReOne(data, 1000)
    return res.includes('aa95')
  }

  /**
   * 从站81命令监听
   * @param cb
   * @return {Promise<void>}
   */
  listenLoraNode(cb) {
    this.serialport.on('message', (data) => {
      if (typeof data !== 'string') {
        data = bufferToHexStr(data)
      }
      const command = validateLora(data)
      if (command && command.slice(12, 14) === '81') {
        cb(Master._decodeFindLora(command))
      }
    })
  }

  /**
   * 监听正常模式 从站反馈命令
   * @param serialport 传入开启监听的串口
   */
  listenRunningJob(serialport) {
    serialport.on('message', (data) => {
      this.emit('accept')
      if (data instanceof Buffer)data = bufferToHexStr(data)
      console.log('accept', data)
      this.pushToSlave(data)
      this.pushToSlave(data)
    })
    serialport.on('offConfig', () => { // 串口退出配置后必须重写读一遍数据 并重新启动message监听
      serialport.on('message', (data) => {
        this.emit('accept')
        if (data instanceof Buffer)data = bufferToHexStr(data)
        console.log('accept', data)
        this.pushToSlave(data)
      })
    })
  }

  pushToSlave(data) {
    if (data instanceof Buffer)data = bufferToHexStr(data)
    if (this.navi) { // 如果有导航函数,从站注入 使用导航函数找到从站
      this.emit(`node${this.navi(data)}`, data) // 推送给对应节点
    } else {
      const command = validateLora(data)
      if (command == null || command === '') return
      const res = Master._decodeLoraNode(command)
      this.emit(`node${res.address}`, command) // 推送给对应节点
    }
  }

  removeRunningJob(serialport) {
    serialport.removeListener('message', this.pushToSlave())
  }

  /**
   * 如果在配置模式，发送一个退出配置模式命令
   */
  close() {
    if (this.status === 'dev') this.outConfig()
    this.serialport.close()
  }

  static _decodeLoraNode(command) {
    const address = command.substr(8, 4) // 从站地址
    const netAddr = command.substr(2, 4) // 主站地址
    return { address, netAddr, command }
  }

  /** 81功能码的处理 新设备广播 **/
  static _decodeFindLora(command) {
    const address = command.substr(14, 4) // 从站地址
    let netAddr = command.substr(24, 4) // 主站地址
    const type = command.substr(18, 2) // 设备类型
    // TODO 保留对部分老速率设备的地址截取位置不同,以后没有老设备后去掉此功能
    if (type === '06') {
      netAddr = command.substr(22, 4) // 主站地址
    }
    return { address, netAddr, type }
  }

  async sendSlave(data) {
    const event = await this.serialport.writeReMany(data.cmd, 3000)
    try {
      await event.nextForMatch((data) => {
        return data === 'aa87ff22'
      }, 500)
      this.emit('send')
      return event
    } catch (e) {
      event.close()
      this.emit('loss')
      throw new Error(JSON.stringify({ code: 61006, message: '主站未发出此消息' }))
    }
  }
}
module.exports = Master
