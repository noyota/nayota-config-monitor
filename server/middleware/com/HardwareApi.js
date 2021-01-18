/**
 * @author lifeng
 * @date 19-9-9
 * @Description: 设备发送命令api 只有设备发送会拥有大量多指令的循环,为防止多指令造成的假死状态,(特别是配置时)
*/
const verification = require('../../utils/verification')
const path = require('path')
const EventEmitter = require('events').EventEmitter

const h4 = {
  '1200': '1',
  '2400': '2',
  '4800': '3',
  '9600': '4',
  '19200': '5',
  '38400': '6',
  '115200': '7'
}
// 校验 数据位 采集位
const l4 = {
  '8none1': '1',
  '8even1': '2',
  '8odd1': '3',
  '8none2': '4',
  '8even2': '5',
  '8odd2': '6'
}

class Hardware extends EventEmitter {
  /**
   * @param port
   * @param model  设备对象
   */
  constructor(port, model) {
    super()
    this.port = port
    this.line = false
    this.model = model
    if (model.hardwareWord) {
      const hardwareWord = model.hardwareWord
      const agreement = hardwareWord.agreement
      this.setAmAndHww(agreement, hardwareWord)
    }
    this.findRuning = false // find函数的打断
    this.readRuning = false // read函数的打断
    this.writeRuning = false // read函数的打断
  }

  setModel(model) {
    this.model = model
    this.status = model.status || 0
    const hardwareWord = model.hardwareWord
    const agreement = hardwareWord.agreement
    this.setAmAndHww(agreement, hardwareWord)
  }

  setAmAndHww(agreement, hardwareWord) {
    const Agree = process.env.DEBUG === 'true' ? require(path.resolve('assets/' + agreement.hanShu)) : require(path.resolve('assets/' + agreement.minNode))
    this.agree = new Agree(hardwareWord, verification)
  }

  getSerialPort() {
    return this.port.getSerialPort()
  }

  async find(startAddr, endAddr) {
    const find = this.agree.find(startAddr, endAddr)
    const cmdArr = find.cmd.split(',')
    let index = 0
    let result = ''
    this.findRuning = true
    while (this.findRuning && index < cmdArr.length && result === '') {
      try {
        if (this.model.type === 1) {
          const { baud, dataBit, stopBit, verification } = this.model.serialData
          const port = h4[baud.toString()] + l4[dataBit + verification + stopBit]
          result = await this.port.writeReOne(cmdArr[index], port, '03')
        } else {
          result = await this.port.writeReOne(cmdArr[index])
        }
      } catch (e) {
        console.log(e.message)
      }
      index++
    }
    return new Promise((res, rej) => {
      find.resolve(result, (data) => {
        data.changeAddr = find.changeAddr
        res(data)
      }, (err) => {
        rej(new Error(err))
      })
    })
  }

  /**
   * 配置地址(简单配置)  可能为多条配置指令,都要下发,并获得反馈拼接, 反馈指令以逗号拼接
   * @param data
   * @return {Promise}
   */
  async config(data) {
    const find = this.agree.changeAddr(data)
    const cmdArr = find.cmd.split(',')
    let index = 0
    const result = []
    while (index < cmdArr.length) {
      try {
        if (this.model.type === 1) {
          const { baud, dataBit, stopBit, verification } = this.model.serialData
          const port = h4[baud.toString()] + l4[dataBit + verification + stopBit]
          result.push(await this.port.writeReOne(cmdArr[index], port, '03'))
        } else {
          result.push(await this.port.writeReOne(cmdArr[index]))
        }
      } catch (e) {
        console.log(e.message)
        result.push('')
      }
      index++
    }
    return new Promise((res, rej) => {
      find.resolve(result.join(','), (data) => {
        res(data)
      }, (err) => {
        rej(new Error(err))
      })
    })
  }

  /**
   * 设备的复杂参数配置(额外的配置)
   * 定义上此配置可配可不配,根据实际情况添加设备的附加功能  由于485主动上报的独特性,此函数定义为专门针对485主动上报功能
   * 示例:当前此配置是发给LORA从站设备 配置设备的主动上报
   * @return {Promise<boolean>}
   */
  async encode() {
    if (!this.agree.encode) throw new Error(JSON.stringify({ code: 63005, message: '无485主动上报配置函数' }))
    const { baud, dataBit, stopBit, verification } = this.model.serialData
    const port = h4[baud.toString()] + l4[dataBit + verification + stopBit]
    const config = this.agree.encode(this.model.shortAddress, this.model.attribute, port)
    if (!config || !config.cmd || config.cmd === '') throw new Error(JSON.stringify({ code: 64001, message: '无485主动上报配置指令' }))
    const cmdArr = config.cmd.split(',')
    let index = 0
    let nb_try = config.try || 1 // 新增发送尝试次数
    let sendSuccess = true
    while (index < cmdArr.length) {
      try {
        if (this.model.type === 1) {
          const result = await this.port.writeReOne(cmdArr[index], undefined, '11')
          if (result !== null && result.length >= 6 && result.substr(0, 6) !== cmdArr[index].substr(0, 6)) {
            throw new Error('返回错误')
          }
        } else {
          throw new Error('有线设备无此功能')
        }
        nb_try = config.try || 1 // 成功后重置尝试次数
        index++
      } catch (e) {
        console.log(e)
        if (nb_try === 1) {
          // 一旦错误 跳出发送 ,直接到退出配置指令
          sendSuccess = false
          break
        } else {
          nb_try--
        }
      }
    }
    try {
      await this.port.writeReOne(undefined, undefined, '14')
    } catch (e) {
      console.log('退出14功能配置命令都失败了')
      throw new Error('退出14功能配置命令都失败了')
    }
    if (!sendSuccess) throw new Error('配置失败了')
    return true
  }

