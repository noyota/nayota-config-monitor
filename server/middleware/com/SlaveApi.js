const verification = require('../../utils/verification')
const path = require('path')
const EventEmitter = require('events').EventEmitter
class Slave extends EventEmitter {
  /**
   * @param masterApi
   * @param model  主站配置信息
   */
  constructor(masterApi, model) {
    super()
    this.masterApi = masterApi
    this.line = false
    this.model = model
    if (model.agreement && model.hardwareWord) {
      this.setAmAndHww(model.agreement, model.hardwareWord)
    }
    this.status = model.status || 0
    if (model.control) this.netAddr = model.control.number // 中控必须要对象,不能是_id 因为需要number
    this.loraAddr = model.shortAddress
    this.readRuning = false // read函数的打断
    this.writeRuning = false // write函数的打断
  }

  setModel(model) {
    this.model = model
    if (model.agreement && model.hardwareWord) {
      this.setAmAndHww(model.agreement, model.hardwareWord)
    }
    this.status = model.status || 0
    if (model.control) this.netAddr = model.control.number
    this.loraAddr = model.shortAddress
  }

  setAmAndHww(agreement, hardwareWord) {
    const Agree = process.env.DEBUG === 'true' ? require(path.resolve('assets/' + agreement.hanShu)) : require(path.resolve('assets/' + agreement.minNode))
    this.loraAgree = new Agree(hardwareWord, verification)
  }

  getSerialPort() {
    return this.masterApi.serialport
  }

  /**
   * 退出从站配置模式
   */
  async outConfig() {
    const data = 'AA0000AA00000FB9FF22'
    const event = await await this.masterApi.sendSlave({ cmd: data })
    try {
      await event.nextForMatch((data) => {
        const command = verification.validateLora(data)
        if (command && command.slice(12, 14) === '8f') {
          return true
        } else {
          return false
        }
      }, 300)
      event.close()
      return true
    } catch (e) {
      event.close()
      throw e
    }
  }

  async configSlave(data) {
    const config = this.loraAgree.config(data.shortAddress, data.netAddr, '0000', data.loraData, data.attribute)
    const event = await await this.masterApi.sendSlave(config)
    try {
      await event.nextForMatch((result) => {
        const command = verification.validateLora(result)
        if (command && command.length > 14 && (command.slice(12, 14) === '82' || command.slice(12, 14) === '8d')) {
          return true
        } else {
          return false
        }
      }, 500)
      event.close()
      return true
    } catch (e) {
      event.close()
      throw e
    }
  }
  /**
   * LORA的复杂参数配置(额外的配置)
   * 定义上此配置可配可不配,根据实际情况添加设备的附加功能 空调模块的配置
   * 示例:当前此配置是发给LORA从站设备 配置设备的主动上报
   * @return {Promise<boolean>}
   */
  async encode(data) {
    if (!this.loraAgree.configure) throw new Error(JSON.stringify({ code: 63005, message: '无配置函数' }))
    const { netAddr, shortAddress } = data
    const encode = this.loraAgree.configure({ netAddr, shortAddress }, data.attribute)
    if (!encode || !encode.cmd || encode.cmd === '') throw new Error(JSON.stringify({ code: 64001, message: '无配置指令' }))
    const cmdArr = encode.cmd.split(',')
    let index = 0
    const result = []
    let nb_try = encode.try || 1 // 新增发送尝试次数
    while (index < cmdArr.length) {
      const event = await this.masterApi.sendSlave({ cmd: cmdArr[index] })
      try {
        const resu = await event.nextForMatch((data) => {
          const command = verification.validateLora(data, netAddr, shortAddress)
          if (command) {
            return true
          }
        }, this.airTime(cmdArr[index].length / 2, 50))
        const command = verification.validateLora(resu, netAddr, shortAddress)
        result.push(command)
        nb_try = encode.try || 1 // 新增发送尝试次数
        index++
        await event.next(200)
        event.close()
      } catch (e) {
        event.close()
        if (nb_try === 1) {
          result.push('')
          index++
        } else {
          nb_try--
        }
      }
    }
    return new Promise((res, rej) => {
      encode.resolve(result.join(','), (data) => {
        this.emit('send')
        res(data)
      }, (err) => {
        this.emit('loss')
        rej(new Error(err))
      })
    })
  }
  /**
   * 通用写一回一函数
   * @param cmd 命令
   * @param port 串口参数
   * @param type 命令类型
   * @return {Promise<*>}
   */
  async writeReOne(cmd = '', port = '', type = '') {
    const { netAddr, loraAddr } = this
    cmd = this.loraAgree.encode(cmd, { type, port, netAddr, loraAddr })
    const event = await this.masterApi.sendSlave({ cmd: cmd })
    try {
      const result = await event.nextForMatch((data) => {
        const command = verification.validateLora(data, netAddr, loraAddr)
        if (command) {
          return true
        }
      }, this.airTime(cmd.length / 2, 50))
      const command = verification.validateLora(result, netAddr, loraAddr)
      event.close()
      this.emit('send')
      return this.loraAgree.decode(command, { netAddr, loraAddr })
    } catch (e) {
      this.emit('lose')
      event.close()
      throw e
    }
  }

