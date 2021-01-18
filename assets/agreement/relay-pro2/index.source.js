function Relay(options, validate) {
  this.addrmin = 20 // 地址最小
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
/**
 * 搜索设备
 * 回调 [addr] 返回搜索到的设备的地址
 */
Relay.prototype.find = function(startAddr, endAddr) {
  if (startAddr && typeof startAddr === 'string')startAddr = parseInt(startAddr)
  if (endAddr && typeof endAddr === 'string')endAddr = parseInt(endAddr)
  var addr = startAddr || this.addrmin
  var end = endAddr || this.addrmax
  var commond = '000300640001c404'
  var validate = this.validate
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
      if (result.length < 14) {
        return error(400)
      }
      var data = result.substr(0, result.length - 4)
      var validatedata = validate.crc16(data)
      if (validatedata !== result) {
        return error(401)
      }
      var addr = result.substr(0, 2)
      if (addr !== '00') {
        return error(403)
      }
      var func = result.substr(2, 2)
      if (func !== '03') {
        return error(402)
      }
      var address = result.substr(8, 2)
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
  while (options.shortAddress.length < 2) {
    options.shortAddress = '0' + options.shortAddress
  }
  var commond = '0006006400' + options.shortAddress
  commond = this.validate.crc16(commond)
  var validate = this.validate
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
      if (result.length < 14) {
        return error(400)
      }
      var data = result.substr(0, result.length - 4)
      var validatedata = validate.crc16(data)
      if (validatedata.toUpperCase() !== result.toUpperCase()) {
        return error(401)
      }
      var addr = result.substr(0, 2)
      if (addr !== '00') {
        return error(403)
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
  if (typeof addr === 'number')addr = addr.toString(16)
  while (addr.length < 2) {
    addr = '0' + addr
  }
  var validate = this.validate
  var commond = addr + '0100000004'
  commond = validate.crc16(commond)
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if (result.length < 12) {
        return error(400)
      }
      var data = result.substr(0, result.length - 6)
      var validatedata = validate.crc16(data)
      if (validatedata !== result.substr(0, result.length - 2)) {
        return error(401)
      }
      var address = result.substr(0, 2)
      if (address !== addr.toLowerCase()) {
        return error(403)
      }
      var func = result.substr(2, 2)
      if (func !== '01') {
        return error(402)
      }
      data = result.substr(6, 2)
      data = parseInt(data, 16).toString(2)
      while (data.length < 4) {
        data = '0' + data
      }
      var data2 = parseInt(data.substr(0, 2), 16)
      var data1 = parseInt(data.substr(2, 2), 16)
      if (data2 === 0) {
        data2 = 2
      } else if (data2 === 2) {
        data2 = 1
      } else if (data2 === 1) {
        data2 = 0
      }
      if (data1 === 0) {
        data1 = 2
      } else if (data1 === 2) {
        data1 = 1
      } else if (data1 === 1) {
        data1 = 0
      }
      const res = {}
      res['0'] = data1
      res['1'] = data2
      var db = parseInt(result.substr(18, 2), 16)
      res['3'] = db
      success(res)
    }
  }
}
/**
 * 写多个地址
 * 写地址的时候，因为一个16进制写入指令中可能包含其他控制按钮，要传入其他控制按钮的这些状态，保证不改变他们的状态
 * codes[{addr:****,value:**}]
 * ????怎么判断关联地址   //如果有关联地址 返回 提醒pro给出关联地址的信息 pro查询完在提交进来
 */
