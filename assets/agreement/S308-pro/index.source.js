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
      if (result.length < 14) {
        return error(400)
      }
      var data = result.substr(0, result.length - 4)
      var validatedata = validate.crc16(data)
      if (validatedata.toLowerCase() !== result.toLowerCase()) {
        return error(401)
      }
      var func = result.substr(2, 2)
      if (func !== '01') {
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

  var commond = options.oldAddr + '0602F0BA' + options.shortAddress
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
  var cmd = []
  code.forEach(function(item) {
    analysis.push(_this['analysis' + item])
  })

  var allOperates = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a']
  allOperates.forEach(function(item) {
    code.push(item)
  })
  if (typeof addr === 'number')addr = addr.toString(16)

  var commond1 = this.validate.crc16(addr + '030400000b')
  var commond2 = this.validate.crc16(addr + '030300000b')
  var commond3 = this.validate.crc16(addr + '030200000b')
  var commond4 = this.validate.crc16(addr + '030100000b')
  var commond5 = this.validate.crc16(addr + '030700000b')
  var commond6 = this.validate.crc16(addr + '030600000b')
  var commond7 = this.validate.crc16(addr + '010000000b')
  if (code.indexOf('400') > -1 || code.indexOf('401') > -1 || code.indexOf('402') > -1 || code.indexOf('403') > -1 || code.indexOf('404') > -1 || code.indexOf('405') > -1 || code.indexOf('406') > -1 || code.indexOf('407') > -1 || code.indexOf('408') > -1 || code.indexOf('409') > -1 || code.indexOf('410') > -1) {
    cmd.push(commond1)
  }
  if (code.indexOf('300') > -1 || code.indexOf('301') > -1 || code.indexOf('302') > -1 || code.indexOf('303') > -1 || code.indexOf('304') > -1 || code.indexOf('305') > -1 || code.indexOf('306') > -1 || code.indexOf('307') > -1 || code.indexOf('308') > -1 || code.indexOf('309') > -1 || code.indexOf('310') > -1) {
    cmd.push(commond2)
  }
  if (code.indexOf('200') > -1 || code.indexOf('201') > -1 || code.indexOf('202') > -1 || code.indexOf('203') > -1 || code.indexOf('204') > -1 || code.indexOf('205') > -1 || code.indexOf('206') > -1 || code.indexOf('207') > -1 || code.indexOf('208') > -1 || code.indexOf('209') > -1 || code.indexOf('210') > -1) {
    cmd.push(commond3)
  }
  if (code.indexOf('100') > -1 || code.indexOf('101') > -1 || code.indexOf('102') > -1 || code.indexOf('103') > -1 || code.indexOf('104') > -1 || code.indexOf('105') > -1 || code.indexOf('106') > -1 || code.indexOf('107') > -1 || code.indexOf('108') > -1 || code.indexOf('109') > -1 || code.indexOf('110') > -1) {
    cmd.push(commond4)
  }
  if (code.indexOf('700') > -1 || code.indexOf('701') > -1 || code.indexOf('702') > -1 || code.indexOf('703') > -1 || code.indexOf('704') > -1 || code.indexOf('705') > -1 || code.indexOf('706') > -1 || code.indexOf('707') > -1 || code.indexOf('708') > -1 || code.indexOf('709') > -1 || code.indexOf('710') > -1) {
    cmd.push(commond5)
    cmd.push(commond6)
  }
  // if (code.indexOf('0') > -1 || code.indexOf('1') > -1 || code.indexOf('2') > -1 || code.indexOf('3') > -1 || code.indexOf('4') > -1 || code.indexOf('5') > -1 || code.indexOf('6') > -1 || code.indexOf('7') > -1 || code.indexOf('8') > -1 || code.indexOf('9') > -1 || code.indexOf('A') > -1) {
  cmd.push(commond7)
  // }
  while (addr.length < 2) {
    addr = '0' + addr
  }
  var validate = this.validate
  return {
    cmd: cmd.join(','),
    resolve: function(result, success, error) {
      var data = result.split(',')
      var res = {}
      var allChecks = {}
      for (var i = 0; i < data.length; i++) {
        var item = data[i]
        // console.log(item)
        if (item !== '') {
          item = item.substr(0, item.length - 4)
          var validatedata = validate.crc16(item)
          if (validatedata.toLowerCase() !== data[i].toLowerCase()) {
            return error(401)
          }

          var addrback = item.substr(0, 2)
          if (addrback.toLowerCase() !== addr.toLowerCase()) {
            return error(403)
          }
          const func = item.substr(2, 2)
          if (func !== '03' && func !== '01') {
            return error(402)
          }
          if (cmd[i] === commond1) {
            allChecks['400'] = item.substr(6, 4)
            allChecks['401'] = item.substr(10, 4)
            allChecks['402'] = item.substr(14, 4)
            allChecks['403'] = item.substr(18, 4)
            allChecks['404'] = item.substr(22, 4)
            allChecks['405'] = item.substr(26, 4)
            allChecks['406'] = item.substr(30, 4)
            allChecks['407'] = item.substr(34, 4)
            allChecks['408'] = item.substr(38, 4)
            allChecks['409'] = item.substr(42, 4)
            allChecks['410'] = item.substr(46, 4)
          }
          if (cmd[i] === commond2) {
            allChecks['300'] = item.substr(6, 4)
            allChecks['301'] = item.substr(10, 4)
            allChecks['302'] = item.substr(14, 4)
            allChecks['303'] = item.substr(18, 4)
            allChecks['304'] = item.substr(22, 4)
            allChecks['305'] = item.substr(26, 4)
            allChecks['306'] = item.substr(30, 4)
            allChecks['307'] = item.substr(34, 4)
            allChecks['308'] = item.substr(38, 4)
            allChecks['309'] = item.substr(42, 4)
            allChecks['310'] = item.substr(46, 4)
          }
          if (cmd[i] === commond3) {
            allChecks['200'] = item.substr(6, 4)
            allChecks['201'] = item.substr(10, 4)
            allChecks['202'] = item.substr(14, 4)
            allChecks['203'] = item.substr(18, 4)
            allChecks['204'] = item.substr(22, 4)
            allChecks['205'] = item.substr(26, 4)
            allChecks['206'] = item.substr(30, 4)
            allChecks['207'] = item.substr(34, 4)
            allChecks['208'] = item.substr(38, 4)
            allChecks['209'] = item.substr(42, 4)
            allChecks['210'] = item.substr(46, 4)
          }
          if (cmd[i] === commond4) {
            allChecks['100'] = item.substr(6, 4)
            allChecks['101'] = item.substr(10, 4)
            allChecks['102'] = item.substr(14, 4)
            allChecks['103'] = item.substr(18, 4)
            allChecks['104'] = item.substr(22, 4)
            allChecks['105'] = item.substr(26, 4)
            allChecks['106'] = item.substr(30, 4)
            allChecks['107'] = item.substr(34, 4)
            allChecks['108'] = item.substr(38, 4)
            allChecks['109'] = item.substr(42, 4)
            allChecks['110'] = item.substr(46, 4)
          }
          if (cmd[i] === commond5) {
            allChecks['700'] = item.substr(6, 4)
            allChecks['701'] = item.substr(10, 4)
            allChecks['702'] = item.substr(14, 4)
            allChecks['703'] = item.substr(18, 4)
            allChecks['704'] = item.substr(22, 4)
            allChecks['705'] = item.substr(26, 4)
            allChecks['706'] = item.substr(30, 4)
            allChecks['707'] = item.substr(34, 4)
            allChecks['708'] = item.substr(38, 4)
            allChecks['709'] = item.substr(42, 4)
            allChecks['710'] = item.substr(46, 4)
          }
          if (cmd[i] === commond6) {
            const item0 = item.substr(6, 4)
            const item1 = item.substr(10, 4)
            const item2 = item.substr(14, 4)
            const item3 = item.substr(18, 4)
            const item4 = item.substr(22, 4)
            const item5 = item.substr(26, 4)
            const item6 = item.substr(30, 4)
            const item7 = item.substr(34, 4)
            const item8 = item.substr(38, 4)
            const item9 = item.substr(42, 4)
            const item10 = item.substr(46, 4)
            if (allChecks['700'] !== undefined) {
              allChecks['700'] += item0
            }
            if (allChecks['701'] !== undefined) {
              allChecks['701'] += item1
            }
            if (allChecks['702'] !== undefined) {
              allChecks['702'] += item2
            }
            if (allChecks['703'] !== undefined) {
              allChecks['703'] += item3
            }
            if (allChecks['704'] !== undefined) {
              allChecks['704'] += item4
            }
            if (allChecks['705'] !== undefined) {
              allChecks['705'] += item5
            }
            if (allChecks['706'] !== undefined) {
              allChecks['706'] += item6
            }
            if (allChecks['707'] !== undefined) {
              allChecks['707'] += item7
            }
            if (allChecks['708'] !== undefined) {
              allChecks['708'] += item8
            }
            if (allChecks['709'] !== undefined) {
              allChecks['709'] += item9
            }
            if (allChecks['710'] !== undefined) {
              allChecks['710'] += item10
            }
          }
          if (cmd[i] === commond7) {
            allChecks['0'] = item.substr(6, 2)
            allChecks['1'] = item.substr(6, 2)
            allChecks['2'] = item.substr(6, 2)
            allChecks['3'] = item.substr(6, 2)
            allChecks['4'] = item.substr(6, 2)
            allChecks['5'] = item.substr(6, 2)
            allChecks['6'] = item.substr(6, 2)
            allChecks['7'] = item.substr(6, 2)
            allChecks['8'] = item.substr(8, 2)
            allChecks['9'] = item.substr(8, 2)
            allChecks['10'] = item.substr(8, 2)
          }
        }
      }
      // console.log(JSON.stringify(allChecks))
      code.forEach(function(item, index) {
        var analyze = null
        eval(analysis[index])
        if (allChecks[item] && analyze) {
          res[item] = analyze(allChecks[item])
        }
      })
      success(res)
    }
  }
}
Relay.prototype.write = function(addr, code, state) { // 01 05 00 03 FF 00 7C 3A 线圈4 01 05 00 03 00 00 3D CA
  if (typeof addr === 'number')addr = addr.toString(16)
  while (addr.length < 2) {
    addr = '0' + addr
  }
  code = parseInt(code).toString(16)
  while (code.length < 2) {
    code = '0' + code
  }
  if (state === 0) {
    state = '00'
  } else if (state === 1) {
    state = 'ff'
  }
  var validate = this.validate
  var commond = this.validate.crc16(addr + '0500' + code + state + '00')
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
        var func = item.substr(2, 2)
        if (func !== '05') {
          return error(402)
        }
        let rdata = item.substr(8, 2)
        if (rdata === 'ff') rdata = 1
        else if (rdata === '00') rdata = 0
        return success(rdata)
      }
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
  // var cmd1 = this.validate.crc16(addr + '030100000b')
  // var cmd2 = this.validate.crc16(addr + '030200000b')
  // var cmd3 = this.validate.crc16(addr + '030300000b')
  // var cmd4 = this.validate.crc16(addr + '030400000b')
  // var cmd5 = this.validate.crc16(addr + '0307000001')
  // var cmd6 = this.validate.crc16(addr + '0306000001')
  var cmd7 = this.validate.crc16(addr + '010000000b')
  /**
   *commonds --定义数据参数的反馈起始位和惭愧数据参数长度。
   *begin ---数据参数 字节数 反馈起始位*2
   *reslength----数据参数 反馈数据参数长度 下限值-上限值的指令字节数为该长度*2
   *cmd  ------ 非必选，用于设定不同的指令的作用
   */
  var commonds = [
    { begin: 3, reslength: 2 },
    { begin: 5, reslength: 2 },
    { begin: 7, reslength: 2 },
    { begin: 9, reslength: 2 },
    { begin: 11, reslength: 2 },
    { begin: 13, reslength: 2 },
    { begin: 15, reslength: 2 },
    { begin: 17, reslength: 2 },
    { begin: 19, reslength: 2 },
    { begin: 21, reslength: 2 },
    { begin: 23, reslength: 2 }
  ]
  var commonds2 = [
    { begin: 3, reslength: 2 }
  ]
  var commonds3 = [
    { begin: 3, reslength: 1 },
    { begin: 4, reslength: 1 }
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
    // console.log("orderNo="+orderNo)
    var allcs = ''
    commonds.forEach(function(commond) {
      var params = parameter.split(',')
      // console.log("params="+params)
      // console.log("type="+type)
      if (type === 'lddl') {
        if (params[0] === undefined || !isNumber(params[0])) {
          params[0] = 200
        }
        if (params[1] === undefined || !isNumber(params[1])) {
          params[1] = 1
        } else if (parseFloat(params[1]) < 1) {
          params[1] = 1
        } else if (parseFloat(params[1]) > 10) {
          params[1] = 10
        }
        params[1] = parseFloat(params[1]) * 10
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
          params[4] = 10
        } else if (parseFloat(params[4]) < parseFloat(params[3])) {
          params[4] = 10
        } else if (parseFloat(params[4]) > 10) {
          params[4] = 10
        }
        params[4] = parseFloat(params[4]) * 100
      }
      if (type === 'gl') {
        if (params[0] === undefined || !isNumber(params[0])) {
          params[0] = 200
        }
        if (params[1] === undefined || !isNumber(params[1])) {
          params[1] = 10
        } else if (parseFloat(params[1]) < 1) {
          params[1] = 1
        } else if (parseFloat(params[1]) > 10) {
          params[1] = 10
        }
        // params[1] = parseFloat(params[1]) * 100
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
        } else if (parseFloat(params[4]) > 20000) {
          params[4] = 20000
        }
        params[4] = parseFloat(params[4]) * 100
      }
      if (type === 'wd') {
        if (params[0] === undefined || !isNumber(params[0])) {
          params[0] = 200
        }
        if (params[1] === undefined || !isNumber(params[1])) {
          params[1] = 1
        } else if (parseFloat(params[1]) < 1) {
          params[1] = 1
        } else if (parseFloat(params[1]) > 10) {
          params[1] = 10
        }
        params[1] = parseFloat(params[1]) * 10
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
          params[4] = 100
        } else if (parseFloat(params[4]) < parseFloat(params[3])) {
          params[4] = 100
        } else if (parseFloat(params[4]) > 100) {
          params[4] = 100
        }
        params[4] = parseFloat(params[4]) * 100
      }
      if (type === 'dl') {
        if (params[0] === undefined || !isNumber(params[0])) {
          params[0] = 200
        }
        if (params[1] === undefined || !isNumber(params[1])) {
          params[1] = 1
        } else if (parseFloat(params[1]) < 1) {
          params[1] = 1
        } else if (parseFloat(params[1]) > 10) {
          params[1] = 10
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
      if (type === 'zdl') {
        if (params[0] === undefined || !isNumber(params[0])) {
          params[0] = 200
        }
        if (params[1] === undefined || !isNumber(params[1])) {
          params[1] = 10
        } else if (parseFloat(params[1]) < 1) {
          params[1] = 1
        } else if (parseFloat(params[1]) > 10) {
          params[1] = 10
        }
        params[1] = parseFloat(params[1]) * 10000
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
        } else if (parseFloat(params[4]) > 20000) {
          params[4] = 20000
        }
        params[4] = parseFloat(params[4]) * 100
      }
      if (type === 'zt') {
        if (params[0] === undefined || !isNumber(params[0])) {
          params[0] = 200
        }
        if (params[1] === undefined || !isNumber(params[1])) {
          params[1] = 1
        } else if (parseFloat(params[1]) < 1) {
          params[1] = 1
        } else if (parseFloat(params[1]) > 1) {
          params[1] = 1
        }
        // params[1] = parseFloat(params[1]) * 100
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
          params[4] = 1
        } else if (parseFloat(params[4]) < parseFloat(params[3])) {
          params[4] = 1
        } else if (parseFloat(params[4]) > 1) {
          params[4] = 1
        }
        params[4] = parseFloat(params[4]) * 255
      }
      console.log(JSON.stringify(params))
      let changecycle = parseInt(params[0]).toString(16)
      while (changecycle.length < 2) {
        changecycle = '0' + changecycle
      }
      // console.log("changecycle="+changecycle)
      let rangeofchange = parseInt(params[1]).toString(16)
      while (rangeofchange.length < 2) {
        rangeofchange = '0' + rangeofchange
      }
      // console.log("rangeofchange="+rangeofchange)
      if (parseInt(params[2]) > 1) {
        commond.reslength = parseInt(commond.reslength) - parseInt(params[2]) + 1
      }
      // console.log("commond.reslength="+commond.reslength)
      var resth = parseInt(commond.reslength * 2)
      // console.log("resth="+resth)
      let lowerLimitValue = parseInt(params[3]).toString(16)
      while (lowerLimitValue.length < resth) {
        lowerLimitValue = '0' + lowerLimitValue
      }
      // console.log("lowerLimitValue="+lowerLimitValue)
      let upperlimitvalue = parseInt(params[4]).toString(16)
      while (upperlimitvalue.length < resth) {
        upperlimitvalue = '0' + upperlimitvalue
      }
      // console.log("upperlimitvalue="+upperlimitvalue)
      commond.begin = commond.begin.toString(16)
      while (commond.begin.length < 2) {
        commond.begin = '0' + commond.begin
      }
      // console.log("begin="+commond.begin)
      commond.reslength = commond.reslength.toString(16)
      while (commond.reslength.length < 2) {
        commond.reslength = '0' + commond.reslength
      }
      // console.log("reslength="+commond.reslength)
      console.log(commond.begin, commond.reslength, changecycle, rangeofchange, lowerLimitValue, upperlimitvalue)
      var cscmd = commond.begin + commond.reslength + changecycle + rangeofchange + lowerLimitValue + upperlimitvalue
      // 计算单条数据参数的指令长度
      // console.log("cscmd"+cscmd.length)
      var wlength = (parseInt(cscmd.length / 2) + 1).toString(16)
      while (wlength.length < 2) {
        wlength = '0' + wlength
      }
      cscmd = wlength + cscmd
      allcs = allcs + cscmd
      // console.log("allcs="+allcs)
    })

    var alength = parseInt(allcs.length / 2).toString(16)
    while (alength.length < 2) {
      alength = '0' + alength
    }
    // console.log("alength="+alength)
    var allNumber = commonds.length.toString(16)
    while (allNumber.length < 2) {
      allNumber = '0' + allNumber
    }
    // console.log("allNumber="+allNumber)
    var ncmd = '00' + port + readTime + upTime + alength + allNumber + allcs + cmd
    // console.log("ncmd="+ncmd)
    console.log('ncmd=' + ncmd.length)
    if (ncmd.length > 100) {
      // 计算指令截成几段
      let i = 1
      const j = parseInt(ncmd.length / 100) + 1
      const xh = i + '' + j
      while (ncmd.length > 100) {
        var mm = ncmd.substr(0, 100)
        ncmd = ncmd.substr(100)
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
  // cmds = paramData(cmd1, commonds, pars['lddl'], port, 0, cmds, 'lddl')
  // cmds = paramData(cmd2, commonds, pars['gl'], port, 1, cmds, 'gl')
  // cmds = paramData(cmd3, commonds, pars['wd'], port, 2, cmds, 'wd')
  // cmds = paramData(cmd4, commonds, pars['dl'], port, 3, cmds, 'dl')
  // cmds = paramData(cmd5, commonds2, pars['zdl'], port, 4, cmds, 'zdl')
  // cmds = paramData(cmd6, commonds2, pars['zdl'], port, 5, cmds, 'zdl')
  cmds = paramData(cmd7, commonds3, pars['zt'], port, 6, cmds, 'zt')
  // //console.log("-----------------------cmds.length="+cmds.length)
  return {
    cmd: cmds.join(','),
    try: 5
  }
}
/**
 * 简析主动上报指令，并且生成一个数组
 */
Relay.prototype.decode = function(result) {
  var ret = {}
  var validate = this.validate
  var analysis = []
  var _this = this
  var allOperates = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a']
  allOperates.forEach(function(item) {
    analysis.push(_this['analysis' + item])
  })
  console.log('result=' + result)
  console.log('result.length=' + result.length)
  if (result.length === 58 || result.length === 18) {
    var code = result.substr(2, 2)
    // console.log('code=' + code)
    let data = ''
    if (code === '00' || code === '01' || code === '02' || code === '03') {
      data = result.substr(10, 44)
      // console.log('data=' + data)
      const valid = this.validate.crc16(result.substr(4, 50)).toUpperCase()
      if (valid !== result.substr(4, 54).toUpperCase()) {
        return null
      }
      // console.log('valid=' + valid)
      if (code === '00') {
        const j = 256
        for (let i = 0; i < 11; i++) {
          const code = parseInt(j) + i
          let d = data.substr(i * 4, 4)
          const analysis = this['analysis' + code.toString(16)]
          const analyze = null
          if (analysis) {
            eval(analysis)
          }
          if (analyze) {
            d = analyze(d)
          }
          // console.log('d=' + d)
          ret[code.toString(16)] = d
        }
      }
      if (code === '01') {
        const j = 512
        for (let i = 0; i < 11; i++) {
          const code = parseInt(j) + i
          let d = data.substr(i * 4, 4)
          const analysis = this['analysis' + code.toString(16)]
          const analyze = null
          if (analysis) {
            eval(analysis)
          }
          if (analyze) {
            d = analyze(d)
          }
          // console.log('d=' + d)
          ret[code.toString(16)] = d
        }
      }
      if (code === '02') {
        const j = 768
        for (let i = 0; i < 11; i++) {
          const code = parseInt(j) + i
          let d = data.substr(i * 4, 4)
          const analysis = this['analysis' + code.toString(16)]
          const analyze = null
          if (analysis) {
            eval(analysis)
          }
          if (analyze) {
            d = analyze(d)
          }
          // console.log('d=' + d)
          ret[code.toString(16)] = d
        }
      }
      if (code === '03') {
        const j = 1024
        for (let i = 0; i < 11; i++) {
          const code = parseInt(j) + i
          let d = data.substr(i * 4, 4)
          const analysis = this['analysis' + code.toString(16)]
          const analyze = null
          if (analysis) {
            eval(analysis)
          }
          if (analyze) {
            d = analyze(d)
          }
          // console.log('d=' + d)
          ret[code.toString(16)] = d
        }
      }
    }
    if (code === '04' || code === '05') {
      data = result.substr(10, 4)
      // console.log('data=' + data)
      const valid = this.validate.crc16(result.substr(4, 10)).toLowerCase()
      if (valid !== result.substr(4, 14).toLowerCase()) {
        return null
      }
      // console.log('valid=' + valid)
      var item = ''
      if (item === undefined) {
        item = data
      } else {
        item += data
      }

      const code = '700'
      var analysis = this['analysis' + code]
      var analyze = null
      if (analysis) {
        eval(analysis)
      }
      if (analyze) {
        data = analyze(data)
      }
      // console.log('code=' + code)
      ret[code] = data
    }
    if (code === '06') {
      data = result.substr(10, 4)
      console.log('data=' + data)
      const valid = validate.crc16(result.substr(4, 10)).toLowerCase()
      console.log(valid, result.substr(4, 10), result.substr(4, 14))
      if (valid !== result.substr(4, 14).toLowerCase()) {
        return null
      }
      console.log('valid=' + valid)
      for (let i = 0; i < 11; i++) {
        let d
        if (i < 8) {
          d = data.substr(0, 2)
        } else {
          d = data.substr(2, 2)
        }
        var analyze = null
        console.log(i.toString(16))
        eval(analysis[i.toString(16)])
        if (analyze) {
          ret[i] = analyze(d)
        }
        console.log(ret[i])
      }
    }
    console.log('ret=' + ret)
    return ret
  } else {
    return null
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
