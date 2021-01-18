function Relay(options, validate) {
  this.addrmin = 1 // 地址最小
  this.addrmax = 247 // 地址最大
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
    commond += this.validate.crc16(addrS + '0300000002') + ','
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
    timeout: 5000,
    resolve: function(result, success, error) {
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

  var commond = options.oldAddr + '100015000102' + options.shortAddress + '01'
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
    timeout: 5000,
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
  var allOperates = ['1']
  allOperates.forEach(function(item) {
    code.push(item)
  })
  while (addr.length < 2) {
    addr = '0' + addr
  }
  var commond1 = this.validate.crc16(addr + '0300000002') // 总用水量
  var commond2 = this.validate.crc16(addr + '0100010001') // 阀门状态
  var cmd = []
  code.forEach(function(item) {
    analysis.push(_this['analysis' + item])
    if (code.indexOf('0') > -1) {
      cmd.push(commond1)
    }
    if (code.indexOf('1') > -1) {
      cmd.push(commond2)
    }
  })
  var validate = this.validate
  return {
    cmd: cmd.join(','),
    timeout: 5000,
    resolve: function(result, success, error) {
      var data = result.split(',')
      if (data.length !== cmd.length) {
        return error(400)
      }
      var res = {}
      var allChecks = {}
      for (var i = 0; i < data.length; i++) {
        var item = rmDb(data[i])
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
          if (func !== '03') {
            return error(402)
          }
          allChecks['0'] = item.substr(6, 8)
        }

        if (cmd[i] === commond2) {
          const func = item.substr(2, 2)
          if (func !== '03') {
            return error(402)
          }
          allChecks['1'] = item.substr(6, 8)
        }
        code.forEach(function(item, index) {
          var analyze = null
          eval(analysis[index])
          // if(item=='15'){
          //   console.log(allChecks[item], analyze(allChecks[item]))
          // }
          if (allChecks[item] && analyze) {
            res[item] = analyze(allChecks[item])
          }
        })
      }
      success(res)
    }
  }
}

Relay.prototype.write = function(addr, code, state, operates) { // 01 05 00 03 FF 00 7C 3A 线圈4 01 05 00 03 00 00 3D CA
  if (typeof addr === 'number') addr = addr.toString(16)
  while (addr.length < 2) {
    addr = '0' + addr
  }
  state = parseInt(state)
  console.log(state)
  if (state === 1) {
    state = 'FF'
  } else if (state === 0) {
    state = '00'
  }
  var validate = this.validate
  var commond1 = this.validate.crc16(addr + '05000100' + state)
  return {
    cmd: commond1,
    timeout: 15000,
    resolve: function(result, success, error) {
      var item = rmDb(result)
      console.log(item.length)
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
      var func = item.substr(2, 2)
      if (func !== '05') {
        return error(402)
      }
      let rdata = item.substr(10, 2)
      if (rdata === '00') rdata = 0
      else if (rdata === 'ff') rdata = 1
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
