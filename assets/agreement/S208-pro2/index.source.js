function Relay(options, validate) {
  this.addrmin = 1 // 地址最小
  this.addrmax = 20 // 地址最大
  this.validate = validate
  this.button = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b']
  this.dl = []
  this.ld = []
  this.wd = []
  this.gl = []
  this.options = options // options.defaulttest  options.defaultbutton
  var _this = this
  options.defaultCheck.forEach(function(test) {
    _this['analysis' + test.address] = test.analysis// test.analysis 解析函数
  })
  // name company analysis address sort
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
    commond += this.validate.crc16(addrS + '0100000009') + ','
    addr++
  }
  var validate = this.validate
  var name = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperate = this.options.defaultOperate
  return {
    cmd: commond.substr(0, commond.length - 1),
    resolve: function(result, success, error) {
      if (result.length < 14) {
        return error(400)
      }
      var data = result.substr(0, result.length - 4)
      var validatedata = validate.crc16(data)
      if (validatedata.toUpperCase() !== result.toUpperCase()) {
        return error(401)
      }
      var func = result.substr(2, 2)
      if (func !== '01') {
        return error(402)
      }
      data = result.substr(0, 2)
      var json = {
        shortAddress: data,
        name: name + data,
        checks: defaultCheck,
        operates: defaultOperate
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
  if (typeof options.shortAddress === 'number') options.shortAddress = options.shortAddress.toString(16)
  while (options.shortAddress.length < 2) {
    options.shortAddress = '0' + options.shortAddress
  }
  if (typeof options.oldAddr === 'number') options.oldAddr = options.oldAddr.toString(16)
  while (options.oldAddr.length < 2) {
    options.oldAddr = '0' + options.oldAddr
  }
  var commond = options.oldAddr + '0602F0BA' + options.shortAddress
  commond = this.validate.crc16(commond)
  var validate = this.validate
  var name = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperate = this.options.defaultOperate
  var commond2 = validate.crc16(options.shortAddress + '01000000ff')
  return {
    cmd: commond + ',' + commond2,
    resolve: function(result, success, error) {
      var cmd = result.split(',')
      result = cmd[0]
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
      var result1 = cmd[1]
      if (result1.length < 12) {
        return error(400)
      }
      data = result1.substr(0, result.length - 4)
      validatedata = validate.crc16(data)
      if (validatedata.toUpperCase() !== result1.toUpperCase()) {
        return error(401)
      }
      data = result1.substr(6, 2)
      var s = parseInt(data, 16)
      var total = 0
      while (s / 2 >= 1) {
        var d = s % 2
        if (d === 1)total++
        s = parseInt(s / 2)
      }
      var json = {
        shortAddress: options.shortAddress,
        name: name + options.shortAddress,
        checks: defaultCheck,
        operates: defaultOperate
      }
      return success(json)
    }
  }
}

Relay.prototype.readBtnOne = function(addr, code) {
  addr = addr.toString(16)
  while (addr.length < 2) {
    addr = '0' + addr
  }
  var commond = addr + '010000000B'
  var validate = this.validate
  var devicename = this.options.devicename
  var defaulttest = JSON.parse(this.options.defaulttest)
  var defaultbutton = JSON.parse(this.options.defaultbutton)
  commond = this.validate(commond)
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if (result.length < 14) {
        return error(400)
      }
      var addrback = result.substr(6, 4)
      addrback = parseInt(addrback, 16).toString(2)
      while (addrback.length < 16) {
        addrback = '0' + addrback
      }
      var state = null
      if (code < 8) {
        state = addrback.substr(7 - code, 1)
      } else if (code > 7 < 11) {
        state = addrback.substr(23 - code, 1)
      } else {
        return error(400)
      }
      // alert(state);
      var json = {
        state: state
      }
      return success(json)
    }
  }
}

/**
     * 读取所有
     */
Relay.prototype.readAll = function(address) {
}
/**
     * 读取单个数据
     */
Relay.prototype.read = function(addr, code) {
  var analysis = this['analysis' + code]
  code = code.toString(10)
  if (code.length === 1) {
    code = '000' + code
  } else if (code.length === 2) {
    code = '00' + code
  } else if (code.length === 3) {
    code = '0' + code
  }
  var code1, code2
  code1 = code.substr(0, 2)
  code2 = code.substr(2, 2)
  if (parseInt(code1) > 10) {
    code1 = parseInt(code1).toString(16)
    if (code1.length == 1) {
      code1 = '0' + code1
    }
  }
  if (parseInt(code2) > 10) {
    code2 = parseInt(code2).toString(16)
    if (code2.length == 1) {
      code2 = '0' + code2
    }
  }
  code = code1 + code2
  if (typeof addr === 'number') addr = addr.toString(16)
  while (addr.length < 2) {
    addr = '0' + addr
  }
  var validate = this.validate
  var commond = addr + '03' + code + '0001'
  commond = validate(commond)
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if (result.length < 14) {
        return error(400)
      }
      var data = result.substr(0, result.length - 4)
      var validatedata = validate(data)
      if (validatedata.toUpperCase() != result.toUpperCase()) {
        return error(401)
      }
      var addrback = result.substr(0, 2)
      if (addrback.toUpperCase() != addr.toUpperCase()) {
        return error(403)
      }
      var func = result.substr(2, 2)
      if (func != '03') {
        return error(402)
      }
      var data = result.substr(6, 4)
      var analyze = null
      eval(analysis)
      if (analyze) {
        return success(analyze(data))
      }
      return success(data)
    }
  }
}

/**
     * 写多个地址
     */
Relay.prototype.write = function(addr, codes) { // 01 0F 00 00 00 04 01 0F 7E 92事例  地址1

}
/**
     * 写单个地址
     * 写地址的时候，因为一个16进制写入指令中可能包含其他控制按钮，要传入其他控制按钮的这些状态，保证不改变他们的状态
     */
Relay.prototype.writeOne = function(addr, code, state) { // 01 05 00 03 FF 00 7C 3A 线圈4 01 05 00 03 00 00 3D CA
  addr = addr.toString(16)
  while (addr.length < 2) {
    addr = '0' + addr
  }
  code = parseInt(code)
  code = code.toString(16)
  while (code.length < 2) {
    code = '0' + code
  }
  if (state) state = 'ff'
  else state = '00'

  var validate = this.validate
  var commond = addr + '0500' + code + state + '00'
  commond = this.validate(commond)
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if (result.length < 16) {
        return error(400)
      }
      var data = result.substr(0, result.length - 4)
      var validatedata = validate(data)
      if (validatedata.toUpperCase() != result.toUpperCase()) {
        return error(401)
      }
      var addrback = result.substr(0, 2)
      if (addrback != addr.toUpperCase()) {
        return error(403)
      }
      var func = result.substr(2, 2)
      if (func != '05') {
        return error(402)
      }
      var data = result.substr(8, 2)

      if (data == 'FF') data = true
      else if (data == '00') data = false
      return success(data)
    }
  }
}

module.exports = Relay
