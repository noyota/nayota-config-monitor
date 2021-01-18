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
  })
}
/**
 * 搜索设备
 * 回调 [addr] 返回搜索到的设备的地址
 */

Relay.prototype.find = function(startAddr, endAddr) {
  if (startAddr && typeof startAddr === 'string')startAddr = parseInt(startAddr)
  if (endAddr && typeof endAddr === 'string')endAddr = parseInt(endAddr)
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperates = this.options.defaultOperate
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  var commond = '55' + xor('00ab0000')
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if (result.length < 12) {
        return error(400)
      }
      var data = result.substr(2, result.length - 4)
      var validatedata = xor(data)
      if (validatedata.toLowerCase() !== result.substr(2, result.length).toLowerCase()) {
        return error(401)
      }
      var func = result.substr(0, 2)
      if (func !== '55') {
        return error(402)
      }
      var addr = result.substr(8, 2)
      var json = {
        shortAddress: addr,
        name: devicename + addr,
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
  if (typeof options.oldAddr === 'number')options.oldAddr = options.oldAddr.toString(16)
  while (options.oldAddr.length < 2) {
    options.oldAddr = '0' + options.oldAddr
  }

  var commond = '55' + xor(options.oldAddr + 'aa00' + options.shortAddress)
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
      if (result.length < 6) {
        return error(400)
      }
      var func = result.substr(0, 2)
      if (func !== '54') {
        return error(401)
      }
      var code = result.substr(4, 2)
      if (code.toLowerCase() !== 'aa') {
        return error(402)
      }
      var addr = result.substr(2, 2)
      if (addr !== options.shortAddress) {
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
  if (code == null)code = this.checksAddress
  else if (typeof code === 'string') code = [code]
  var analysis = []
  var _this = this
  var cmd = []
  code.forEach(function(item) {
    analysis.push(_this['analysis' + item])
  })
  var allOperates = ['0', '1', '2', '3', '4', '5', '6', '7', '8']
  allOperates.forEach(function(item) {
    code.push(item)
  })
  if (typeof addr === 'number')addr = addr.toString(16)
  var commond = '55' + xor(addr + 'a80000')
  if (code.indexOf('0') > -1 || code.indexOf('1') > -1 || code.indexOf('2') > -1 || code.indexOf('3') > -1 || code.indexOf('4') > -1 || code.indexOf('5') > -1 || code.indexOf('6') > -1 || code.indexOf('7') > -1 || code.indexOf('8') > -1) {
    cmd.push(commond)
  }
  while (addr.length < 2) {
    addr = '0' + addr
  }
  return {
    cmd: cmd.join(','),
    resolve: function(result, success, error) {
      var data = result.split(',')
      var res = {}
      for (var i = 0; i < data.length; i++) {
        var item = data[i]
        if (item !== '') {
          var validatedata = xor(item.substr(2, item.length - 4))
          if (validatedata.toLowerCase() !== item.substr(2, item.length - 2).toLowerCase()) {
            return error(401)
          }
          var addrback = item.substr(2, 2)
          if (addrback.toLowerCase() !== addr.toLowerCase()) {
            return error(403)
          }
          const func = item.substr(0, 2)
          if (func !== '57') {
            return error(402)
          }
          var dataf = parseInt(item.substr(8, 2), 16).toString(2)
          while (dataf.length < 8) {
            dataf = '0' + dataf
          }
          res['1'] = parseInt(dataf.substr(7, 1))
          res['2'] = parseInt(dataf.substr(6, 1))
          res['3'] = parseInt(dataf.substr(5, 1))
          res['4'] = parseInt(dataf.substr(4, 1))
          res['5'] = parseInt(dataf.substr(3, 1))
          res['6'] = parseInt(dataf.substr(2, 1))
          res['7'] = parseInt(dataf.substr(1, 1))
          res['8'] = parseInt(dataf.substr(0, 1))
        }
      }
      success(res)
    }
  }
}
function xor(commond) {
  let jy = 0
  commond = commond.replace(new RegExp(/( )/g), '')
  for (let i = 0; i < commond.length; i += 2) {
    jy ^= parseInt(commond.substr(i, 2), 16)
  }
  return commond + jy.toString(16)
}
// 写设备
Relay.prototype.write = function(addr, code, state, operates) {
  code = parseInt(code).toString(16)
  while (code.length < 2) {
    code = '0' + code
  }
  var ostate = ''
  if (code === '00') {
    if (state === 1) {
      ostate = 'A4'
    } else {
      ostate = 'A5'
    }
  } else {
    if (state === 1) {
      ostate = 'A0'
    } else {
      ostate = 'A1'
    }
  }
  var commond = '55' + xor(addr + ostate + '00' + code)
  return {
    cmd: commond,
    timeout: 3000,
    resolve: function(result, success, error) {
      var addrF = result.substr(2, 2)
      if (addrF !== addr) {
        return error(401)
      }
      var cofun = result.substr(0, 2)
      if (cofun !== '54') {
        return error(402)
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
}
/**
 * 简析主动上报指令，并且生成一个数组
 */
Relay.prototype.decode = function(result) {

}

Relay.prototype.navi = function(result) {
  if (result) {
    const ret = result.substr(2, 2)
    return ret
  }
  return null
}

module.exports = Relay
