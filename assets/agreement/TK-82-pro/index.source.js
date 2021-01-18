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
  if (result.length === 20 && result.substr(0, 4) === '1E03') {
    const result_he = this.validate.he(result.substr(0, 28)).toLowerCase()
    var result_bin = this.validate.hex_to_bin(result_he)
    var d = ''
    for (var i = 0; i < result_bin.toString().length; i++) {
      if (result_bin.toString()[i] === '0') {
        var q = '1'
        d = d.concat(q)
      } else {
        var p = '0'
        d = d.concat(p)
      }
    }
    if (this.validate.bin_to_hex(d).toUpperCase() !== result.substr(18, 2)) {
      return 401
    }
    ret[0] = parseFloat(parseInt(result.substr(16, 2), 16) * 3.5 / 100).toFixed(2)
    ret[1] = parseInt(result.substr(12, 4), 16) / 1000
    const bj = this.validate.hex_to_bin(result.substr(4, 2))
    for (let j = bj.toString().length - 1; j >= 4; j--) {
      if (bj.toString()[j] === '1') {
        ret[2] = 8 - j
        break
      }
    }
    return ret
  } else {
    return null
  }
}

Relay.prototype.navi = function(result) {
  if (result.length === 20 && result.substr(0, 4) === '1E03') {
    return result.substr(6, 6)
  }
  return null
}

module.exports = Relay
