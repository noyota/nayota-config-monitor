const SerialPort = require('serialport')
const InterByteTimeout = require('@serialport/parser-inter-byte-timeout')
const { bufferToHexStr, hexStrToBuffer } = require('../../utils/transformation')
const match = /^([0-9A-Fa-f]{2})+$/
const log4js = require('log4js')
const now = new Date()
const Y = now.getFullYear() + '/'
const M = (now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + '/'
const D = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
const yearMonthDate = Y + M + D
log4js.configure({
  appenders: { success: { type: 'file', filename: 'assets/log/' + yearMonthDate + '.log' }},
  categories: { default: { appenders: ['success'], level: 'info' }}
})
const logger_4js = log4js.getLogger('success')
/**
 * 串口方法默认是读写分离的
 * 写方法write 可写字符串和 buffer
 * 由于设计上缺陷,设计配置的时候api接口 直接发送16进制字符串了,后来设计正常工作模式时出现两边接口无法重用(api接口发送16进制字符串,而正常工作模式如使用此接口,择未对16进制字符串做转换,而是,字符串就发字符传,buffer就发buffer)
 * 考虑解决方案:
 * 1. 正常模式再写接口 接收16进制字符串再发送到此对象(问题:新的不必要转发,增加串口接口代码复杂度)
 * 2. 此接口添加16进制字符串判断(这样原来的字符串直接发送功能将失去)
 * 考虑使用方案2,实际应用中直接字符串的发送几乎没有,就算要发送,可以在传入的时候转成buffer就可以
 */
class SerialPortInf extends SerialPort {
  constructor(path, options, openCallback) {
    super(path, options, openCallback)
    this.comName = path
    this.yearMonthDate = this.getDate()
    const parser = this.pipe(new InterByteTimeout({ interval: 30 }))
    this._key = null
    this.called = null // 被调用
    parser.on('data', (data) => {
      console.log(new Date(), '收到1', bufferToHexStr(data)) // debug
      this.Log4JSInfo(bufferToHexStr(data))
      if (this._key) {
        this.emit('get_message', bufferToHexStr(data))
        return this.emit(this._key, data)
      }
      this.emit('message', bufferToHexStr(data)) // 默认监听返回event message 读写分离 写接口为write
    })
  }

  getSerialPort() {
    return this
  }
  getDate() {
    const now = new Date()
    const Y = now.getFullYear() + '/'
    const M = (now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + '/'
    const D = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
    return Y + M + D
  }
  Log4JSInfo(string, type) {
    const N = this.getDate()
    if (this.yearMonthDate !== N) {
      this.yearMonthDate = N
      log4js.configure({
        appenders: { success: { type: 'file', filename: 'assets/log/' + this.yearMonthDate + '.log' }},
        categories: { default: { appenders: ['success'], level: 'info' }}
      })
    }
    string = string.toLowerCase()
    const start = string.indexOf('aa')
    const end = string.indexOf('ff22')
    const json = {}
    if (start < 0 || end < 0) {
      json.type = '其他'
      json.cmd = string
    } else {
      if (string.length === 8) {
        json.code = string.substr(2, 2)
      } else {
        json.code = string.substr(12, 2)
        json.master = string.substr(2, 4)
        json.slave = string.substr(8, 4)
      }
      const send = ['02', '03', '04', '05', '06', '08', '09', '11', '12', '14', '15', '0d', '0e', '17', '18']
      const get = ['82', '83', '84', '85', '86', '88', '89', '91', '92', '94', '95', '8d', '8e', '97', '98', '8a', '8b', '99']
      if (send.indexOf(json.code) > -1) {
        if (type === 0) {
          json.type = '监测主站发出'
        } else {
          json.type = '主站发出'
        }
      }
      if (get.indexOf(json.code) > -1) {
        json.type = '从站发出'
      }
      json.cmd = string
    }
    logger_4js.info(JSON.stringify(json))
  }

  // 获取列表
  static async list() {
    let list = await SerialPort.list()
    list = list.filter(port => port.comName.includes('USB'))
    return list
  }

  write(message) {
    let returnStr = false
    console.log(new Date(), '发出', message) // debug
    if (typeof message === 'string' && match.test(message)) {
      message = hexStrToBuffer(message)
      returnStr = true
    }
    console.log(new Date(), '发出2', message) // debug
    super.write(message)
    this.Log4JSInfo(returnStr ? bufferToHexStr(message) : message, 0)
    this.emit('message', message) // 记录下发的指令 写接口为write
  }

  writeReOne(message, timeout) {
    if (this._key) {
      console.log('串口繁忙') // debug
      throw new Error('PORT_BUSY')
    }
    let returnStr = false
    console.log(new Date(), '发出', message) // debug
    if (typeof message === 'string' && match.test(message)) {
      message = hexStrToBuffer(message)
      returnStr = true
    }
    const t = timeout || 100
    this._key = 'port' + Math.random().toString(16).substr(2, 8)
    super.write(message)
    this.emit('send_message', JSON.stringify({ 'send': returnStr ? bufferToHexStr(message) : message })) // 记录下发的指令 写接口为write
    this.Log4JSInfo(returnStr ? bufferToHexStr(message) : message, 0)
    return new Promise((res, rej) => {
      const cb = (data) => {
        this._key = null
        clearTimeout(timeoutFn)
        res(returnStr ? bufferToHexStr(data) : data)
      }
      this.once(this._key, cb)
      const timeoutFn = setTimeout(() => {
        this.removeListener(this._key, cb)
        this._key = null
        rej('timeout')
      }, t)
    })
  }

  writeReMany(message, timeout) {
    console.log('key', this._key)
    if (this._key) {
      console.log('串口繁忙') // debug
      throw new Error('PORT_BUSY')
    }
    let returnStr = false
    if (typeof message === 'string' && match.test(message)) {
      message = hexStrToBuffer(message)
      returnStr = true
    }
    console.log('message', message, returnStr)
    super.write(message)
    this._key = 'port' + Math.random().toString(16).substr(2, 8)
    const event = new Event(this, timeout, returnStr)
    return event
  }
}

class Event {
  constructor(port, timeout, returnStr) {
    this.port = port
    const t = this.timeout = timeout || 5000
    this.destroyed = false
    this.returnStr = returnStr
    setTimeout(() => {
      if (!this.destroyed) this.close()
    }, t)
  }
  listen(cb) {
    const returnStr = this.returnStr
    if (this.cb != null) {
      this.port.removeListener(this.port._key, this.cb)
    }
    this.cb = (data) => {
      data = returnStr ? bufferToHexStr(data) : data
      cb(data)
    }
    this.port.on(this.port._key, this.cb)
  }

  async next(timeout) {
    if (this.destroyed) throw new Error('已关闭')
    const time = timeout || this.timeout
    const returnStr = this.returnStr
    const result = await new Promise((res, rej) => {
      const cb = (data) => {
        clearTimeout(to)
        res(returnStr ? bufferToHexStr(data) : data)
      }
      this.port.once(this.port._key, cb)
      const to = setTimeout(() => {
        this.port.removeListener(this.port._key, cb)
        rej(new Error('未收到任何反馈,超时'))
      }, time)
    })
    return result
  }

  /**
   * 新的读取
   * @param validate
   * @param timeout
   * @return {Promise<void>}
   */
  async nextForMatch(validate, timeout) {
    if (this.destroyed) throw new Error('已关闭')
    const time = timeout || this.timeout
    const returnStr = this.returnStr
    const result = await new Promise((res, rej) => {
      const cb = (data) => {
        if (validate(bufferToHexStr(data))) {
          clearTimeout(to)
          this.port.removeListener(this.port._key, cb)
          res(returnStr ? bufferToHexStr(data) : data)
        } else {
          this.port.emit('message', data) // 若未通过验证的指令重新推送给message
        }
      }
      this.port.on(this.port._key, cb)
      const to = setTimeout(() => {
        this.port.removeListener(this.port._key, cb)
        rej(new Error('未收到任何正确反馈,超时'))
      }, time)
    })
    return result
  }

  close() {
    if (this.destroyed) return
    this.port._key = null
    if (this.cb) {
      this.port.removeListener(this.port._key, this.cb)
    }
    this.destroyed = true
  }
}
module.exports = SerialPortInf

