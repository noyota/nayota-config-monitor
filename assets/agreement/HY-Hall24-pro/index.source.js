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
  var cmd = []
  var commond1 = this.validate.crc16(addr + '0300000008')
  var commond2 = this.validate.crc16(addr + '0300090008')
  var commond3 = this.validate.crc16(addr + '0300100008')
  code.forEach(function(item) {
    analysis.push(_this['analysis' + item])
    if ((item === '0' || item === '1' || item === '2' || item === '3' || item === '4' || item === '5' || item === '6' || item === '7') && cmd.indexOf(commond1) < 0) {
      cmd.push(commond1)
    }
    if ((item === '8' || item === '9' || item === '10' || item === '11' || item === '12' || item === '13' || item === '14' || item === '15') && cmd.indexOf(commond2) < 0) {
      cmd.push(commond2)
    }
    if ((item === '16' || item === '17' || item === '18' || item === '19' || item === '20' || item === '21' || item === '22' || item === '23') && cmd.indexOf(commond3) < 0) {
      cmd.push(commond3)
    }
  })
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
        var item = data[i]
        if (item.length >= 42) {
          var addrback = item.substr(0, 2)
          var func2 = item.substr(2, 2)
          if (addrback === addr.toLowerCase() && func2 === '03') {
            if (cmd[i] === commond1) {
              allChecks['0'] = item.substr(6, 4)
              allChecks['1'] = item.substr(10, 4)
              allChecks['2'] = item.substr(14, 4)
              allChecks['3'] = item.substr(18, 4)
              allChecks['4'] = item.substr(22, 4)
              allChecks['5'] = item.substr(26, 4)
              allChecks['6'] = item.substr(30, 4)
              allChecks['7'] = item.substr(34, 4)
            }
            if (cmd[i] === commond2) {
              allChecks['8'] = item.substr(6, 4)
              allChecks['9'] = item.substr(10, 4)
              allChecks['10'] = item.substr(14, 4)
              allChecks['11'] = item.substr(18, 4)
              allChecks['12'] = item.substr(22, 4)
              allChecks['13'] = item.substr(26, 4)
              allChecks['14'] = item.substr(30, 4)
              allChecks['15'] = item.substr(34, 4)
            }
            if (cmd[i] === commond3) {
              allChecks['16'] = item.substr(6, 4)
              allChecks['17'] = item.substr(10, 4)
              allChecks['18'] = item.substr(14, 4)
              allChecks['19'] = item.substr(18, 4)
              allChecks['20'] = item.substr(22, 4)
              allChecks['21'] = item.substr(26, 4)
              allChecks['22'] = item.substr(30, 4)
              allChecks['23'] = item.substr(34, 4)
            }
          }
        }
      }
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
