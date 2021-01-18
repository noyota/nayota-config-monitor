function Relay(options, validate) {
  this.addrmin = 1 // 地址最小
  this.addrmax = 20 // 地址最大
  this.validate = validate
  this.button = [0, 1, 2, 3]
  this.options = options // options.defaulttest  options.defaultbutton
  var _this = this
  _this.checksAddress = []
  options.defaultCheck.forEach(function(test) {
    _this['analysis' + test.address] = test.analysis// test.analysis 解析函数
    _this.checksAddress.push(test.address)
  })
  options.defaultOperate.forEach(function(operate) {
    _this['analysis' + operate.address] = operate.analysis// test.analysis 解析函数
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
  var addr = startAddr || this.addrmin
  var end = endAddr || this.addrmax
  var commond = ''
  while (addr <= end) {
    var addrS = addr.toString(16)
    while (addrS.length < 2) {
      addrS = '0' + addrS
    }
    commond += this.validate.crc16(addrS + '0300000001') + ','
    addr++
  }
  var validate = this.validate
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperates = this.options.defaultOperate
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  return {
    cmd: commond.substr(0, commond.length - 1),
    resolve: function(result, success, error) {
      result = rmDb(result) // 处理指令长度
      if (result.length < 14) {
        return error(400)
      }
      var data = result.substr(0, result.length - 4)
      var validatedata = validate.crc16(data)
      if (validatedata.toLowerCase() !== result.toLowerCase()) {
        return error(401)
      }
      var func = result.substr(2, 2)
      if (func !== '03') {
        return error(402)
      }
      var address = result.substr(0, 2)
      var json = {
        shortAddress: address,
        name: devicename + address,
        checks: defaultCheck,
        operates: defaultOperates,
        attribute: attribute
      }
      return success(json)
    },
    changeAddr: true // 改变地址
  }
}
/**
 * 改变设备地址
 * 回调 【addr】  返回
 */
Relay.prototype.changeAddr = function(options) {
  if (typeof options.shortAddress === 'number')options.shortAddress = options.shortAddress.toString(16)
  // console.log('1=' + options.shortAddress)
  while (options.shortAddress.length < 2) {
    options.shortAddress = '0' + options.shortAddress
  }
  if (typeof options.oldAddr === 'number')options.oldAddr = options.oldAddr.toString(16)
  while (options.oldAddr.length < 2) {
    options.oldAddr = '0' + options.oldAddr
  }

  var validate = this.validate
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperates = this.options.defaultOperate
  var attribute = []
  var attrMap = {}
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
    attribute.forEach((item) => {
      attrMap[item.key] = item.value
    })
  }
  let low
  if (attrMap['最低温度']) {
    low = attrMap['最低温度']
  } else {
    low = 20
  }
  low = this.validate.numToHexStr(low, 4)
  let high
  if (attrMap['最高温度']) {
    high = attrMap['最高温度']
  } else {
    high = 30
  }
  high = this.validate.numToHexStr(high, 4)
  var commond = options.oldAddr + '100003000608' + low + high + '410000' + options.shortAddress
  commond = this.validate.crc16(commond)
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      result = rmDb(result)
      if (result.length < 16) {
        return error(400)
      }
      var data = result.substr(0, result.length - 4)
      var validatedata = validate.crc16(data)
      if (validatedata.toUpperCase() !== result.toUpperCase()) {
        return error(401)
      }
      var func = result.substr(2, 2)
      if (func !== '10') {
        return error(402)
      }
      var json = {
        shortAddress: options.shortAddress,
        name: devicename + options.shortAddress,
        checks: defaultCheck,
        operates: defaultOperates,
        attribute: attribute
      }
      return success(json)
    }
  }
}

/**
 * 读取数据
 */

