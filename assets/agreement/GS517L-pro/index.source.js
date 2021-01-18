function Relay(options, validate) {
  this.addrmin = 1 // 地址最小
  this.addrmax = 100 // 地址最大
  this.validate = validate
  this.button = [0, 1, 2, 3]
  this.options = options // options.defaulttest  options.defaultbutton
  var _this = this
  _this.checksAddress = []
  options.defaultCheck.forEach(function(test) {
    _this['analysis' + test.address] = test.analysis// test.analysis 解析函数
    _this.checksAddress.push(test.address)
  })
}
/**
 * 简析主动上报指令，并且生成一个数组
 */
Relay.prototype.decode = function(result) {
  var ret = {}
  if (result.length === 32) {
    var code = result.substr(0, 2)
    if (code === '80') {
      const valid = this.validate.crc16(result.substr(0, 28)).toLowerCase()
      if (valid !== result.toLowerCase()) {
        return null
      }
      ret[0] = parseInt(result.substr(20, 2), 16) * 9 / 100
      ret[1] = parseInt(result.substr(22, 2), 16)
      ret[2] = parseInt(result.substr(24, 2), 16)
      ret[3] = parseInt(result.substr(19, 1))
    }
    return ret
  } else {
    return null
  }
}

Relay.prototype.navi = function(result) {
  if (result.length === 32 && result.substr(0, 2) === '80') {
    return result.substr(2, 8)
  }
  return null
}

module.exports = Relay
