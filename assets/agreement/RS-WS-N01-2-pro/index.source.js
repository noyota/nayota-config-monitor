function Eightlu(options, validate) {
  this.addrmin = 1
  this.addrmax = 40
  this.validate = validate
  this.options = options // options.defaulttest  options.defaultbutton
  var _this = this
  this.readTime = 60
  this.upTime = 120
  _this.checksAddress = []
  options.defaultCheck.forEach(function(test) {
    _this['analysis' + test.address] = test.analysis
    _this.checksAddress.push(test.address)
  })

  // name company analysis address sort
}

Eightlu.prototype.find = function() {
  var commond = 'FDFDFD0000E988'
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperate = this.options.defaultOperate
  var attribute = []
  if (this.options.attribute != null) {
    attribute = this.options.attribute
  }
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if (result.length < 14) {
        return error(400)
      }
      result = result.toUpperCase()
      var func = result.substr(0, 6)
      if (func !== 'FDFDFD') {
        return error(402)
      }
      var data = result.substr(8, 2)

      var json = {
        shortAddress: data,
        name: devicename + data,
        checks: defaultCheck,
        operates: defaultOperate,
        attribute: attribute
      }
      return success(json)
    },
    changeAddr: true
  }
}

Eightlu.prototype.changeAddr = function(options) {
  if (typeof options.shortAddress === 'number')options.shortAddress = options.shortAddress.toString(16)
  while (options.shortAddress.length < 2) {
    options.shortAddress = '0' + options.shortAddress
  }

  var commond = 'fdfdfd00' + options.shortAddress
  commond = this.validate.crc16(commond)
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperate = this.options.defaultOperate
  var attribute = []
  if (this.options.attribute != null) {
    attribute = this.options.attribute
  }
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if (result.length < 14) {
        return error(400)
      }
      result = result.toUpperCase()
      var func = result.substr(0, 6)
      if (func !== 'FDFDFD') {
        return error(402)
      }
      var data = result.substr(8, 2)
      if (data.toUpperCase() !== options.shortAddress.toUpperCase()) {
        return error(403)
      }
      var json = {
        shortAddress: options.shortAddress,
        name: devicename + options.shortAddress,
        checks: defaultCheck,
        operates: defaultOperate,
        attribute: attribute
      }
      return success(json)
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
Eightlu.prototype.encode = function(addr, parameters, port) {
  /**
          * 定义个查询指令
          */
  var cmd1 = this.validate.crc16(addr + '0300000002')
  /**
          *commonds --定义数据参数的反馈起始位和惭愧数据参数长度。
          *begin ---数据参数 反馈起始位
          *reslength----数据参数 反馈数据参数长度 下限值-上限值的指令字节数为该长度/2
          *cmd  ------ 非必选，用于设定不同的指令的作用
          */
  var commonds = [
    { begin: 3, reslength: 2, key: 'sd' },
    { begin: 5, reslength: 2, key: 'wd' }
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
      if (commond.key !== undefined) {
        parameter = pars[commond.key]
        type = commond.key
      }
      var params = parameter.split(',')
      if (type === 'sd') {
        if (params[0] === undefined || !isNumber(params[0])) {
          params[0] = 200
        }
        if (params[1] === undefined || !isNumber(params[1])) {
          params[1] = 0.3
        } else if (parseFloat(params[1]) < 0.3) {
          params[1] = 0.3
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
        } else if (parseFloat(params[3]) >= 100) {
          params[3] = 0
        }
        params[3] = parseFloat(params[3]) * 100
        if (params[4] === undefined || !isNumber(params[4])) {
          params[4] = 100
        } else if (parseFloat(params[4]) < parseFloat(params[3])) {
          params[4] = 100
        } else if (parseFloat(params[4]) > 100) {
          params[4] = 100
        }
        params[4] = parseFloat(params[4]) * 100
      }
      if (type === 'wd') {
        if (params[0] === undefined || !isNumber(params[0])) {
          params[0] = 200
        }
        if (params[1] === undefined || !isNumber(params[1])) {
          params[1] = 0.3
        } else if (parseFloat(params[1]) < 0.3) {
          params[1] = 0.3
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
        } else if (parseFloat(params[3]) >= 100) {
          params[3] = 0
        }
        params[3] = parseFloat(params[3]) * 100
        if (params[4] === undefined || !isNumber(params[4])) {
          params[4] = 100
        } else if (parseFloat(params[4]) < parseFloat(params[3])) {
          params[4] = 100
        } else if (parseFloat(params[4]) > 100) {
          params[4] = 100
        }
        params[4] = parseFloat(params[4]) * 100
      }
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
      var i = 1
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
  cmds = paramData(cmd1, commonds, {}, port, 0, cmds)
  console.log('cmd_' + cmds.join(','))
  return {
    cmd: cmds.join(','),
    try: 5
  }
}
/**
    * 简析主动上报指令，并且生成一个数组
    */
Eightlu.prototype.decode = function(result) {
  var ret = []
  if (result.length === 22) {
    var code = result.substr(2, 2)
    const valid = this.validate.crc16(result.substr(4, 14)).toUpperCase()
    if (valid !== result.substr(4, 18).toUpperCase()) {
      return null
    }
    if (code === '00') {
      const code = 1
      let d = result.substr(10, 4)
      const analysis = this['analysis' + code.toString(16)]
      const analyze = null
      if (analysis) {
        eval(analysis)
      }
      if (analyze) {
        d = analyze(d)
      }
      ret[code.toString(16)] = d
    } else if (code === '01') {
      const code = 2
      let d = result.substr(14, 4)
      const analysis = this['analysis' + code.toString(16)]
      const analyze = null
      if (analysis) {
        eval(analysis)
      }
      if (analyze) {
        d = analyze(d)
      }
      ret[code.toString(16)] = d
    }
    return ret
  } else {
    return null
  }
}

Eightlu.prototype.read = function(address, code) {
  if (code == null)code = this.checksAddress
  else if (typeof code === 'string') code = [code]
  var analysis = []
  var _this = this
  code.forEach(function(item) {
    analysis.push(_this['analysis' + item])
  })
  if (typeof address === 'number')address = address.toString(16)
  while (address.length < 2) {
    address = '0' + address
  }
  var validate = this.validate
  var commond = address + '0300000002'
  commond = validate.crc16(commond)
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if (result.length < 18) {
        return error(400)
      }
      var addrback = result.substr(0, 2)
      if (addrback !== address.toUpperCase()) {
        return error(403)
      }
      var func = result.substr(2, 2)
      if (func !== '03') {
        return error(401)
      }
      var func2 = result.substr(4, 2)
      if (func2 !== '04') {
        return error(402)
      }
      var shidu = result.substr(6, 4)
      var wendu = result.substr(10, 4)
      var res = {}
      code.forEach(function(item, index) {
        var analyze = null
        eval(analysis[index])
        if (item === '1') {
          res['1'] = analyze(shidu)
        } else if (item === '2') {
          res['2'] = analyze(wendu)
        }
      })
      return success(res)
    }
  }
}

module.exports = Eightlu
