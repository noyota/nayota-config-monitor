function Relay(options, validate) {
  this.addrmin = 1 // 地址最小
  this.addrmax = 20 // 地址最大
  this.validate = validate
  this.button = [0, 1, 2, 3, 4, 5, 6, 7]
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
  if (startAddr && typeof startAddr === 'string') startAddr = parseInt(startAddr)
  if (endAddr && typeof endAddr === 'string') endAddr = parseInt(endAddr)
  var commond = '68AAAAAAAAAAAA681300DF16'
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      result = rmDb(result)
      // console.log("result="+result)
      // console.log("result.length="+result.length)
      if (result.length < 44) {
        return error(400)
      }
      var func = result.substr(24, 2)
      if (func != '93') {
        return error(402)
      }
      var address = result.substr(10, 2)
      var json = {
        shortAddress: address,
        name: devicename + address,
        checks: defaultCheck,
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
  if (typeof options.shortAddress === 'number') options.shortAddress = options.shortAddress.toString(16)
  while (options.shortAddress.length < 2) {
    options.shortAddress = '0' + options.shortAddress
  }
  var addre = (51 + parseInt(options.shortAddress, 16)).toString(16)
  var jiaoyanone = (230 + parseInt(addre, 16)).toString(16)
  var jiaoyan = jiaoyanone.substr(jiaoyanone.length - 2, 2)
  var commond = '68AAAAAAAAAAAA681506' + addre + '3333333333' + jiaoyan + '16'
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      result = rmDb(result)
      // console.log("result.length="+result.length)
      if (result.length < 32) {
        return error(400)
      }
      var func = result.substr(24, 2)
      if (func !== '95') {
        return error(402)
      }
      var json = {
        shortAddress: options.shortAddress,
        name: devicename + options.shortAddress,
        checks: defaultCheck,
        attribute: attribute
      }
      return success(json)
    }
  }
}