  /**
   * 设备的复杂参数配置(额外的配置)
   * 定义为需要计量字段统计
   * 示例:当前此配置是发给LORA从站设备 配置设备的计量,主要用于24路电流的统计
   * @return {Promise<boolean>}
   */
  async configure() {
    if (!this.agree.configure) throw new Error(JSON.stringify({ code: 63005, message: '无485计量配置函数' }))
    const { baud, dataBit, stopBit, verification } = this.model.serialData
    const port = h4[baud.toString()] + l4[dataBit + verification + stopBit]
    const config = this.agree.configure(this.model.shortAddress, this.model.attribute, port)
    if (!config || !config.cmd || config.cmd === '') throw new Error(JSON.stringify({ code: 64001, message: '无485计量配置指令' }))
    const cmdArr = config.cmd.split(',')
    let index = 0
    let nb_try = config.try || 1 // 新增发送尝试次数
    let sendSuccess = true
    while (index < cmdArr.length) {
      try {
        if (this.model.type === 1) {
          const result = await this.port.writeReOne(cmdArr[index], undefined, '17')
          if (result !== null && result.length >= 4 && result.substr(0, 4) !== cmdArr[index].substr(0, 4)) {
            throw new Error('返回错误')
          }
        } else {
          throw new Error('有线设备无此功能')
        }
        nb_try = config.try || 1 // 成功后重置尝试次数
        index++
      } catch (e) {
        console.log(e)
        if (nb_try === 1) {
          // 一旦错误 跳出发送 ,直接到退出配置指令
          sendSuccess = false
          break
        } else {
          nb_try--
        }
      }
    }
    if (!sendSuccess) throw new Error('配置失败了')
    return true
  }

  /**
   * 读数据
   * @param code 数组
   * @return {Promise}
   */
  async read(code) {
    if (!this.agree.read) throw new Error(JSON.stringify({ code: 63005, message: '无读取函数' }))
    const read = this.agree.read(this.model.shortAddress, code)
    if (!read || !read.cmd || read.cmd === '') throw new Error(JSON.stringify({ code: 64001, message: '无读取指令' }))
    const cmdArr = read.cmd.split(',')
    let index = 0
    const result = []
    let nb_try = read.try || 1 // 新增发送尝试次数
    this.readRuning = true
    while (this.readRuning && index < cmdArr.length) {
      try {
        if (this.model.type === 1) {
          const { baud, dataBit, stopBit, verification } = this.model.serialData
          const port = h4[baud.toString()] + l4[dataBit + verification + stopBit]
          result.push(await this.port.writeReOne(cmdArr[index], port, '03'))
        } else {
          result.push(await this.port.writeReOne(cmdArr[index]))
        }
        index++
      } catch (e) {
        console.log(e.message)
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
    if (!this.agree.write) throw new Error(JSON.stringify({ code: 63005, message: '无写入函数' }))
    const write = this.agree.write(this.model.shortAddress, code, state, operates)
    if (!write || !write.cmd || write.cmd === '') throw new Error(JSON.stringify({ code: 64001, message: '无写入指令' }))
    const cmdArr = write.cmd.split(',')
    let index = 0
    const result = []
    let nb_try = write.try || 1 // 新增发送尝试次数
    this.writeRuning = true
    while (this.writeRuning && index < cmdArr.length) {
      try {
        if (this.model.type === 1) {
          const { baud, dataBit, stopBit, verification } = this.model.serialData
          const port = h4[baud.toString()] + l4[dataBit + verification + stopBit]
          result.push(await this.port.writeReOne(cmdArr[index], port, '03'))
        } else {
          result.push(await this.port.writeReOne(cmdArr[index]))
        }
        index++
      } catch (e) {
        console.log(e.message)
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
   * 设备监听反馈
   */
  listen() {
    const { model } = this
    if (this.agree.navi) {
      this.port.navi = this.agree.navi
      this.port.on(`node${model.shortAddress}`, (command) => {
        const result = this.agree.decode(command)
        if (result) { // 导航函数 导航到对应设备
          this.emit('accept')
          this.emit('message', result)
        }
      })
    }
  }

  /**
   * 打断一些可能在运行的命令
   */
  stop() {
    if (this.findRuning) this.findRuning = false
    if (this.readRuning) this.readRuning = false
    if (this.writeRuning) this.writeRuning = false
  }

  /**
   * 打断读
   */
  stopRead() {
    if (this.readRuning) this.readRuning = false
  }

  close() {
    this.port.removeAllListeners(`node${this.model.shortAddress}`)
    this.removeAllListeners('message')
  }
}
module.exports = Hardware
