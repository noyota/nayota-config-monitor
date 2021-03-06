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
  var commond = '505752204F46460D'
  // while (addr <= end) {
  //   var addrS = addr.toString(16)
  //   while (addrS.length < 2) {
  //     addrS = '0' + addrS
  //   }
  //   var XOR = (161 ^ 5 ^ parseInt(addrS, 16) ^ 118).toString(16)
  //   var sum = (1000000000000000 + (0 - (161 + 5 + parseInt(addrS, 16) + 118 + parseInt(XOR, 16)))).toString(16)
  //   var SUM = sum.substr(sum.length - 2, 2)
  //   commond += 'A105' + addrS + '7600' + XOR + SUM + ','
  //   addr++
  // }
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
      var addr = '01'
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
      commond = '505752204F4E0D'
    }
    if (state === 0) {
      commond = '505752204F46460D'
    }
  }
  if (code === '1') {
    if (state === 1) {
      commond = '534F555243452031460D'
    }
    if (state === 2) {
      commond = '534F555243452032460D'
    }
    if (state === 3) {
      commond = '534F555243452033300D'
    }
    if (state === 4) {
      commond = '534F555243452034300D'
    }
    if (state === 5) {
      commond = '4D555445204F4E0D'
    }
    if (state === 6) {
      commond = '4D555445204F46460D'
    }
  }
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      result = rmDb(result)
      if (result.length > 0 && result !== '3A') {
        return error(401)
      }
      success(state)
    }
  }
}

Relay.prototype.navi = function(result) {
  if (result) {
    const ret = '01'
    return ret
  }
  return null
}

module.exports = Relay