Relay.prototype.read = function(addr, code, attribute) {
  if (code == null) code = this.checksAddress
  else if (typeof code === 'string') code = [code]
  var analysis = []
  var _this = this
  code.forEach(function(item) {
    analysis.push(_this['analysis' + item])
  })
  while (addr.length < 2) {
    addr = '0' + addr
  }
  var pars = {}
  if (attribute != undefined) {
    for (var o = 0; o < attribute.length; o++) {
      pars[attribute[o].key] = attribute[o].value
    }
  }
  var xs = Number(pars['电能系数'] || 1)
  var codeone = ''
  var cmd = []
  var db = ''
  // console.log(code)
  if (code.indexOf('1') > -1) {
    codeone = '33343435'
    cmd.push(getCommond(codeone))
  }
  if (code.indexOf('2') > -1) {
    codeone = '33353435'
    cmd.push(getCommond(codeone))
  }
  if (code.indexOf('3') > -1) {
    codeone = '33363435'
    cmd.push(getCommond(codeone))
  }
  if (code.indexOf('4') > -1) {
    codeone = '33333433'
    cmd.push(getCommond(codeone))
  }
  if (code.indexOf('5') > -1) {
    codeone = '33343535'
    cmd.push(getCommond(codeone))
  }
  if (code.indexOf('6') > -1) {
    codeone = '33353535'
    cmd.push(getCommond(codeone))
  }
  if (code.indexOf('7') > -1) {
    codeone = '33363535'
    cmd.push(getCommond(codeone))
  }
  function getCommond(codeone) {
    var code1 = codeone.substr(0, 2)
    var code2 = codeone.substr(2, 2)
    var code3 = codeone.substr(4, 2)
    var code4 = codeone.substr(6, 2)
    var jiaoyanone = (104 + parseInt(addr, 16) + 104 + 17 + 4 + parseInt(code1, 16) + parseInt(code2, 16) + parseInt(code3, 16) + parseInt(code4, 16)).toString(16)
    var jiaoyan = jiaoyanone.substr(jiaoyanone.length - 2, 2)
    var commond1 = '68' + addr + '0000000000681104' + codeone + jiaoyan + '16'
    return commond1
  }
  // console.log(cmd)
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
        item = item.substr(0, item.length - 4)
        var func = item.substr(24, 2)
        if (func !== '91') {
          // return error(402)
        } else {
          var cheak = null
          if (item.substr(28, 8) == '33343435') { // A相电压
            cheak = 1
          } else if (item.substr(28, 8) == '33353435') { // B相电压
            cheak = 2
          } else if (item.substr(28, 8) == '33363435') { // C相电压
            cheak = 3
          } else if (item.substr(28, 8) == '33333433') { // lmp电能
            cheak = 4
          } else if (item.substr(28, 8) == '33343535') { // A相电流
            cheak = 5
          } else if (item.substr(28, 8) == '33353535') { // B相电流
            cheak = 6
          } else if (item.substr(28, 8) == '33363535') { // C相电流
            cheak = 7
          }
          // console.log("data[i]="+data[i])
          // console.log("data[i].length="+data[i].length)
          // if(data[i].length>=44){
          // console.log("cheak=1")
          // }
          // if(data[i].length>=44){
          // console.log("cheak=2")
          // }
          // if(data[i].length > 43){
          // console.log("cheak=3")
          // }
          if (code.indexOf('1') > -1 && cheak == 1) { // A相电压
            if (data[i].length < 44) {

            } else {
              // console.log("cheak=1")
              let data1 = item.substr(36, 2)
              let data2 = item.substr(38, 2)
              data1 = (parseInt(data1, 16) - 51).toString(16)
              data2 = (parseInt(data2, 16) - 51).toString(16)
              while (data1.length < 2) {
                data1 = '0' + data1
              }
              while (data2.length < 2) {
                data2 = '0' + data2
              }
              allChecks['1'] = data2 + data1
              // db = parseInt(result.substr(36, 2), 16)
              // console.log("checks1="+allChecks['1'])
            }
          } else if (code.indexOf('2') > -1 && cheak == 2) { // B相电压
            if (data[i].length < 44) {

            } else {
              let data1 = item.substr(36, 2)
              let data2 = item.substr(38, 2)
              data1 = (parseInt(data1, 16) - 51).toString(16)
              data2 = (parseInt(data2, 16) - 51).toString(16)
              while (data1.length < 2) {
                data1 = '0' + data1
              }
              while (data2.length < 2) {
                data2 = '0' + data2
              }
              allChecks['2'] = data2 + data1
              // db = parseInt(result.substr(36, 2), 16)
              // console.log("checks1="+allChecks['1'])
            }
          } else if (code.indexOf('3') > -1 && cheak == 3) { // C相电压
            if (data[i].length < 44) {

            } else {
              let data1 = item.substr(36, 2)
              let data2 = item.substr(38, 2)
              data1 = (parseInt(data1, 16) - 51).toString(16)
              data2 = (parseInt(data2, 16) - 51).toString(16)
              while (data1.length < 2) {
                data1 = '0' + data1
              }
              while (data2.length < 2) {
                data2 = '0' + data2
              }
              allChecks['3'] = data2 + data1
              // db = parseInt(result.substr(36, 2), 16)
              // console.log("checks1="+allChecks['1'])
            }
          } else if (code.indexOf('4') > -1 && cheak == 4) { // 电能
            if (data[i].length < 48) {

            } else {
              let data1 = item.substr(36, 2)
              let data2 = item.substr(38, 2)
              let data3 = item.substr(40, 2)
              let data4 = item.substr(42, 2)
              data1 = (parseInt(data1, 16) - 51).toString(16)
              data2 = (parseInt(data2, 16) - 51).toString(16)
              data3 = (parseInt(data3, 16) - 51).toString(16)
              data4 = (parseInt(data4, 16) - 51).toString(16)
              while (data1.length < 2) {
                data1 = '0' + data1
              }
              while (data2.length < 2) {
                data2 = '0' + data2
              }
              while (data3.length < 2) {
                data3 = '0' + data3
              }
              while (data4.length < 2) {
                data4 = '0' + data4
              }
              allChecks['4'] = data4 + data3 + data2 + data1
              // console.log("checks2="+allChecks['2'])
              // db = parseInt(result.substr(40, 2), 16)
            }
          } else if (code.indexOf('5') > -1 && cheak == 5) { // A相电流
            if (data[i].length < 46) {

            } else {
              let data1 = item.substr(36, 2)
              let data2 = item.substr(38, 2)
              let data3 = item.substr(40, 2)
              data1 = (parseInt(data1, 16) - 51).toString(16)
              data2 = (parseInt(data2, 16) - 51).toString(16)
              data3 = (parseInt(data3, 16) - 51).toString(16)
              while (data1.length < 2) {
                data1 = '0' + data1
              }
              while (data2.length < 2) {
                data2 = '0' + data2
              }
              while (data3.length < 2) {
                data3 = '0' + data3
              }
              allChecks['5'] = data3 + data2 + data1
              // console.log("checks3="+allChecks['3'])
              // db = parseInt(result.substr(38, 2), 16)
            }
          } else if (code.indexOf('6') > -1 && cheak == 6) { // B相电流
            if (data[i].length < 46) {

            } else {
              let data1 = item.substr(36, 2)
              let data2 = item.substr(38, 2)
              let data3 = item.substr(40, 2)
              data1 = (parseInt(data1, 16) - 51).toString(16)
              data2 = (parseInt(data2, 16) - 51).toString(16)
              data3 = (parseInt(data3, 16) - 51).toString(16)
              while (data1.length < 2) {
                data1 = '0' + data1
              }
              while (data2.length < 2) {
                data2 = '0' + data2
              }
              while (data3.length < 2) {
                data3 = '0' + data3
              }
              allChecks['6'] = data3 + data2 + data1
              // console.log("checks3="+allChecks['3'])
              // db = parseInt(result.substr(38, 2), 16)
            }
          } else if (code.indexOf('7') > -1 && cheak == 7) { // C相电流
            if (data[i].length < 46) {

            } else {
              let data1 = item.substr(36, 2)
              let data2 = item.substr(38, 2)
              let data3 = item.substr(40, 2)
              data1 = (parseInt(data1, 16) - 51).toString(16)
              data2 = (parseInt(data2, 16) - 51).toString(16)
              data3 = (parseInt(data3, 16) - 51).toString(16)
              while (data1.length < 2) {
                data1 = '0' + data1
              }
              while (data2.length < 2) {
                data2 = '0' + data2
              }
              while (data3.length < 2) {
                data3 = '0' + data3
              }
              allChecks['7'] = data3 + data2 + data1
              // console.log("checks3="+allChecks['3'])
              // db = parseInt(result.substr(38, 2), 16)
            }
          }
        }
        // res['0']= db
      }
      code.forEach(function(item, index) {
        var analyze = null
        eval(analysis[index])
        if (allChecks[item] && analyze) {
          if (item === '4') {
            res[item] = Number((xs * analyze(allChecks[item])).toFixed(2))
          } else {
            res[item] = Number(analyze(allChecks[item]).toFixed(2))
          }
        }
      })
      success(res)
    }
  }
}
/**
 * 生成主动上报
 * addr 设备地址
 * parameters 默认参数配置
 * changecycle 默认参数 --变化周期 1个字节
 * rangeofchange 默认参数 --变化幅度 1个字节
 * 比较字节1
 * lowerLimitValue 默认参数 --下限值 字节数(根据commonds中的reslength/2)
 * upperlimitvalue  默认参数 --上限值 字节数(根据commonds中的reslength/2)
 * port 串口配置
 */
