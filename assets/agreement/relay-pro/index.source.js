
function Relay(options, validate) {
  this.addrmin = 20 // 地址最小
  this.addrmax = 40 // 地址最大
  this.validate = validate
  this.button = [0, 1, 2, 3]
  this.options = options
  // name company analysis address sort
}
/**
   * 搜索设备
   * 回调 [addr] 返回搜索到的设备的地址
   */
Relay.prototype.find = function() {
  var commond = '000300640001c404'
  var validate = this.validate
  var name = this.options.name
  var defaultOperate = this.options.defaultOperate
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
        name: name + address,
        operates: defaultOperate
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
  var name = this.options.name
  var defaultOperate = this.options.defaultOperate
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
      if (func !== '06') {
        return error(402)
      }

      var json = {
        shortAddress: options.shortAddress,
        name: name + options.shortAddress,
        operates: defaultOperate
      }
      return success(json)
    }
  }
  // console.log(crc.crc16modbus([0,6,0,0x64,0,1]).toString(16));
}
/**
   * 读取所有
   */
Relay.prototype.read = function(address, code) {
  if (typeof address === 'number')address = address.toString(16)
  while (address.length < 2) {
    address = '0' + address
  }
  var validate = this.validate
  var commond = address + '01 00 00 00 04'
  commond = validate.crc16(commond)
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if (result.length < 12) {
        return error(400)
      }
      var data = result.substr(0, result.length - 4)
      var validatedata = validate.crc16(data)
      if (validatedata !== result) {
        return error(401)
      }
      var addr = result.substr(0, 2)
      if (addr !== address.toLowerCase()) {
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
      const res = {}
      for (var i = 0; i < data.length; i++) {
        res[3 - i] = parseInt(data.charAt(i))
      }
      return success(res)
    }
  }
}

/**
 * 写操作
 * @param addr
 * @param options  shortAddress value, oldValue
 * @return {{cmd: string, resolve: resolve}}
 */
Relay.prototype.write = function(addr, code, state) { // 01 05 00 03 FF 00 7C 3A 线圈4 01 05 00 03 00 00 3D CA
  while (addr.length < 2) {
    addr = '0' + addr
  }
  var validate = this.validate
  while (code.length < 2) {
    code = '0' + code
  }
  if (state === 1)state = 'ff'
  else state = '00'
  var commond = validate.crc16(addr + '05 00 ' + code + state + ' 00 ')
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if (result.length < 16) {
        return error(400)
      }
      var data = result.substr(0, result.length - 4)
      var validatedata = validate.crc16(data)
      if (validatedata !== result) {
        return error(401)
      }
      var addrback = result.substr(0, 2)
      if (addrback !== addr.toLowerCase()) {
        return error(403)
      }
      var func = result.substr(2, 2)
      if (func !== '05') {
        return error(402)
      }
      data = result.substr(8, 2)
      if (data === 'ff')data = 1
      else if (data === '00')data = 0
      return success(data)
    }
  }
}

module.exports = Relay
