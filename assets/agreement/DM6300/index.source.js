function Relay(options, validate) {
  this.addrmin = 1 // 地址最小
  this.addrmax = 40 // 地址最大
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
function rmDb(result) {
  return result
}

/**
 * 搜索设备
 * 回调 [addr] 返回搜索到的设备的地址
 */
Relay.prototype.find = function(startAddr, endAddr) {
  if (startAddr && typeof startAddr === 'string')startAddr = parseInt(startAddr)
  if (endAddr && typeof endAddr === 'string')endAddr = parseInt(endAddr)
  var addr = startAddr || this.addrmin
  var end = endAddr || this.addrmax
  var commond = '2330303020300D'
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperates = this.options.defaultOperate
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      result = rmDb(result)
      var addr = '0a'
      var json = {
        shortAddress: addr,
        name: devicename + addr,
        checks: defaultCheck,
        operates: defaultOperates,
        attribute: attribute
      }
      return success(json)
    },
    changeAddr: false // 改变地址
  }
}

Relay.prototype.write = function(addr, code, state) {
  // addr = addr.toString(16)
  // while (addr.length < 2) {
  //   addr = '0' + addr
  // }
  let commond
  if (code === '0') {
    if (state === 1) {
      commond = '233030303020310D'
    }
    if (state === 0) {
      commond = '233030303020300D'
    }
  }
  if (code === '1') {
    if (state === 1) {
      commond = '233030343020310D'
    }
    if (state === 0) {
      commond = '233030343020300D'
    }
  }
  if (code === '2') {
    if (state === 1) {
      commond = '233030303320310D'
    }
    if (state === 0) {
      commond = '233030303320300D'
    }
  }
  if (code === '3') {
    if (state === 1) {
      commond = '233030383020310D'
    }
    if (state === 2) {
      commond = '233030383020320D'
    }
    if (state === 3) {
      commond = '233030383020330D'
    }
  }
  if (code === '4') {
    if (state === 1) {
      commond = '233030383120310D'
    }
    if (state === 2) {
      commond = '233030383120320D'
    }
    if (state === 3) {
      commond = '233030383120330D'
    }
  }
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      result = rmDb(result)
      if (result.length > 0 && result !== '500d') {
        return error(401)
      }
      success(state)
    }
  }
}

Relay.prototype.navi = function(result) {
  if (result) {
    const ret = '0a'
    return ret
  }
  return null
}

module.exports = Relay