Relay.prototype.encode = function(addr, parameters, port) {
  /**
   * 定义个查询指令
   *cmd1:湿度
   *cmd2:温度
   */
  var cmd1 = this.validate.crc16(addr + '0300000002')
  // var cmd2 = this.validate.crc16(addr + '0300000002')
  /**
   *commonds --定义数据参数的反馈起始位和惭愧数据参数长度。
   *begin ---数据参数 字节数 反馈起始位*2
   *reslength----数据参数 反馈数据参数长度 下限值-上限值的指令字节数为该长度*2
   *cmd  ------ 非必选，用于设定不同的指令的作用
   */
  // console.log("cmd1="+cmd1)
  var commonds = [
    { begin: 3, reslength: 2 },
    { begin: 5, reslength: 2 }
  ]
  // console.log(commonds)
  var pars = {}
  for (var o = 0; o < parameters.length; o++) {
    pars[parameters[o].key] = parameters[o].value
  }

  var readTime = parseInt(pars['读取周期']).toString(16)
  var upTime = parseInt(pars['上报周期']).toString(16)
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
      // if (type === 'dn') {
      //   if (params[0] === undefined || !isNumber(params[0])) {
      //     params[0] = 200
      //   }
      //   if (params[1] === undefined || !isNumber(params[1])) {
      //     params[1] = 0.1
      //   } else if (parseFloat(params[1]) < 0.1) {
      //     params[1] = 0.1
      //   } else if (parseFloat(params[1]) > 1) {
      //     params[1] = 1
      //   }
      //   params[1] = parseFloat(params[1]) * 100
      //   if (params[2] === undefined || !isNumber(params[2])) {
      //     params[2] = 1
      //   } else if (parseInt(commond.reslength) < parseInt(params[2])) {
      //     params[2] = commond.reslength
      //   }
      //   if (params[3] === undefined || !isNumber(params[3])) {
      //     params[3] = 0
      //   } else if (parseFloat(params[3]) >= 10) {
      //     params[3] = 0
      //   }
      //   params[3] = parseFloat(params[3]) * 100
      //   if (params[4] === undefined || !isNumber(params[4])) {
      //     params[4] = 20000
      //   } else if (parseFloat(params[4]) < parseFloat(params[3])) {
      //     params[4] = 20000
      //   } else if (parseFloat(params[4]) > 10) {
      //     params[4] = 20000
      //   }
      //   params[4] = parseFloat(params[4]) * 100
      // }
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
  cmds = paramData(cmd1, commonds, pars['sd'], port, 0, cmds, 'sd')
  // console.log("sd="+cmds)
  cmds = paramData(cmd1, commonds, pars['wd'], port, 1, cmds, 'wd')
  // console.log("wd="+cmds)
  // cmds = paramData(cmd3, commonds2, pars['dn'], port, 2, cmds, 'dn')
  // console.log("cmds="+cmds)
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
  if (result.length === 26 || result.length === 22) {
    var code = result.substr(2, 2)
    let data = ''
    if (code === '00' || code === '01') {
      data = result.substr(10, 12)
      const valid = this.validate.crc16(result.substr(4, 18)).toLowerCase()
      if (valid !== result.substr(4, 22).toLowerCase()) {
        return null
      }
      if (code === '00') {
        const j = 50
        for (let i = 0; i < 3; i++) {
          const code = parseInt(j) + i
          let d = data.substr(i * 4, 4)
          const analysis = this['analysis' + code.toString(16)]
          var analyze = null
          if (analysis) {
            eval(analysis)
          }
          if (analyze) {
            d = analyze(d)
          }
          ret[code.toString(16)] = d
        }
      }
      if (code === '01') {
        const j = 56
        for (let i = 0; i < 3; i++) {
          const code = parseInt(j) + i
          let d = data.substr(i * 4, 4)
          const analysis = this['analysis' + code.toString(16)]
          var analyze = null
          if (analysis) {
            eval(analysis)
          }
          if (analyze) {
            d = analyze(d)
          }
          ret[code.toString(16)] = d
        }
      }
      return ret
    } else {
      return null
    }
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