  /**
   * 读数据
   * @param code 数组
   * @return {Promise}
   */
  async read(code) {
    if (!this.loraAgree.read) throw new Error(JSON.stringify({ code: 63005, message: '无读取函数' }))
    const { netAddr, loraAddr } = this
    const read = this.loraAgree.read({ netAddr, loraAddr }, code)
    if (!read || !read.cmd || read.cmd === '') throw new Error(JSON.stringify({ code: 64001, message: '无读取指令' }))
    const cmdArr = read.cmd.split(',')
    let index = 0
    const result = []
    let nb_try = read.try || 1 // 新增发送尝试次数
    this.readRuning = true
    while (this.readRuning && index < cmdArr.length) {
      const event = await this.masterApi.sendSlave({ cmd: cmdArr[index] })
      try {
        const resu = await event.nextForMatch((data) => {
          const command = verification.validateLora(data, netAddr, loraAddr)
          if (command) {
            return true
          }
        }, this.airTime(cmdArr[index].length / 2, 50))
        const command = verification.validateLora(resu, netAddr, loraAddr)
        event.close()
        result.push(command)
        index++
      } catch (e) {
        console.log(e.message)
        event.close()
        if (nb_try === 1) {
          result.push('')
          index++
        } else {
          nb_try--
        }
      }
    }
    return new Promise((res, rej) => {
      read.resolve(result.join(','), (data) => {
        this.emit('send')
        res(data)
      }, (err) => {
        this.emit('loss')
        rej(new Error(err))
      })
    })
  }

  async write(code, state, operates) {
    if (!this.loraAgree.write) throw new Error(JSON.stringify({ code: 63005, message: '无写入函数' }))
    const { netAddr, loraAddr } = this
    const write = this.loraAgree.write({ netAddr, loraAddr }, code, state, operates)
    if (!write || !write.cmd || write.cmd === '') throw new Error(JSON.stringify({ code: 64001, message: '无写入指令' }))
    const cmdArr = write.cmd.split(',')
    let index = 0
    const result = []
    let nb_try = write.try || 1 // 新增发送尝试次数
    this.writeRuning = true
    while (this.writeRuning && index < cmdArr.length) {
      const event = await this.masterApi.sendSlave({ cmd: cmdArr[index] })
      try {
        const resu = await event.nextForMatch((data) => {
          const command = verification.validateLora(data, netAddr, loraAddr)
          if (command) {
            return true
          }
        }, this.airTime(cmdArr[index].length / 2, 50))
        const command = verification.validateLora(resu, netAddr, loraAddr)
        event.close()
        result.push(command)
        index++
      } catch (e) {
        event.close()
        if (nb_try === 1) {
          result.push('')
          index++
        } else {
          nb_try--
        }
      }
    }
    return new Promise((res, rej) => {
      write.resolve(result.join(','), (data) => {
        this.emit('send')
        res(data)
      }, (err) => {
        this.emit('loss')
        rej(new Error(err))
      })
    })
  }

  /**
   * 从站监听反馈
   */
  listen() {
    const { netAddr, loraAddr } = this
    this.masterApi.on(`node${this.model.shortAddress}`, (command) => {
      const result = this.loraAgree.decode(command, { netAddr, loraAddr })
      this.emit('accept')
      if (typeof result === 'string' && this.navi) { // 导航函数 导航到对应设备
        this.emit(`node${this.navi(result)}`, result)
      } else {
        this.emit('message', result)
      }
    })
  }

  close() {
    this.masterApi.removeAllListeners(`node${this.model.shortAddress}`)
    this.removeAllListeners('message')
  }

  /**
   * 计算空中来回的大致时间做延时等待
   */
  airTime(bLen, bLen2) {
    let sf = 12
    let wd = 125
    let cr = 2
    if (this.model && this.model.loraData) {
      const { factor, bandwidth, codingrate } = this.model.loraData
      if (factor)sf = parseInt(factor)
      if (bandwidth)wd = bandwidth === '06' ? 62.5 : bandwidth === '07' ? 125 : bandwidth === '08' ? 250 : 500
      if (codingrate)cr = parseInt(codingrate)
    }
    const tsym = Math.pow(2, sf) / wd
    const tpreamble = 12.25 * tsym
    const tpayload = (8 + (8 * bLen - 4 * sf + 44) / (4 * (sf - 2)) * (4 + cr)) * tsym
    const tpayload2 = (8 + (8 * bLen2 - 4 * sf + 44) / (4 * (sf - 2)) * (4 + cr)) * tsym
    const ms = parseInt(tpreamble * 2 + tpayload + tpayload2) + 100
    if (ms > 2000) return 2000
    else if (ms < 500) return 500
    else return ms
  }

  /**
   * 打断读
   */
  stopRead() {
    if (this.readRuning) this.readRuning = false
  }
}
module.exports = Slave
