function Relay(options, validate) {
  this.addrmin = 1 // 地址最小
  this.addrmax = 40 // 地址最大
  this.validate = validate
  this.button = [1, 2, 3, 4]
  var _this = this
  this.options = options // options.defaulttest  options.defaultbutton
  // name company analysis address sort
  options.defaultCheck.forEach(function(test) {
    _this['analysis' + test.address] = test.analysis
  })
}
/*
     校验函数
     */
function checkcode(data) {
  var temp = 0
  var strc = data
  while (strc.length >= 2) {
    temp += parseInt(strc.substr(0, 2), 16)
    strc = strc.slice(2)
  }
  var code = (temp & 0xFF ^ 165).toString(16)
  if (code.length < 2) {
    code = '0' + code
  }
  return (data + code)
}
/*
     状态码转命令
     */
function state_to_cmd(state) {
  state = state.split('_')// 状态数组，0为开关，1为模式，2为温度，3为风速
  var command = ''
  var fs = parseInt(state[3]).toString(2)
  if (fs.length < 2) {
    fs = '0' + fs
  }
  var status = parseInt('00' + state[1] + state[0] + '00' + fs, 2).toString(16)
  var temp = parseInt(state[2]).toString(16)
  while (temp.length < 2) {
    temp = '0' + temp
  }
  while (status.length < 2) {
    status = '0' + status
  }
  command = status + '00' + temp + '00'
  return command
}
/*		搜索设备
     回调[addr]返回搜索到的设备地址
     */
Relay.prototype.find = function(startAddr, endAddr) {
  if (startAddr && typeof startAddr === 'string')startAddr = parseInt(startAddr)
  if (endAddr && typeof endAddr === 'string')endAddr = parseInt(endAddr)
  var addr = startAddr || this.addrmin
  var end = endAddr || this.addrmax
  var commond = ''
  while (addr <= end) {						// 从最低到最高进行尝试地址
    var addrS = addr.toString(16)				// 帧数处理
    while (addrS.length < 2) {
      addrS = '0' + addrS
    }
    commond += checkcode('a0' + addrS + '0000000000') + ','
    addr++
  }
  var name = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperate = this.options.defaultOperate
  return {
    cmd: commond.substr(0, commond.length - 1),		// 去除‘，’号
    resolve: function(result, success, error) {
      if (result.length < 16) {
        return error(400)
      }
      var data = result.substr(0, result.length - 2)
      var validatedata = checkcode(data).toLowerCase()			// 验证
      if (validatedata !== result) {
        return error(401)
      }
      var func = result.substr(0, 2)			// 验证功能码
      if (func !== '50') {
        return error(402)
      }
      data = result.substr(2, 2)			// 获取设备地址位，上报
      var json = {
        shortAddress: data,
        name: name + data,
        checks: defaultCheck,
        operates: defaultOperate
      }
      return success(json)
    },
    changeAddr: false 							// 能否改地址
  }
}

/**
     * 读取单个数据
     */
Relay.prototype.read = function(addr, code) {
  if (typeof addr === 'number')addr = addr.toString(16)
  var commond = ''
  while (addr.length < 2) {
    addr = '0' + addr
  }
  commond = checkcode('A0' + addr + '0000000000')
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if (result == null || result === '') {
        return error(400)
      }
      var addrback = result.substr(2, 2)
      if (addrback !== addr.toLowerCase()) {
        return error(403)
      }
      var func = result.substr(0, 2)
      if (func !== '50' && func !== '51') {
        return error(401)
      }
      if (checkcode(result.substr(0, 14)).toLowerCase() !== result) {
        return error(402)
      }
      var data = result.substr(6, 8)
      var zhuangtai = data.substr(0, 2)
      zhuangtai = parseInt(zhuangtai, 16).toString(2) // 十六转二
      while (zhuangtai.length < 8) { // 地址
        zhuangtai = '0' + zhuangtai
      }
      var moshi = parseInt(zhuangtai.substr(2, 1)) // 模式，制冷是0，制热是1
      var launch = parseInt(zhuangtai.substr(3, 1))// 开关状态。开是1，关是0
      var fan = parseInt(zhuangtai.substr(6, 2), 2)// 风速状态，自动是0，高速是1，中速是2，低速是3
      var set_temp = parseInt(data.substr(4, 2), 16)// 设定的温度,十进制
      var cur_temp = parseInt(data.substr(6, 2), 16)// 室温，十进制
      return success({
        '0': cur_temp,
        '1': launch,
        '2': moshi,
        '3': fan,
        '4': set_temp
      })
    }
  }
}

Relay.prototype.write = function(addr, code, state, operates) {
  var maxtemp = 30// 暖风的上限可调，下限10
  var mintemp = 16// 冷风的下限可调，上限30
  addr = addr.toString(16)
  while (addr.length < 2) { // 地址
    addr = '0' + addr
  }
  var launch = 0; var moshi = 0; var fan = 0; var set_temp = 25
  operates.forEach(function(item) {
    if (item.shortAddress === '1')launch = item.value || 0
    else if (item.shortAddress === '2')moshi = item.value || 0
    else if (item.shortAddress === '3')fan = item.value || 0
    else if (item.shortAddress === '4')set_temp = item.value || 25
  })
  if (code === '1') {
    launch = state
  } else if (code === '2') {
    moshi = state
  } else if (code === '3') {
    fan = state
  } else if (code === '4') {
    if (state === 0)set_temp++
    else if (state === 1)set_temp--
    else set_temp = state
  }
  if (set_temp > maxtemp)set_temp = maxtemp
  if (set_temp < mintemp)set_temp = mintemp
  var st = launch.toString() + '_' + moshi.toString() + '_' + set_temp.toString() + '_' + fan.toString()
  st = state_to_cmd(st)
  var commond = checkcode('A1' + addr + '00' + st)
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if (result.length < 16) {
        return error(400)
      }
      var data = result.substr(2, 2)
      if (data !== addr) {
        return error(401)
      }
      var func = result.substr(0, 2)

      if (func !== '50' && func !== '51') {
        return error(402)
      }
      if (checkcode(result.substr(0, 14)).toLowerCase() !== result) {
        return error(403)
      }
      var zhuangtai = result.substr(6, 2)
      zhuangtai = parseInt(zhuangtai, 16).toString(2) // 十六转二
      while (zhuangtai.length < 8) { // 地址
        zhuangtai = '0' + zhuangtai
      }
      if (code === '1') {
        success(parseInt(zhuangtai.substr(3, 1)))
      } else if (code === '2') {
        success(parseInt(zhuangtai.substr(2, 1)))
      } else if (code === '3') {
        success(parseInt(zhuangtai.substr(6, 2), 2))
      } else if (code === '4') {
        success(parseInt(result.substr(10, 2), 16))
      }
    }
  }
}
module.exports = Relay
