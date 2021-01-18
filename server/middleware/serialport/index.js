/**
 * @author lifeng
 * @date 19-7-8
 * @Description: 串口接口入口,open 以后的串口放在一个Map里，以接口名为key
*/
exports.SerialPortInf = require('./inf')

exports.serialPorts = new Map()

exports.open = function(path, ...arg) {
  this._port = new this.SerialPortInf(path, ...arg)
  this.serialPorts.set(path, this._port)
  return this._port
}

exports.clear = async function() {
  for (const value of this.serialPorts.values()) {
    await new Promise(res => {
      value.close(() => {
        res()
      })
    })
  }
  this.serialPorts.clear()
}
