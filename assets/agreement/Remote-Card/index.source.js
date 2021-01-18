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
// 字符串转16进制
function strToHex(str) {
  if (str === '') return ''
  const bytes = []
  for (var i = 0; i < str.length; i++) {
    bytes.push((str.charCodeAt(i)).toString(16))
  }
  return bytes.join('')
}
// 16进制转字符串
function hexCharCodeToStr(hexCharCodeStr) {
  var trimedStr = hexCharCodeStr.trim()
  var rawStr =
    trimedStr.substr(0, 2).toLowerCase() === '0x'
      ? trimedStr.substr(2)
      : trimedStr
  var len = rawStr.length
  if (len % 2 !== 0) {
    return ''
  }
  var curCharCode
  var resultStr = []
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16) // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode))
  }
  return resultStr.join('')
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
  var addr = startAddr || this.addrmin
  var end = endAddr || this.addrmax

  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperates = this.options.defaultOperate
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  let commond = ''
  while (addr <= end) {
    var addrS = addr.toString()
    while (addrS.length < 3) {
      addrS = '0' + addrS
    }
    commond += strToHex(addrS + 'tst') + ','
    addr++
  }
  return {
    timeout: 5000,
    cmd: commond,
    resolve: function(result, success, error) {
      result = rmDb(result)
      if (result.length < 16) {
        return error(400)
      }
      var func = result.substr(6, 10)
      if (func !== '636c730d0a' && func !== '72756e0d0a') {
        return error(402)
      }
      var add = parseInt(hexCharCodeToStr(result.substr(0, 6))).toString(16)
      var json = {
        shortAddress: add,
        name: devicename + add,
        checks: defaultCheck,
        operates: defaultOperates,
        attribute: attribute
      }
      return success(json)
    },
    changeAddr: false // 改变地址
  }
}

// 读数据
Relay.prototype.read = function(addr, code) {
  if (code == null)code = this.checksAddress
  else if (typeof code === 'string') code = [code]
  var analysis = []
  var _this = this
  code.forEach(function(item) {
    analysis.push(_this['analysis' + item])
  })
  addr = parseInt(addr.toString(), 16).toString()
  while (addr.length < 3) {
    addr = '0' + addr
  }
  var commond = strToHex(addr + 'tst')
  var cmd = [commond]
  return {
    cmd: cmd.join(','),
    timeout: 5000,
    resolve: function(result, success, error) {
      console.log(result)
      var data = result.split(',')
      if (data.length !== cmd.length) {
        return error(400)
      }
      var res = {}
      for (var i = 0; i < data.length; i++) {
        var item = rmDb(data[i])
        var addrback = hexCharCodeToStr(item.substr(0, 6)).toLowerCase()
        if (addrback !== addr.toLowerCase()) {
          return error(403)
        }
        var func = result.substr(6, 10)
        if (func === '636c730d0a') {
          res['1'] = 0
        }
        if (func === '72756e0d0a') {
          res['1'] = 1
        }
      }
      success(res)
    }
  }
}

// 写入
Relay.prototype.write = function(addr, code, state, operates) { // 01 05 00 03 FF 00 7C 3A 线圈4 01 05 00 03 00 00 3D CA
  addr = parseInt(addr.toString(), 16).toString()
  while (addr.length < 3) {
    addr = '0' + addr
  }
  const ostate = parseInt(state)
  if (ostate === 1) {
    state = 'on *'
  }
  if (ostate === 0) {
    state = 'off'
  }
  var commond = strToHex(addr + state)
  return {
    cmd: commond,
    timeout: 5000,
    resolve: function(result, success, error) {
      // var item = rmDb(result)
      // if ((ostate === 0 && item.length < 20) || (ostate === 1 && item.length < 16)) {
      //   return error(400)
      // }
      // var addrback = hexCharCodeToStr(item.substr(0, 6)).toLowerCase()
      // if (addrback !== addr.toLowerCase()) {
      //   return error(403)
      // }
      // const func = item.substr(6, item.length - 6)
      // if (func !== '6f6e206f6b0d0a' && func !== '6f6666206f6b0d0a') {
      //   return error(402)
      // }
      // console.log(result)
      return success(ostate)
    }
  }
}
/**
 * 简析主动上报指令，并且生成一个数组
 */

Relay.prototype.decode = function(result) {
  var ret = {}
  if (result.length === 72) {
    result = result.substr(34, 32)
    const res = hexCharCodeToStr(result)
    if (res === '') {
      return ''
    }
    ret[1] = parseInt(res, 16)
    return ret
  } else {
    return null
  }
}

Relay.prototype.navi = function(result) {
  result = rmDb(result)
  result = result.substr(0, 6)
  var res = hexCharCodeToStr(result)
  if (res === '') {
    return null
  }
  res = parseInt(res, 16)
  return res
}

module.exports = Relay
