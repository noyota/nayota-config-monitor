function Relay(options, validate) {
  this.validate = validate
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
 * 读取数据
 */

// Relay.prototype.read = function(addr, code) {
//   if (code == null)code = this.checksAddress
//   else if (typeof code === 'string') code = [code]
//   var analysis = []
//   var _this = this
//   code = ['0', '1', '2', '3', '4', '5', '6']
//   code.forEach(function(item) {
//     analysis.push(_this['analysis' + item])
//   })
//   if (typeof addr === 'number')addr = addr.toString(16)
//   while (addr.length < 2) {
//     addr = '0' + addr
//   }
//   var commond = this.validate.crc16(addr + '0300000006')
//   var validate = this.validate
//   return {
//     cmd: commond,
//     resolve: function(result, success, error) {
//       var item = rmDb(result)
//       console.log(item, item.length)
//       var res = {}
//       var allChecks = {}
//       if (item !== '') {
//         var validatedata = validate.crc16(item.substr(0, item.length - 4))
//         if (validatedata.toLowerCase() !== item.toLowerCase()) {
//           return error(401)
//         }
//         var addrback = item.substr(0, 2)
//         if (addrback.toLowerCase() !== addr.toLowerCase()) {
//           return error(403)
//         }
//         const func = item.substr(2, 2)
//         if (func !== '03') {
//           return error(402)
//         }
//         // // 设定空开的信号强度的地址为10,
//         // allChecks['0'] = parseInt(item.substr(item.length - 2, 2))
//         // 室温设定
//         allChecks['1'] = item.substr(6, 4)
//         // 温度
//         allChecks['2'] = item.substr(14, 4)
//         const data = validate.hex_to_bin(item.substr(26, 4))
//         // 模式
//         allChecks['3'] = data.substr(1, 4)
//         // 模式
//         allChecks['4'] = data.substr(5, 2)
//         // 开关
//         allChecks['5'] = data.substr(7, 1)
//         // 锁屏
//         allChecks['6'] = data.substr(8, 1)
//       }
//       code.forEach(function(item, index) {
//         var analyze = null
//         eval(analysis[index])
//         if (allChecks[item] && analyze) {
//           res[item] = analyze(allChecks[item])
//         } else {
//           res[item] = allChecks[item]
//         }
//       })
//       success(res)
//     }
//   }
// }

/**
 *
 * @param addr  lorawan 设备 没有额外的地址 此字段暂时保留
 * @param code
 * @param state
 * @param operates
 * @return {{cmd: (*|string), resolve: resolve}}
 */
Relay.prototype.write = function(addr, code, state, operates) {
  code = parseInt(code)
  if (typeof code === 'number')code = code.toString(16)
  let commond = ''
  const arr = [0, 1, 192, 3, 0xff]
  switch (code) {
    case '1': // 开关机
      state = state.toString(2)
      if (state.length < 2)state = '0' + state
      arr[3] = parseInt('000000' + state, 2)
      break
    case '2': // 模式
      state = state.toString(2)
      if (state.length < 2)state = '0' + state
      arr[3] = parseInt('1' + state + '00011', 2)
      break
    case '3': // 风速
      state = state.toString(2)
      if (state.length < 2)state = '0' + state
      arr[3] = parseInt('0001' + state + '11', 2)
      break
    case '4': // 温度\
      if (state === 1) { // 温度减
        arr[4] = operates.filter(item => item.shortAddress === '4')[0].value - 1
      } else if (state === 0) {
        arr[4] = operates.filter(item => item.shortAddress === '4')[0].value + 1 // 温度加
      } else {
        arr[4] = state
      }
      break
  }
  arr.forEach(item => {
    commond += this.validate.numToHexStr(item, 2)
  })

  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if (result && result.substr(4, 2) === '05') {
        // const type = result.substr(6, 2)
        const val16 = result.substr(8, 8)
        let val2 = parseInt(val16, 16).toString(2)
        while (val2.length < 32) {
          val2 = '0' + val2
        }
        const ms = val2.substr(2, 2)
        const fs = val2.substr(4, 2)
        const kg = val2.substr(6, 2)
        const wd = val2.substr(16, 8)
        const wd_xs = val2.substr(12, 4)
        const sdwd = val2.substr(24, 8)
        return success({
          '0': parseInt(wd, 2) + parseInt(wd_xs, 2) / 10,
          '1': parseInt(kg, 2),
          '2': parseInt(ms, 2),
          '3': parseInt(fs, 2),
          '4': parseInt(sdwd, 2)
        })
      }
      return error('404')
    }
  }
}
/**
 * 简析主动上报指令，并且生成一个数组
 */
Relay.prototype.decode = function(result) {
  if (result && result.substr(4, 2) === '05') {
    // const type = result.substr(6, 2)
    const val16 = result.substr(8, 8)
    let val2 = parseInt(val16, 16).toString(2)
    while (val2.length < 32) {
      val2 = '0' + val2
    }
    const ms = val2.substr(2, 2)
    const fs = val2.substr(4, 2)
    const kg = val2.substr(6, 2)
    const wd = val2.substr(16, 8)
    const wd_xs = val2.substr(12, 4)
    const sdwd = val2.substr(24, 8)
    return {
      '0': parseInt(wd, 2) + parseInt(wd_xs, 2) / 10,
      '1': parseInt(kg, 2),
      '2': parseInt(ms, 2),
      '3': parseInt(fs, 2),
      '4': parseInt(sdwd, 2)
    }
  }
  return null
}

module.exports = Relay
