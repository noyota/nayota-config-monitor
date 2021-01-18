function Relay(options, validate) {
  this.addrmin = 1 // 地址最小
  this.addrmax = 60 // 地址最大
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
    _this.checksAddress.push(test.address)
  })
}
/**
 * 搜索设备
 * 回调 [addr] 返回搜索到的设备的地址
 */
Relay.prototype.find = function(startAddr, endAddr) {
}
/**
 * 改变设备地址
 * 回调 【addr】  返回
 */
Relay.prototype.changeAddr = function(options) {
}
// 和校验取反加一
function he(commond) {
  let jy = 0
  commond = commond.replace(new RegExp(/( )/g), '')
  for (let i = 0; i < commond.length; i += 2) {
    jy += parseInt(commond.substr(i, 2), 16)
  }
  jy = (256 - (jy % 256)).toString(16)
  while (jy.length < 2) {
    jy = '0' + jy
  }
  return (commond + jy).toLowerCase()
}
/**
 * 读取数据
 */
Relay.prototype.read = function(addr, code) {
  if (code == null) {
    code = this.checksAddress
  } else if (typeof code === 'string') {
    code = [code]
  }
  var cmd = []
  var analysis = []
  var _this = this
  code.forEach(function(item) {
    analysis.push(_this['analysis' + item])
    var code_type = item.substr(0, 2)
    var code_addr = item.substr(2, 2)
    var code_load = item.substr(4, 2)
    var data = ''
    if (code_type === '01') {
      data = '0100'
    }
    if (code_type === '02') {
      data = '0200'
    }
    if (code_type === '46') {
      data = '03000000'
    }
    if (code_type === '47') {
      data = '050000000000'
    }
    var commond = he('c963' + code_type + code_addr + '00' + code_load + '6100' + data)
    if (cmd.toString().indexOf(commond) < 0) {
      cmd.push(commond)
    }
  })
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
        var item = data[i]
        var func = item.substr(0, 4)
        if (func !== 'c963') {
          return error(402)
        }
        var validatedata = he(item.substr(0, item.length - 2))
        if (validatedata.toLowerCase() !== item.toLowerCase()) {
          return error(401)
        }
        var code_type = item.substr(4, 2)
        var code_addr = item.substr(6, 2)
        var code_load = item.substr(10, 2)
        var cdata = ''
        if (code_type === '01') {
          cdata = item.substr(18, 2)
          allChecks[code_type + code_addr + code_load + '00'] = cdata
        }
        if (code_type === '03') {
          var load = parseInt(code_load, 16)
          cdata = item.substr(18 + load * 2, 2)
          allChecks[code_type + code_addr + code_load + '01'] = cdata
        }
        if (code_type === '46') {
          var load2 = parseInt(code_load, 16)
          allChecks[code_type + code_addr + code_load + '01'] = item.substr(18 + load2 * 2, 2)
          allChecks[code_type + code_addr + code_load + '02'] = item.substr(20 + load2 * 2, 2)
        }
        if (code_type === '47') {
          allChecks[code_type + code_addr + code_load + '01'] = item.substr(18, 2)
          allChecks[code_type + code_addr + code_load + '02'] = item.substr(20, 2)
          allChecks[code_type + code_addr + code_load + '03'] = item.substr(22, 2)
          allChecks[code_type + code_addr + code_load + '04'] = item.substr(24, 2)
        }
        code.forEach(function(item, index) {
          var analyze = null
          eval(analysis[index])
          if (allChecks[item] && analyze) {
            res[item] = analyze(allChecks[item])
          }
        })
      }
      success(res)
    }
  }
}

