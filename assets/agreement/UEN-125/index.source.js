function Relay(options, validate) {
  this.addrmin = 1 // 地址最小
  this.addrmax = 255 // 地址最大
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
var rmDb = function(result) {
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
    commond += this.validate.crc16(addrS + '0400100002') + ','
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
      result = rmDb(result)
      if (result.length < 18) {
        return error(400)
      }
      var data = result.substr(0, result.length - 4)
      var validatedata = validate.crc16(data)
      // console.log(validatedata,result)
      if (validatedata.toLowerCase() !== result.toLowerCase()) {
        return error(401)
      }
      var func = result.substr(2, 2)
      if (func !== '04') {
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
      console.log(json)
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
  while (options.shortAddress.length < 2) {
    options.shortAddress = '0' + options.shortAddress
  }
  if (typeof options.oldAddr === 'number')options.oldAddr = options.oldAddr.toString(16)
  while (options.oldAddr.length < 2) {
    options.oldAddr = '0' + options.oldAddr
  }

  var commond = options.oldAddr + '06015600' + options.shortAddress
  commond = this.validate.crc16(commond)
  var validate = this.validate
  var devicename = this.options.name
  var defaultOperates = this.options.defaultOperate
  var defaultCheck = this.options.defaultCheck
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if (result.length < 16) {
        return error(400)
      }
      var data = result.substr(0, result.length - 4)
      var validatedata = validate.crc16(data)
      if (validatedata.toUpperCase() !== result.toUpperCase()) {
        return error(401)
      }
      var func = result.substr(2, 2)
      if (func !== '06') {
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
  while (addr.length < 2) {
    addr = '0' + addr
  }
  var commond1 = this.validate.crc16(addr + '04 00 10 00 02') // 电流
  var commond2 = this.validate.crc16(addr + '04 00 12 00 01') // 漏电
  var commond3 = this.validate.crc16(addr + '04 00 13 00 02') // 电压
  var commond4 = this.validate.crc16(addr + '04 00 15 00 01')// 温度
  var commond5 = this.validate.crc16(addr + '04 00 1D 00 01')// 开关状态
  var commond6 = this.validate.crc16(addr + '04 00 16 00 02')// 有功功率
  var commond7 = this.validate.crc16(addr + '04 00 18 00 02')// 有功能量
  var cmd = []
  var allOperates = ['1']
  allOperates.forEach(function(item) {
    code.push(item)
  })
  code.forEach(function(item) {
    if (item === '10') {
      cmd.push(commond1)
    }
    if (item === '12') {
      cmd.push(commond2)
    }
    if (item === '13') {
      cmd.push(commond3)
    }
    if (item === '15') {
      cmd.push(commond4)
    }
    if (item === '1') {
      cmd.push(commond5)
    }
    if (item === '16') {
      cmd.push(commond6)
    }
    if (item === '18') {
      cmd.push(commond7)
    }
    analysis.push(_this['analysis' + item])
  })

  var validate = this.validate
  return {
    cmd: cmd.join(','),
    resolve: function(result, success, error) {
      var data = result.split(',')
      if (data.length !== cmd.length) {
        return error(400)
      }
      var res = {}
      var allChecks = {}
      for (var i = 0; i < data.length; i++) {
        var item = rmDb(data[i])
        if (item !== '') {
          var validatedata = validate.crc16(item.substr(0, item.length - 4))
          if (validatedata.toLowerCase() !== item.toLowerCase()) {
            return error(401)
          }
          var addrback = item.substr(0, 2)
          if (addrback !== addr.toLowerCase()) {
            return error(403)
          }
          if (cmd[i] === commond1) {
            const func = item.substr(2, 2)
            if (func !== '04') {
              return error(402)
            }
            allChecks['10'] = item.substr(6, 8)
          } else if (cmd[i] === commond2) {
            const func = item.substr(2, 2)
            if (func !== '04') {
              return error(402)
            }
            allChecks['12'] = item.substr(6, 4)
          } else if (cmd[i] === commond3) {
            const func = item.substr(2, 2)
            if (func !== '04') {
              return error(402)
            }
            allChecks['13'] = item.substr(6, 8)
          } else if (cmd[i] === commond4) {
            const func = item.substr(2, 2)
            if (func !== '04') {
              return error(402)
            }
            allChecks['15'] = item.substr(6, 4)
          } else if (cmd[i] === commond5) {
            const func = item.substr(2, 2)
            if (func !== '04') {
              return error(402)
            }
            allChecks['1'] = item.substr(6, 4)
          } else if (cmd[i] === commond6) {
            const func = item.substr(2, 2)
            if (func !== '04') {
              return error(402)
            }
            allChecks['16'] = item.substr(6, 8)
          } else if (cmd[i] === commond7) {
            const func = item.substr(2, 2)
            if (func !== '04') {
              return error(402)
            }
            allChecks['18'] = item.substr(6, 8)
          }
        }
      }
      code.forEach(function(item, index) {
        var analyze = null
        eval(analysis[index])
        // if (item == '15') {
        //   console.log(allChecks[item], analyze(allChecks[item]))
        // }
        if (allChecks[item] && analyze) {
          res[item] = analyze(allChecks[item])
        }
      })
      console.log(res)
      success(res)
    }
  }
}

Relay.prototype.write = function(addr, code, state) { // 01 05 00 03 FF 00 7C 3A 线圈4 01 05 00 03 00 00 3D CA
  if (typeof addr === 'number')addr = addr.toString(16)
  while (addr.length < 2) {
    addr = '0' + addr
  }
  state = parseInt(state)
  console.log(state)
  if (state === 1) {
    state = '01'
  } else if (state === 0) {
    state = '04'
  }
  var validate = this.validate
  var commond = this.validate.crc16(addr + '0601D000' + state)
  var cmd = [commond]
  return {
    cmd: cmd.join(','),
    resolve: function(result, success, error) {
      var data = result.split(',')
      if (data.length !== cmd.length) {
        return error(400)
      }
      for (var i = 0; i < data.length; i++) {
        var item = data[i]
        item = item.substr(0, item.length - 4)
        var validatedata = validate.crc16(item)
        if (validatedata.toLowerCase() !== data[i].toLowerCase()) {
          return error(401)
        }
        var addrback = item.substr(0, 2)
        if (addrback.toLowerCase() !== addr.toLowerCase()) {
          return error(403)
        }
      }
      var func = item.substr(2, 2)
      if (func !== '06') {
        return error(402)
      }
      let rdata = item.substr(10, 2)
      if (rdata === '04') rdata = 0
      else if (rdata === '01') rdata = 1
      return success(rdata)
    }
  }
}

Relay.prototype.navi = function(result) {
  if (result) {
    const ret = result.substr(0, 2)
    return ret
  }
  return null
}

module.exports = Relay
