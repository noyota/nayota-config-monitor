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
    var XOR = (161 ^ 5 ^ parseInt(addrS, 16) ^ 118).toString(16)
    var sum = (1000000000000000 + (0 - (161 + 5 + parseInt(addrS, 16) + 118 + parseInt(XOR, 16)))).toString(16)
    var SUM = sum.substr(sum.length - 2, 2)
    commond += 'A105' + addrS + '7600' + XOR + SUM + ','
    addr++
  }
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
      if (result.length < 44) {
        return error(400)
      }
      var func = result.substr(0, 4)
      if (func !== 'a814') {
        return error(402)
      }
      var addr = result.substr(8, 16)
      var addr2 = result.substr(4, 2)
      var json = {
        shortAddress: addr,
        name: devicename + addr2,
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
  while (options.shortAddress.length < 2) {
    options.shortAddress = '0' + options.shortAddress
  }
  var oddr1 = options.oldAddr.substr(0, 2)
  var oddr2 = options.oldAddr.substr(2, 2)
  var oddr3 = options.oldAddr.substr(4, 2)
  var oddr4 = options.oldAddr.substr(6, 2)
  var oddr5 = options.oldAddr.substr(8, 2)
  var oddr6 = options.oldAddr.substr(10, 2)
  var oddr7 = options.oldAddr.substr(12, 2)
  var oddr8 = options.oldAddr.substr(14, 2)
  var XOR1 = (161 ^ 13 ^ 6 ^ parseInt(oddr1, 16) ^ parseInt(oddr2, 16) ^ parseInt(oddr3, 16) ^ parseInt(oddr4, 16) ^ parseInt(oddr5, 16) ^ parseInt(oddr6, 16) ^ parseInt(oddr7, 16) ^ parseInt(oddr8, 16) ^ parseInt(options.shortAddress, 16)).toString(16)
  var sum1 = (1000000000000000 + (0 - (161 + 13 + 6 + parseInt(oddr1, 16) + parseInt(oddr2, 16) + parseInt(oddr3, 16) + parseInt(oddr4, 16) + parseInt(oddr5, 16) + parseInt(oddr6, 16) + parseInt(oddr7, 16) + parseInt(oddr8, 16) + parseInt(options.shortAddress, 16) + parseInt(XOR1, 16)))).toString(16)
  var SUM1 = sum1.substr(sum1.length - 2, 2)
  var commond1 = 'A10D0006' + options.oldAddr + options.shortAddress + XOR1 + SUM1
  var XOR2 = (161 ^ 4 ^ parseInt(options.shortAddress, 16) ^ 10).toString(16)
  var sum2 = (1000000000000000 + (0 - (161 + 4 + parseInt(options.shortAddress, 16) + 10 + parseInt(XOR2, 16)))).toString(16)
  var SUM2 = sum2.substr(sum2.length - 2, 2)
  var commond2 = 'A104' + options.shortAddress + '0A' + XOR2 + SUM2

  // commond = this.validate.crc16(commond)
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperates = this.options.defaultOperate
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  return {
    cmd: commond1 + ',' + commond2,
    resolve: function(result, success, error) {
      result = rmDb(result.split(',')[1])
      if (result.length < 12) {
        return error(400)
      }
      var func = result.substr(0, 4)
      if (func !== 'a804') {
        return error(402)
      }
      var data = result.substr(4, 2)
      if (data.toLowerCase() !== options.shortAddress.toLowerCase()) {
        return error(403)
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
}

// 写入
Relay.prototype.write = function(addr, code, state) {
  addr = addr.toString(16)
  while (addr.length < 2) {
    addr = '0' + addr
  }
  if (state === 0) {
    state = '4,null'
  }
  let condtion
  let code1 = null
  if (state.toString().indexOf(',') > -1) {
    condtion = parseInt(state.split(',')[0])
    code1 = state.split(',')[1]
  } else {
    condtion = state
  }
  let commond
  /* 远程控制*/
  if (condtion === 4) {
    const XOR = (161 ^ 4 ^ parseInt(addr, 16) ^ 116).toString(16)
    const sum = (1000000000000000 + (0 - (161 + 4 + parseInt(addr, 16) + 116 + parseInt(XOR, 16)))).toString(16)
    const SUM = sum.substr(sum.length - 2, 2)
    commond = 'A104' + addr + '74' + XOR + SUM
  } else if (condtion === 5 && code1 !== null) {
    /* 远程控制 */
    /* 修改公共密码*/
    let pass = code1
    if (typeof pass === 'number')pass = pass.toString(16)
    while (pass.length < 6) {
      pass = '0' + pass
    }
    var pass1 = (parseInt((pass.substr(0, 1)), 16) + 48).toString(16)
    var pass2 = (parseInt((pass.substr(1, 1)), 16) + 48).toString(16)
    var pass3 = (parseInt((pass.substr(2, 1)), 16) + 48).toString(16)
    var pass4 = (parseInt((pass.substr(3, 1)), 16) + 48).toString(16)
    var pass5 = (parseInt((pass.substr(4, 1)), 16) + 48).toString(16)
    var pass6 = (parseInt((pass.substr(5, 1)), 16) + 48).toString(16)
    const XOR = (161 ^ 10 ^ parseInt(addr, 16) ^ 90 ^ parseInt(pass1, 16) ^ parseInt(pass2, 16) ^ parseInt(pass3, 16) ^ parseInt(pass4, 16) ^ parseInt(pass5, 16) ^ parseInt(pass6, 16)).toString(16)
    const sum = (1000000000000000 + (0 - (161 + 10 + parseInt(addr, 16) + 90 + parseInt(pass1, 16) + parseInt(pass2, 16) + parseInt(pass3, 16) + parseInt(pass4, 16) + parseInt(pass5, 16) + parseInt(pass6, 16) + parseInt(XOR, 16)))).toString(16)
    const SUM = sum.substr(sum.length - 2, 2)
    commond = 'A10A' + addr + '5A' + pass1 + pass2 + pass3 + pass4 + pass5 + pass6 + XOR + SUM
  } else if (condtion === 6 && code1 !== null) {
    /* 修改公共密码*/
    /* 修改编程密码*/
    let pass = code1
    if (typeof pass === 'number')pass = pass.toString()
    while (pass.length < 6) {
      pass = '0' + pass
    }
    const pass1 = (parseInt((pass.substr(0, 1)), 16) + 48).toString(16)
    const pass2 = (parseInt((pass.substr(1, 1)), 16) + 48).toString(16)
    const pass3 = (parseInt((pass.substr(2, 1)), 16) + 48).toString(16)
    const pass4 = (parseInt((pass.substr(3, 1)), 16) + 48).toString(16)
    const pass5 = (parseInt((pass.substr(4, 1)), 16) + 48).toString(16)
    const pass6 = (parseInt((pass.substr(5, 1)), 16) + 48).toString(16)
    const XOR = (161 ^ 10 ^ parseInt(addr, 16) ^ 80 ^ parseInt(pass1, 16) ^ parseInt(pass2, 16) ^ parseInt(pass3, 16) ^ parseInt(pass4, 16) ^ parseInt(pass5, 16) ^ parseInt(pass6, 16)).toString(16)
    const sum = (1000000000000000 + (0 - (161 + 10 + parseInt(addr, 16) + 80 + parseInt(pass1, 16) + parseInt(pass2, 16) + parseInt(pass3, 16) + parseInt(pass4, 16) + parseInt(pass5, 16) + parseInt(pass6, 16) + parseInt(XOR, 16)))).toString(16)
    const SUM = sum.substr(sum.length - 2, 2)
    commond = 'A10A' + addr + '50' + pass1 + pass2 + pass3 + pass4 + pass5 + pass6 + XOR + SUM
  }
  // console.log("commond="+commond)
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      result = rmDb(result)
      var head = result.substr(0, 4)
      if (head === 'a8a8') {
        result = result.substr(2, result.length - 2)
        head = result.substr(0, 4)
      }
      if (head !== 'a804' && head !== 'a80e') {
        return error(401)
      }
      const func = result.substr(4, 2)
      if (func.toLowerCase() !== addr.toLowerCase()) {
        return error(402)
      }
      if (condtion === 4) {
        const func = result.substr(6, 2)
        if (func !== '74') {
          return error(402)
        }
      } else if (condtion === 5) {
        const func = result.substr(6, 2)
        if (func !== '5a') {
          return error(402)
        }
      } else if (condtion === 6) {
        const func = result.substr(6, 2)
        if (func !== '50') {
          return error(402)
        }
      } else {
        return error(404)
      }
      success(condtion)
    }
  }
}

Relay.prototype.navi = function(result) {
  if (result) {
    const ret = result.substr(4, 2)
    return ret
  }
  return null
}

module.exports = Relay