// 写设备
Relay.prototype.write = function(addr, code, state, operates) {
  var code_type = code.substr(0, 2)
  // var type = code_type
  var code_addr = code.substr(2, 2)
  var code_load = code.substr(4, 2)
  var code_shortAddr = code.substr(6, 2)
  var data = ''
  var ostate = ''
  var operateMap = {}
  operates.forEach(item => {
    if (item.shortAddress.indexOf(code.substr(0, 6)) > -1) {
      var sa = item.shortAddress.substr(6, 2)
      operateMap[sa] = item.value
    }
  })
  if (code_type === '01') {
    if (state === 1) {
      ostate = '01'
    }
    if (state === 0) {
      ostate = '02'
    }
    data = '0100'
  }
  // 调光模块
  if (code_type === '03') {
    ostate = '07'
    var ld = '00'
    var sd = '10'
    // 00是开关状态
    if (code_shortAddr === '00') {
      if (state === 1) {
        ostate = '01'
      }
      if (state === 0) {
        ostate = '02'
      }
    }
    console.log(operateMap)
    if (operateMap['01']) {
      console.log(123)
    }
    if (code_shortAddr === '01') {
      ld = state.toString(16)
    } else {
      if (operateMap['01']) {
        ld = operateMap['01'].toString(16)
      }
    }
    while (ld.length < 2) {
      ld = '0' + ld
    }
    if (code_shortAddr === '02') {
      sd = state + ''
    } else {
      if (operateMap['02']) {
        sd = operateMap['02'] + ''
      }
    }
    while (sd.length < 2) {
      sd = '0' + sd
    }
    data = '02' + ld + sd
  }
  if (code_type === '05') {
    ostate = '0e'
    data = '00'
  }
  if (code_type === '46') {
    ostate = '07'
    var ld = '00'
    var sw = '00'
    var sd = '10'
    if (code_shortAddr === '00') {
      if (state === 1) {
        ostate = '01'
      }
      if (state === 0) {
        ostate = '02'
      }
    }
    if (code_shortAddr === '01') {
      ld = state.toString(16)
    } else {
      if (operateMap['01']) {
        ld = operateMap['01'].toString(16)
      }
    }
    while (ld.length < 2) {
      ld = '0' + ld
    }
    if (code_shortAddr === '02') {
      if (state === 0) {
        sw = '00'
      } else {
        sw = 'C8'
      }
    } else {
      if (operateMap['02'] !== null && operateMap['02'] === 0) {
        sw = '00'
      } else {
        sw = 'C8'
      }
    }
    if (code_shortAddr === '03') {
      sd = state + ''
    } else {
      if (operateMap['03']) {
        sd = operateMap['03'] + ''
      }
    }
    while (sd.length < 2) {
      sd = '0' + sd
    }
    data = '03' + ld + sw + sd
  }
  if (code_type === '47') {
    ostate = '07'
    var r = '00'
    var g = '00'
    var b = '00'
    var w = '00'
    var sd = '10'
    if (code_shortAddr === '00') {
      if (state === 1) {
        ostate = '01'
      }
      if (state === 0) {
        ostate = '02'
      }
    }
    console.log(operateMap)
    if (code_shortAddr === '01') {
      r = state.toString(16)
    } else {
      if (operateMap['01']) {
        r = operateMap['01'].toString(16)
      }
    }
    while (r.length < 2) {
      r = '0' + r
    }
    console.log(r)
    if (code_shortAddr === '02') {
      g = state.toString(16)
    } else {
      if (operateMap['02']) {
        g = operateMap['02'].toString(16)
      }
    }
    while (g.length < 2) {
      g = '0' + g
    }
    console.log(g)
    if (code_shortAddr === '03') {
      b = state.toString(16)
    } else {
      if (operateMap['03']) {
        b = operateMap['03'].toString(16)
      }
    }
    while (b.length < 2) {
      b = '0' + b
    }
    console.log(b)
    if (code_shortAddr === '04') {
      w = state.toString(16)
    } else {
      if (operateMap['04']) {
        w = operateMap['04'].toString(16)
      }
    }
    while (w.length < 2) {
      w = '0' + w
    }
    console.log(w)
    if (code_shortAddr === '05') {
      sd = state + ''
    } else {
      if (operateMap['05']) {
        sd = operateMap['05'] + ''
      }
    }
    while (sd.length < 2) {
      sd = '0' + sd
    }
    console.log(sd)
    data = '05' + r + g + b + w + sd
  }
  var commond = he('c963' + code_type + code_addr + '00' + code_load + ostate + '00' + data)
  return {
    cmd: commond,
    timeout: 5000,
    resolve: function(result, success, error) {
      console.log(result)
      var func = result.substr(0, 4)
      if (func !== 'c963') {
        return error(402)
      }
      var type = result.substr(4, 2)
      if (type !== code_type) {
        return error(401)
      }
      var addr1 = result.substr(6, 2)
      if (addr1 !== code_addr) {
        return error(403)
      }
      var validatedata = he(result.substr(0, result.length - 2))
      if (validatedata.toLowerCase() !== result.toLowerCase()) {
        return error(404)
      }
      success(state)
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
Relay.prototype.encode = function(result) {
  console.log('encode', result)
}
/**
 * 简析主动上报指令，并且生成一个数组
 */
Relay.prototype.decode = function(result) {
  const code = this.checksAddress
  var analysis = []
  var _this = this
  code.forEach(function(item) {
    analysis.push(_this['analysis' + item])
  })
  var res = {}
  var allChecks = {}
  var item = new Buffer(result).toString('hex')
  console.log('item', item)
  var func = item.substr(0, 4)
  if (func !== 'c963') {
    return null
  }
  var validatedata = he(item.substr(0, item.length - 2))
  if (validatedata.toLowerCase() !== item.toLowerCase()) {
    return null
  }
  var code_type = item.substr(4, 2)
  var code_addr = item.substr(6, 2)
  var code_load = item.substr(10, 2)
  var cdata = ''
  if (code_type === '01') {
    cdata = item.substr(18, 2)
    allChecks[code_type + code_addr + code_load + '00'] = cdata
  }
  if (code_type === '03') {
    var load = parseInt(code_load, 16)
    cdata = item.substr(18 + load * 2, 2)
    allChecks[code_type + code_addr + code_load + '00'] = cdata
  }
  if (code_type === '46') {
    var load2 = parseInt(code_load, 16)
    allChecks[code_type + code_addr + code_load + '00'] = item.substr(18 + load2 * 2, 2)
    allChecks[code_type + code_addr + code_load + '01'] = item.substr(20 + load2 * 2, 2)
  }
  if (code_type === '47') {
    allChecks[code_type + code_addr + code_load + '00'] = item.substr(18, 2)
    allChecks[code_type + code_addr + code_load + '01'] = item.substr(20, 2)
    allChecks[code_type + code_addr + code_load + '02'] = item.substr(22, 2)
    allChecks[code_type + code_addr + code_load + '03'] = item.substr(24, 2)
  }
  code.forEach(function(item, index) {
    var analyze = null
    eval(analysis[index])
    if (allChecks[item] && analyze) {
      res[item] = analyze(allChecks[item])
    }
  })
  console.log(res)
  return res
}

Relay.prototype.navi = function(result) {
  if (result) {
    const ret = result.substr(0, 2)
    return ret
  }
  return null
}

module.exports = Relay
