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
  options.defaultOperate.forEach(function(test) {
    _this['analysis' + test.address] = test.analysis// test.analysis 解析函数
  })
}

// 去掉最后两位信号强度
function rmDb(result) {
  // if (result.length > 2) {
  //   result = result.substr(0, result.length - 2)
  // }
  return result
}

/**
     * 搜索设备
     * 回调 [addr] 返回搜索到的设备的地址
     */
Relay.prototype.find = function(startAddr, endAddr) {
  if (startAddr && typeof startAddr === 'string')startAddr = parseInt(startAddr)
  if (endAddr && typeof endAddr === 'string')endAddr = parseInt(endAddr)
  // var addr = startAddr || this.addrmin
  // var end = endAddr || this.addrmax
  var commond = this.validate.crc16('0a0bff0c0d')
  // console.log(startAddr)
  // console.log(endAddr)
  // console.log(commond)
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperate = this.options.defaultOperate
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      result = rmDb(result)
      var address = '01'
      var json = {
        shortAddress: address,
        name: devicename + address,
        checks: defaultCheck,
        operates: defaultOperate,
        attribute: attribute
      }
      return success(json)
    },
    changeAddr: false // 改变地址
  }
}
/**
     * 改变设备地址
     * 回调 【addr】  返回
     */
Relay.prototype.changeAddr = function(options) {

}

/**
     * 读取数据
     */
Relay.prototype.read = function(addr, code) {

}

// 写
Relay.prototype.write = function(addr, code, state) { // 01 05 00 03 FF 00 7C 3A 线圈4 01 05 00 03 00 00 3D CA
  while (addr.length < 2) {
    addr = '0' + addr
  }
  var validate = this.validate
  while (code.length < 3) {
    code = '0' + code
  }
  while (state.length < 4) {
    state = '0' + state
  }
  // if (state === 1)state = 'ff'
  // else state = '00'
  var codeone = ''
  if (code === '101') {
    codeone = '050008'
  } else if (code === '102') {
    codeone = '050009'
  } else if (code === '103') {
    codeone = '05000A'
  } else if (code === '104') {
    codeone = '05000B'
  } else if (code === '201') {
    codeone = '060000'
  } else if (code === '202') {
    codeone = '060007'
  } else if (code === '203') {
    codeone = '060009'
  } else if (code === '204') {
    codeone = '06000B'
  }
  var commond = validate.crc16(addr + codeone + state)
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      // result = rmDb(result)
      if (result.length < 16) {
        return error(400)
      }
      var data = result.substr(0, result.length - 4)
      var validatedata = validate.crc16(data)
      if (validatedata !== result) {
        return error(401)
      }
      var addrback = result.substr(0, 2)
      if (addrback !== addr.toLowerCase()) {
        return error(403)
      }
      var func = result.substr(2, 2)
      if (func !== '05' && func !== '06') {
        return error(402)
      }
      data = result.substr(8, 4)
      // if (data === 'ff')data = 1
      // else if (data === '00')data = 0
      return success(data)
    }
  }
}
/**
    * 生成主动上报
    * addr 设备地址
    * parameters 默认参数配置
    * changecycle 默认参数 --变化周期 1个字节
    * rangeofchange 默认参数 --变化幅度 1个字节
    * lowerLimitValue 默认参数 --下限值 字节数(根据commonds中的reslength/2)
    * upperlimitvalue  默认参数 --上限值 字节数(根据commonds中的reslength/2)
    * port 串口配置
    */
Relay.prototype.encode = function(addr, parameters, port) {

}

/**
 * 简析主动上报指令，并且生成一个数组
 */
Relay.prototype.decode = function(result) {
  var ret = {}
  if (result.length >= 18) {
    const func = result.substr(0, 4)
    if (func.toLowerCase() !== '5aa5') {
      return 401
    }
    var codefun = result.substr(4, 4)
    if (codefun !== '0683') {
      return 402
    }
    const code = result.substr(10, 2)
    let d = result.substr(14, 4)
    const analysis = this['analysis' + code]
    var analyze = null
    if (analysis) {
      eval(analysis)
    }
    if (analyze) {
      d = analyze(d)
      ret[code] = d
    }
    return ret
  } else {
    return null
  }
}

Relay.prototype.navi = function(result) {
  if (result) {
    let ret = result.substr(0, 4)
    if (ret.toLowerCase() === '5aa5') {
      ret = '01'
    }
    return ret
  }
  return null
}

module.exports = Relay
