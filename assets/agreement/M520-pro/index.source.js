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

/*
     校验函数
     */
function checkcode(data) {
  var long = data.substr(4, 2)
  var func1 = data.substr(6, 2)
  var state1 = data.substr(8, 2)
  var state2 = data.substr(10, 2)
  var jiaoyanone = (parseInt(long, 16) + parseInt(func1, 16) + parseInt(state1, 16) + parseInt(state2, 16)).toString(16)
  var jiaoyan = jiaoyanone.substr(jiaoyanone.length - 2, 2)
  return (data + jiaoyan)
}
/**
 * 搜索设备
 * 回调 [addr] 返回搜索到的设备的地址
 */
Relay.prototype.find = function(startAddr, endAddr) {
  if (startAddr && typeof startAddr === 'string')startAddr = parseInt(startAddr)
  if (endAddr && typeof endAddr === 'string')endAddr = parseInt(endAddr)
  var commond = 'AAAA034900004C'
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
      result = rmDb(result) // 处理指令长度
      if (result.length < 14) {
        return error(400)
      }
      var data = result.substr(0, result.length - 2)
      // console.log(data)
      var validatedata = checkcode(data).toLowerCase() // 验证
      // console.log(validatedata)
      if (validatedata !== result) {
        return error(401)
      }
      var func = result.substr(6, 2)
      if (func !== '49') {
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
  // console.log('1=' + options.shortAddress)
  while (options.shortAddress.length < 2) {
    options.shortAddress = '0' + options.shortAddress
  }
  var jiaoyanone = (75 + parseInt(options.shortAddress, 16)).toString(16)
  var jiaoyan = jiaoyanone.substr(jiaoyanone.length - 2, 2)
  var commond = 'AAAA0348' + options.shortAddress + '00' + jiaoyan
  // commond = this.validate.crc16(commond)
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
      result = rmDb(result)
      if (result.length < 14) {
        return error(400)
      }
      var data = result.substr(0, result.length - 2)
      var validatedata = checkcode(data).toLowerCase() // 验证
      if (validatedata !== result) {
        return error(401)
      }
      var func = result.substr(6, 2)
      if (func !== '48') {
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
  var allOperates = ['12', '14']
  allOperates.forEach(function(item) {
    code.push(item)
  })
  code.forEach(function(item) {
    analysis.push(_this['analysis' + item])
  })

  if (typeof addr === 'number')addr = addr.toString(16)
  var jiaoyanone = (35 + parseInt(addr, 16)).toString(16)
  var jiaoyan = jiaoyanone.substr(jiaoyanone.length - 2, 2)
  var commond1 = 'AAAA0320' + addr + '00' + jiaoyan
  var jiaoyanone1 = (24 + parseInt(addr, 16)).toString(16)
  var jiaoyan1 = jiaoyanone1.substr(jiaoyanone1.length - 2, 2)
  var commond2 = 'AAAA0315' + addr + '00' + jiaoyan1
  // if (code.indexOf('20') > -1) {
  cmd.push(commond1)
  // }
  // if (code.indexOf('15') > -1) {
  cmd.push(commond2)
  // }
  while (addr.length < 2) {
    addr = '0' + addr
  }
  return {
    cmd: cmd.join(','),
    resolve: function(result, success, error) {
      var data = result.split(',')
      var res = {}
      var allChecks = {}
      for (var i = 0; i < data.length; i++) {
        var item = rmDb(data[i]) // 处理指令长度
        // console.log(item)
        var data1 = item.substr(0, item.length - 2)
        // console.log(data1)
        var validatedata = checkcode(data1).toLowerCase() // 验证
        // console.log(validatedata)
        if (validatedata !== item) {
          return error(401)
        }
        var addrback = item.substr(8, 2)
        if (addrback.toLowerCase() !== addr.toLowerCase()) {
          return error(403)
        }
        const func = item.substr(6, 2)
        if (func !== '20' && func !== '15') {
          return error(402)
        }
        // 设定空开的信号强度的地址为0,
        res['0'] = parseInt(data[i].substr(data[i].length - 2, 2))
        if (cmd[i] === commond1) {
          allChecks['12'] = item.substr(10, 2)
        }
        if (cmd[i] === commond2) {
          allChecks['14'] = item.substr(10, 2)
        }
      }
      // console.log("code="+code)
      // console.log("allChecks['12']="+allChecks['12'])
      // console.log("allChecks['14']="+allChecks['14'])
      // console.log(JSON.stringify(allChecks))
      code.forEach(function(item, index) {
        var analyze = null
        eval(analysis[index])
        if (allChecks[item] && analyze) {
          res[item] = analyze(allChecks[item])
        }
      })
      // console.log("res['12']="+res['12'])
      // console.log("res['14']="+res['14'])
      // console.log("res="+res)
      success(res)
    }
  }
}
Relay.prototype.write = function(addr, code, state) { // 01 05 00 03 FF 00 7C 3A 线圈4 01 05 00 03 00 00 3D CA
  if (typeof addr === 'number')addr = addr.toString(16)
  while (addr.length < 2) {
    addr = '0' + addr
  }
  code = parseInt(code)
  if (typeof code === 'number')code = code.toString()
  while (code.length < 2) {
    code = '0' + code
  }
  code = [code]
  var state2 = state
  var state3 = ''
  if (state == 0) {
    state = '13'
    state3 = '00'
  } else if (state == 1) {
    state = '11'
    state = state.toString(16)
    state3 = '00'
  } else if (state == 2) {
    state = '12'
    state = state.toString(16)
    state3 = '00'
  } else if (state == 16) {
    state = '16'
    state3 = '00'
  } else if (state >= 50) {
    state = state - 50
    state3 = state.toString(16)
    state = '14'
  }
  console.log(state, state2, state3)
  while (state3.length < 2) {
    state3 = '0' + state3
  }
  var jiaoyanone = (3 + parseInt(addr, 16) + parseInt(state, 16) + parseInt(state3, 16)).toString(16)
  var jiaoyan = jiaoyanone.substr(jiaoyanone.length - 2, 2)
  var cmd = 'AAAA03' + state + addr + state3 + jiaoyan
  // console.log(commond)
  return {
    cmd: cmd,
    resolve: function(result, success, error) {
      var item = rmDb(result)
      var validatedata = checkcode(item.substr(0, item.length - 2)).toLowerCase() // 验证
      if (validatedata !== item) {
        return error(401)
      }
      var addrback = item.substr(8, 2)
      if (addrback.toLowerCase() !== addr.toLowerCase()) {
        return error(403)
      }
      var func = item.substr(6, 2)
      if (func !== '11' && func !== '12' && func !== '13' && func !== '14' && func !== '16') {
        return error(402)
      }
      let rdata = item.substr(10, 2)
      if (func == '11') {
        rdata = 1
      } else if (func == '12') {
        rdata = 2
      } else if (func == '13') {
        rdata = 0
      } else if (func == '14') {
        rdata = state2 - 50
      } else if (func == '16') {
        rdata = 16
      }
      return success(rdata)
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
  var cmds = []
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
  // console.log('result=' + result)
  // console.log('result.length=' + result.length)
  if (result.length === 58 || result.length === 18) {
    var code = result.substr(2, 2)
    console.log('code=' + code)
    let data = ''
    if (code === '00' || code === '01' || code === '02' || code === '03') {
      data = result.substr(10, 44)
      console.log('data=' + data)
      const valid = this.validate.crc16(result.substr(4, 50)).toUpperCase()
      if (valid !== result.substr(4, 54).toUpperCase()) {
        return null
      }
      console.log('valid=' + valid)
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
          console.log('d=' + d)
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
          console.log('d=' + d)
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
          console.log('d=' + d)
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
          console.log('d=' + d)
          ret[code.toString(16)] = d
        }
      }
    }
    if (code === '04' || code === '05') {
      data = result.substr(10, 4)
      console.log('data=' + data)
      const valid = this.validate.crc16(result.substr(4, 10)).toLowerCase()
      if (valid !== result.substr(4, 14).toLowerCase()) {
        return null
      }
      console.log('valid=' + valid)
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
      console.log('code=' + code)
      ret[code] = data
    }
    if (code === '06') {
      data = result.substr(10, 4)
      // console.log('data=' + data)
      const valid = validate.crc16(result.substr(4, 10)).toLowerCase()
      // console.log(valid, result.substr(4, 10), result.substr(4, 14))
      if (valid !== result.substr(4, 14).toLowerCase()) {
        return null
      }
      // console.log('valid=' + valid)
      for (let i = 0; i < 11; i++) {
        let d
        if (i < 8) {
          d = data.substr(0, 2)
        } else {
          d = data.substr(2, 2)
        }
        var analyze = null
        // console.log(i.toString(16))
        eval(analysis[i.toString(16)])
        if (analyze) {
          ret[i] = analyze(d)
        }
      }
    }
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
