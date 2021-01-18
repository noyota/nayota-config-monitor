const httpApiRoute = require('../../routes/http-api-routes')
const path = require('path')
const EventEmitter = require('events').EventEmitter
class Http extends EventEmitter {
  /**
   * @param model  配置信息
   */
  constructor(model) {
    super()
    this.line = false
    this.model = model
    if (model.hardwareWord) {
      this.setAmAndHww(model.hardwareWord.agreement, model.hardwareWord)
    }
    this.status = model.status || 0
    this.address = model.shortAddress
    this.readRuning = false // read函数的打断
    this.writeRuning = false // write函数的打断
  }

  setModel(model) {
    this.model = model
    if (model.hardwareWord) {
      this.setAmAndHww(model.hardwareWord.agreement, model.hardwareWord)
    }
    this.status = model.status || 0
    this.address = model.shortAddress
  }

  setAmAndHww(agreement, hardwareWord) {
    this.agree = httpApiRoute.agrees.get(hardwareWord.code) // 若已经实例化这个设备字典的协议,不用再实例化
    if (this.agree == null) {
      const Agree = process.env.DEBUG === 'true' ? require(path.resolve('assets/' + agreement.hanShu)) : require(path.resolve('assets/' + agreement.minNode))
      this.agree = new Agree(hardwareWord, httpApiRoute.router)
      httpApiRoute.agrees.set(hardwareWord.code, this.agree) //
    }
  }

  async config(data) {

  }

  /**
   * LORA的复杂参数配置(额外的配置)
   * 定义上此配置可配可不配,根据实际情况添加设备的附加功能 空调模块的配置
   * 示例:当前此配置是发给LORA从站设备 配置设备的主动上报
   * @return {Promise<boolean>}
   */
  async encode(data) {

  }

  /**
   * 读数据
   * @param code 数组
   * @return {Promise}
   */
  async read(code) {

  }

  async write(code, state, operates) {

  }

  /**
   * 从站监听反馈
   */
  listen() {
    this.agree.on(`node${this.model.shortAddress}`, (result) => {
      if (result) { // 导航函数 导航到对应设备
        this.emit('accept')
        this.emit('message', result)
      }
    })
  }

  close() {
    this.agree.removeAllListeners(`node${this.model.shortAddress}`)
    this.removeAllListeners('message')
  }

  /**
   * 打断读
   */
  stopRead() {
    if (this.readRuning) this.readRuning = false
  }
}
module.exports = Http