Relay.prototype.read = function(addr, code) {
  if (code == null)code = this.checksAddress
  else if (typeof code === 'string') code = [code]
  var analysis = []
  var _this = this
  code = ['0', '1', '2', '3', '4', '5', '6']
  code.forEach(function(item) {
    analysis.push(_this['analysis' + item])
  })
  if (typeof addr === 'number')addr = addr.toString(16)
  while (addr.length < 2) {
    addr = '0' + addr
  }
  var commond = this.validate.crc16(addr + '0300000006')
  var validate = this.validate
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      var item = rmDb(result)
      console.log(item, item.length)
      var res = {}
      var allChecks = {}
      if (item !== '') {
        var validatedata = validate.crc16(item.substr(0, item.length - 4))
        if (validatedata.toLowerCase() !== item.toLowerCase()) {
          return error(401)
        }
        var addrback = item.substr(0, 2)
        if (addrback.toLowerCase() !== addr.toLowerCase()) {
          return error(403)
        }
        const func = item.substr(2, 2)
        if (func !== '03') {
          return error(402)
        }
        // // 设定空开的信号强度的地址为10,
        // allChecks['0'] = parseInt(item.substr(item.length - 2, 2))
        // 室温设定
        allChecks['1'] = item.substr(6, 4)
        // 温度
        allChecks['2'] = item.substr(14, 4)
        const data = validate.hex_to_bin(item.substr(26, 4))
        // 模式
        allChecks['3'] = data.substr(1, 4)
        // 模式
        allChecks['4'] = data.substr(5, 2)
        // 开关
        allChecks['5'] = parseInt(data.substr(7, 1))
        // 锁屏
        allChecks['6'] = parseInt(data.substr(8, 1))
      }
      code.forEach(function(item, index) {
        var analyze = null
        eval(analysis[index])
        if (allChecks[item] && analyze) {
          res[item] = analyze(allChecks[item])
        } else {
          res[item] = allChecks[item]
        }
      })
      success(res)
    }
  }
}
Relay.prototype.write = function(addr, code, state, operates) { // 01 05 00 03 FF 00 7C 3A 线圈4 01 05 00 03 00 00 3D CA
  if (typeof addr === 'number')addr = addr.toString(16)
  while (addr.length < 2) {
    addr = '0' + addr
  }
  code = parseInt(code)
  if (typeof code === 'number')code = code.toString(16)
  let code1
  var ostate = state
  let commond = ''
  if (code === '2') {
    state = parseInt(state)
    state = this.validate.numToHexStr(state, 4)
    code1 = '0002'
    commond = this.validate.crc16(addr + '100002000102' + state)
  } else {
    let kg
    let sp
    let moshi = '00'
    let fs = '0001'
    operates.forEach(function(item) {
      if (item.shortAddress === '3') {
        if (code === '3') {
          item.value = state
        }
        if (item.value === 0) {
          fs = '1000'
        }
        if (item.value === 1) {
          fs = '0100'
        }
        if (item.value === 2) {
          fs = '0010'
        }
        if (item.value === 3) {
          fs = '0001'
        }
      } else if (item.shortAddress === '4') {
        if (code === '4') {
          item.value = state
        }
        if (item.value === 0) {
          moshi = '00'
        }
        if (item.value === 1) {
          moshi = '01'
        }
        if (item.value === 2) {
          moshi = '11'
        }
      } else if (item.shortAddress === '5') {
        if (code === '5') {
          item.value = state
        }
        kg = item.value || 0
      } else if (item.shortAddress === '6') {
        if (code === '6') {
          item.value = state
        }
        sp = item.value || 0
      }
    })
    state = '0' + fs + moshi + kg + sp + '0000000'
    state = this.validate.bin_to_hex(state)
    code1 = '0005'
    commond = this.validate.crc16(addr + '06' + code1 + state)
  }
  var validate = this.validate
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      var item = rmDb(result)
      if (item.length < 16) {
        return error(400)
      }
      var validatedata = validate.crc16(item.substr(0, item.length - 4))
      if (validatedata.toLowerCase() !== item.toLowerCase()) {
        return error(401)
      }
      var addrback = item.substr(0, 2)
      if (addrback.toLowerCase() !== addr.toLowerCase()) {
        return error(403)
      }
      const func = item.substr(2, 2)
      if (func !== '06' && func !== '10') {
        return error(402)
      }
      return success(ostate)
    }
  }
}
/**
 * 简析主动上报指令，并且生成一个数组
 */
Relay.prototype.decode = function(result) {
  return result
}
Relay.prototype.navi = function(result) {
  if (result) {
    const ret = result.substr(0, 2)
    return ret
  }
  return null
}

module.exports = Relay
