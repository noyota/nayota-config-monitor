function Relay(options, validate) {
  this.addrmin = 1 // 地址最小
  this.addrmax = 100 // 地址最大
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
    commond += this.validate.crc16('FF0201' + addrS) + ','
    addr++
  }
  var validate = this.validate
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  // var defaultOperate =this.options.defaultOperate
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  return {
    cmd: commond.substr(0, commond.length - 1),
    resolve: function(result, success, error) {
      result = rmDb(result)
      if (result.length < 12) {
        return error(400)
      }
      var data = result.substr(0, result.length - 4)
      var validatedata = validate.crc16(data)
      if (validatedata.toLowerCase() !== result.toLowerCase()) {
        return error(401)
      }
      var func = result.substr(0, 6)
      if (func !== 'ff020a') {
        return error(402)
      }
      var address = result.substr(6, 2)
      var json = {
        shortAddress: address,
        name: devicename + address,
        checks: defaultCheck,
        attribute: attribute
      }
      return success(json)
    },
    changeAddr: false // 改变地址
  }
}
/**
 * 改变设备地址
 * 回调 【addr】  返回
 */
Relay.prototype.changeAddr = function(options) {
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
  const cmd = []
  const commond1 = addr + '01'
  const commond2 = addr + '02'
  const commond3 = addr + '03'
  code.forEach(function(item) {
    analysis.push(_this['analysis' + item])
    if ((item === '1' || item === '2' || item === '3' || item === '4' || item === '5' || item === '6' || item === '7' || item === '8') && cmd.indexOf(commond1) < 0) {
      cmd.push(commond1)
    }
    if ((item === '9' || item === 'a' || item === 'b' || item === 'c' || item === 'd' || item === 'e' || item === 'f' || item === '10') && cmd.indexOf(commond2) < 0) {
      cmd.push(commond2)
    }
    if ((item === '11' || item === '12' || item === '13' || item === '14' || item === '15' || item === '16' || item === '17' || item === '18') && cmd.indexOf(commond3) < 0) {
      cmd.push(commond3)
    }
  })
  var pars = {}
  var attribule = this.options.attribute
  for (var o = 0; o < attribule.length; o++) {
    pars[attribule[o].key] = attribule[o].value
  }
  var readTime = parseInt(pars['读取周期'])
  var readDY = parseInt(pars['电压'] || 220)
  return {
    cmd: cmd.join(','),
    resolve: function(result, success, error) {
      const data = result.split(',')
      if (data.length !== cmd.length) {
        return error(400)
      }
      var res = {}
      var allChecks = {}
      for (var i = 0; i < data.length; i++) {
        var item = rmDb(data[i])
        if (item.length >= 68) {
          var addrback = item.substr(0, 2)
          if (addrback === addr.toLowerCase()) {
            var func2 = item.substr(2, 2)
            if (func2 === '01') {
              allChecks['1'] = item.substr(4, 8)
              allChecks['2'] = item.substr(12, 8)
              allChecks['3'] = item.substr(20, 8)
              allChecks['4'] = item.substr(28, 8)
              allChecks['5'] = item.substr(36, 8)
              allChecks['6'] = item.substr(44, 8)
              allChecks['7'] = item.substr(52, 8)
              allChecks['8'] = item.substr(60, 8)
              if (item.length === 72) {
                res['19'] = parseInt(item.substr(68, 2))
                res['1a'] = parseInt(item.substr(70, 2))
              }
            }
            if (func2 === '02') {
              allChecks['9'] = item.substr(4, 8)
              allChecks['a'] = item.substr(12, 8)
              allChecks['b'] = item.substr(20, 8)
              allChecks['c'] = item.substr(28, 8)
              allChecks['d'] = item.substr(36, 8)
              allChecks['e'] = item.substr(44, 8)
              allChecks['f'] = item.substr(52, 8)
              allChecks['10'] = item.substr(60, 8)
              if (item.length === 72) {
                res['1b'] = parseInt(item.substr(68, 2))
                res['1c'] = parseInt(item.substr(70, 2))
              }
            }
            if (func2 === '03') {
              allChecks['11'] = item.substr(4, 8)
              allChecks['12'] = item.substr(12, 8)
              allChecks['13'] = item.substr(20, 8)
              allChecks['14'] = item.substr(28, 8)
              allChecks['15'] = item.substr(36, 8)
              allChecks['16'] = item.substr(44, 8)
              allChecks['17'] = item.substr(52, 8)
              allChecks['18'] = item.substr(60, 8)
              if (item.length === 72) {
                res['1d'] = parseInt(item.substr(68, 2))
                res['1e'] = parseInt(item.substr(70, 2))
              }
            }
          }
        }
        // allChecks['0'] = parseInt(data[i].substr(72, 2))
      }
      code.forEach(function(item, index) {
        var analyze = null
        eval(analysis[index])
        if (allChecks[item]) {
          if (analyze) {
            res[item] = parseFloat((readTime * analyze(allChecks[item]) * readDY / 3600 / 1000).toFixed(5))
          } else {
            res[item] = allChecks[item]
          }
        }
      })
      success(res)
    }
  }
}
/**
 * 高级参数配置
 * addr 设备地址
 * parameters 默认参数配置
 * port 串口配置
 */
Relay.prototype.configure = function(addr, parameters, port) {
  while (addr.length < 2) {
    addr = '0' + addr
  }
  var cmd1 = this.validate.crc16(addr + '0300000008')
  var cmd2 = this.validate.crc16(addr + '0300080008')
  var cmd3 = this.validate.crc16(addr + '0300100008')
  var pars = {}
  for (var o = 0; o < parameters.length; o++) {
    pars[parameters[o].key] = parameters[o].value
  }
  var readTime = parseInt(pars['读取周期'])
  if (readTime === undefined) {
    readTime = 5
  }
  readTime = this.validate.numToHexStr(readTime, 4)
  var cmds = []
  cmd1 = addr + '01' + port + readTime + '040802' + cmd1
  cmds.push(cmd1)
  cmd2 = addr + '02' + port + readTime + '040802' + cmd2
  cmds.push(cmd2)
  cmd3 = addr + '03' + port + readTime + '040802' + cmd3
  cmds.push(cmd3)
  return {
    cmd: cmds.join(','),
    try: 5
  }
}
/**
 * 主动上报配置
 * addr 设备地址
 * parameters 默认参数配置
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