Relay.prototype.write = function(addr, code, state) { // 01 0F 00 00 00 04 01 0F 7E 92事例  地址1
  addr = addr.toString(16)
  while (addr.length < 2) {
    addr = '0' + addr
  }
  var code1; var code2; var state1 = '00'; var state2 = '00'
  code = parseInt(code)
  if (code === 0) {
    code1 = 0
    code2 = 1
  } else if (code === 1) {
    code1 = 2
    code2 = 3
  }
  if (state === 1) {
    state1 = 'FF'
  } else if (state === 0) {
    state2 = 'FF'
  }
  code1 = code1.toString(16)
  while (code1.length < 2) {
    code1 = '0' + code1
  }
  code2 = code2.toString(16)
  while (code2.length < 2) {
    code2 = '0' + code2
  }
  var validate = this.validate
  var commond1 = addr + '05 00 ' + code1 + state1 + ' 00 '
  commond1 = this.validate.crc16(commond1)
  var commond2 = addr + '05 00 ' + code2 + state2 + ' 00 '
  commond2 = this.validate.crc16(commond2)
  var cmd = ''
  if (state1 === 'FF') {
    cmd = commond2 + ',' + commond1
  } else {
    cmd = commond1 + ',' + commond2
  }
  // console.log(cmd)
  return {
    cmd: cmd,
    resolve: function(result, success, error) {
      var result1 = result.split(',')[0]
      var result2 = result.split(',')[1]
      if (result1.length < 16 && result2.length < 16) {
        return error(400)
      }
      var data = result1.substr(0, result1.length - 4)
      var validatedata = validate.crc16(data)
      if (validatedata !== result1) {
        return error(401)
      }
      data = result2.substr(0, result2.length - 4)
      validatedata = validate.crc16(data)
      if (validatedata !== result2) {
        return error(401)
      }
      var addrback = result1.substr(0, 2)
      if (addrback !== addr.toUpperCase()) {
        return error(403)
      }
      addrback = result2.substr(0, 2)
      if (addrback !== addr.toUpperCase()) {
        return error(403)
      }
      var func = result1.substr(2, 2)
      if (func !== '05') {
        return error(402)
      }
      func = result2.substr(2, 2)
      if (func !== '05') {
        return error(402)
      }
      var data1 = result1.substr(8, 2)
      var data2 = result2.substr(8, 2)
      if (data1 === '00' && data2 === '00') {
        success(2)
      } else if (state1 === 'FF' && data1 === '00' && data2 === 'ff') {
        success(1)
      } else if (state2 === 'FF' && data1 === '00' && data2 === 'ff') {
        success(0)
      }
      return error(404)
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
  /**
   * 定义个查询指令
   *cmd1:查询电压
   *cmd2:查询电流
   *cmd3:查询电能
   */
  var cmd1 = this.validate.crc16(addr + '0300420001')
  var cmd2 = this.validate.crc16(addr + '0300430001')
  var cmd3 = this.validate.crc16(addr + '0400100001')
  /**
   *commonds --定义数据参数的反馈起始位和惭愧数据参数长度。
   *begin ---数据参数 字节数 反馈起始位*2
   *reslength----数据参数 反馈数据参数长度 下限值-上限值的指令字节数为该长度*2
   *cmd  ------ 非必选，用于设定不同的指令的作用
   */
  var commonds = [
    { begin: 3, reslength: 2 },
    { begin: 5, reslength: 2 },
    { begin: 7, reslength: 2 }
  ]
  var commonds2 = [
    { begin: 3, reslength: 2 }
  ]

  var pars = {}
  for (var o = 0; o < parameters.length; o++) {
    pars[parameters[o].key] = parameters[o].value
  }

  var readTime = parseInt(pars['读取周期']).toString(16)
  var upTime = parseInt(pars['Heartbeat']).toString(16)
  while (readTime.length < 4) {
    readTime = '0' + readTime
  }
  while (upTime.length < 4) {
    upTime = '0' + upTime
  }
  function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/ // 非负浮点数
    if (regPos.test(val)) {
      return true
    } else {
      return false
    }
  }
  function paramData(cmd, commonds, parameter, port, orderNo, cmds, type) {
    orderNo = orderNo.toString(16)
    while (orderNo.length < 2) {
      orderNo = '0' + orderNo
    }
    var allcs = ''
    commonds.forEach(function(commond) {
      var params = parameter.split(',')
      if (type === 'dy') {
        if (params[0] === undefined || !isNumber(params[0])) {
          params[0] = 200
        }
        if (params[1] === undefined || !isNumber(params[1])) {
          params[1] = 0.01
        } else if (parseFloat(params[1]) < 0.01) {
          params[1] = 0.01
        } else if (parseFloat(params[1]) > 1) {
          params[1] = 1
        }
        params[1] = parseFloat(params[1]) * 100
        if (params[2] === undefined || !isNumber(params[2])) {
          params[2] = 1
        } else if (parseInt(commond.reslength) < parseInt(params[2])) {
          params[2] = commond.reslength
        }
        if (params[3] === undefined || !isNumber(params[3])) {
          params[3] = 0
        } else if (parseFloat(params[3]) >= 380) {
          params[3] = 0
        }
        params[3] = parseFloat(params[3]) * 100
        if (params[4] === undefined || !isNumber(params[4])) {
          params[4] = 380
        } else if (parseFloat(params[4]) < parseFloat(params[3])) {
          params[4] = 380
        } else if (parseFloat(params[4]) > 380) {
          params[4] = 380
        }
        params[4] = parseFloat(params[4]) * 100
      }
      if (type === 'dl') {
        if (params[0] === undefined || !isNumber(params[0])) {
          params[0] = 200
        }
        if (params[1] === undefined || !isNumber(params[1])) {
          params[1] = 0.01
        } else if (parseFloat(params[1]) < 0.01) {
          params[1] = 0.01
        } else if (parseFloat(params[1]) > 1) {
          params[1] = 1
        }
        params[1] = parseFloat(params[1]) * 100
        if (params[2] === undefined || !isNumber(params[2])) {
          params[2] = 1
        } else if (parseInt(commond.reslength) < parseInt(params[2])) {
          params[2] = commond.reslength
        }
        if (params[3] === undefined || !isNumber(params[3])) {
          params[3] = 0
        } else if (parseFloat(params[3]) >= 10) {
          params[3] = 0
        }
        params[3] = parseFloat(params[3]) * 100
        if (params[4] === undefined || !isNumber(params[4])) {
          params[4] = 10
        } else if (parseFloat(params[4]) < parseFloat(params[3])) {
          params[4] = 10
        } else if (parseFloat(params[4]) > 10) {
          params[4] = 10
        }
        params[4] = parseFloat(params[4]) * 100
      }
      if (type === 'dn') {
        if (params[0] === undefined || !isNumber(params[0])) {
          params[0] = 200
        }
        if (params[1] === undefined || !isNumber(params[1])) {
          params[1] = 0.1
        } else if (parseFloat(params[1]) < 0.1) {
          params[1] = 0.1
        } else if (parseFloat(params[1]) > 1) {
          params[1] = 1
        }
        params[1] = parseFloat(params[1]) * 100
        if (params[2] === undefined || !isNumber(params[2])) {
          params[2] = 1
        } else if (parseInt(commond.reslength) < parseInt(params[2])) {
          params[2] = commond.reslength
        }
        if (params[3] === undefined || !isNumber(params[3])) {
          params[3] = 0
        } else if (parseFloat(params[3]) >= 10) {
          params[3] = 0
        }
        params[3] = parseFloat(params[3]) * 100
        if (params[4] === undefined || !isNumber(params[4])) {
          params[4] = 20000
        } else if (parseFloat(params[4]) < parseFloat(params[3])) {
          params[4] = 20000
        } else if (parseFloat(params[4]) > 10) {
          params[4] = 20000
        }
        params[4] = parseFloat(params[4]) * 100
      }
      // console.log(JSON.stringify(params))
      let changecycle = parseInt(params[0]).toString(16)
      while (changecycle.length < 2) {
        changecycle = '0' + changecycle
      }
      let rangeofchange = parseInt(params[1]).toString(16)
      while (rangeofchange.length < 2) {
        rangeofchange = '0' + rangeofchange
      }
      if (parseInt(params[2]) > 1) {
        commond.reslength = parseInt(commond.reslength) - parseInt(params[2]) + 1
      }
      var resth = parseInt(commond.reslength * 2)
      let lowerLimitValue = parseInt(params[3]).toString(16)
      while (lowerLimitValue.length < resth) {
        lowerLimitValue = '0' + lowerLimitValue
      }

      let upperlimitvalue = parseInt(params[4]).toString(16)
      while (upperlimitvalue.length < resth) {
        upperlimitvalue = '0' + upperlimitvalue
      }

      commond.begin = commond.begin.toString(16)
      while (commond.begin.length < 2) {
        commond.begin = '0' + commond.begin
      }

      commond.reslength = commond.reslength.toString(16)
      while (commond.reslength.length < 2) {
        commond.reslength = '0' + commond.reslength
      }

      var cscmd = commond.begin + commond.reslength + changecycle + rangeofchange + lowerLimitValue + upperlimitvalue
      // 计算单条数据参数的指令长度
      var wlength = (parseInt(cscmd.length / 2) + 1).toString(16)
      while (wlength.length < 2) {
        wlength = '0' + wlength
      }
      cscmd = wlength + cscmd
      allcs = allcs + cscmd
    })

    var alength = parseInt(allcs.length / 2).toString(16)
    while (alength.length < 2) {
      alength = '0' + alength
    }
    var allNumber = commonds.length.toString(16)
    while (allNumber.length < 2) {
      allNumber = '0' + allNumber
    }
    var ncmd = '00' + port + readTime + upTime + alength + allNumber + allcs + cmd
    if (ncmd.length > 128) {
      // 计算指令截成几段
      let i = 1
      var j = parseInt(ncmd.length / 128) + 1
      var xh = i + '' + j
      while (ncmd.length > 128) {
        var mm = ncmd.substr(0, 128)
        ncmd = ncmd.substr(128)
        xh =
          cmds.push(addr + orderNo + xh + mm)
        i = i + 1
      }
      if (ncmd.length > 0) {
        cmds.push(addr + orderNo + j + '' + j + ncmd)
      }
    } else {
      cmds.push(addr + orderNo + '11' + ncmd)
    }
    return cmds
  }
  var cmds = []
  cmds = paramData(cmd1, commonds, pars['dy'], port, 0, cmds, 'dy')
  cmds = paramData(cmd2, commonds, pars['dl'], port, 1, cmds, 'dl')
  cmds = paramData(cmd3, commonds2, pars['dn'], port, 2, cmds, 'dn')
  return {
    cmd: cmds.join(','),
    try: 5
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
