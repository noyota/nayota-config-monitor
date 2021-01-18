function Relay(options, verification) {
  this.options = options
  this.he = verification.he
  this.numToHexStr = verification.numToHexStr
  options.defaultCheck.forEach((test) => {
    this['analysis' + test.address] = test.analysis
  })
}

Relay.prototype.config = function(address, net, pwd, loraData, attribute) {
  // let deviation = null
  // const sleep = null
  // const cad = null
  // const cy = null
  // const hb = null
  // const wc = null
  // attribute.forEach(item => {
  //   if (item.key === '偏移间隔')deviation = item.value
  //   else if (item.key === '睡眠间隔')sleep = item.value
  //   else if (item.key === 'Cad间隔')cad = item.value
  //   else if (item.key === '采样周期')cy = item.value
  //   else if (item.key === 'Heartbeat')hb = item.value
  //   else if (item.key === '温度差')wc = item.value
  // })
  // if (!deviation || !sleep || !cad || !cy || !hb || !wc) {
  //   throw new Error('空调设置参数不全，请确认参数是否设置。')
  // }
  // deviation = this.numToHexStr(deviation, 2)
  // sleep = this.numToHexStr(sleep, 4)
  // cad = this.numToHexStr(cad, 4)
  // cy = this.numToHexStr(cy, 4)
  // hb = this.numToHexStr(hb, 4)
  // wc = this.numToHexStr(wc, 4)
  const sf = loraData.factor
  const bw = loraData.bandwidth
  const cr = loraData.codingrate
  const frequency = (parseInt(loraData.frequency, 16)).toString(16)
  let cmd = 'aa00000d' + address + sf + bw + net + frequency + cr + pwd
  cmd = 'aa0000' + this.he(cmd) + 'ff22'
  return {
    cmd
  }
}

Relay.prototype.read = function(options, code, state) {
  state = code + '' + state
  let cmd = 'aa' + options.loraAddr + '06'
  cmd = this.he(cmd)
  cmd = 'aa' + options.netAddr + cmd + 'ff22'
  var _this = this
  return {
    cmd: cmd,
    resolve: function(result, success, error) {
      if (result.length < 30) {
        return error(400)
      }
      const start = result.indexOf('aa' + options.netAddr.toLowerCase())
      const end = result.indexOf('ff22')
      if (start < 0 || end < 0) {
        return error(401)
      }
      result = result.substring(start + 6, end)
      const start2 = result.indexOf('aa' + options.loraAddr.toLowerCase())
      if (start2 < 0) {
        return error(402)
      }
      const code = result.substring(6, 8)
      if (code !== '86') {
        return error(403)
      }
      const cmd = result.substring(0, result.length - 2)
      if (result !== _this.he(cmd)) {
        return error(404)
      }
      const dy_data_z = parseInt(result.substring(8, 10), 16)
      const dy_data_x = parseInt(result.substring(10, 12), 16) / 100
      const dy_data = dy_data_z + dy_data_x
      const wd_data_z = parseInt(result.substring(12, 14), 16)
      const wd_data_x = parseInt(result.substring(14, 16), 16) / 100
      const wd_data = wd_data_z + wd_data_x
      let db = result.substr(16, 2)
      db = parseInt(db, 16)
      console.log({ 3: dy_data, 4: wd_data, 5: db })
      success({ 3: dy_data, 4: wd_data, 5: db })
    }
  }
}

Relay.prototype.write = function(options, code, state, data) {
  state = code + '' + state
  let cmd = 'aa' + options.loraAddr + '13' + state + '0001'
  cmd = this.he(cmd)
  cmd = 'aa' + options.netAddr + cmd + 'ff22'
  return {
    cmd: cmd,
    resolve: function(result, success, error) {
      if (result.length < 22) {
        return error(400)
      }
      const start = result.indexOf('aa' + options.netAddr.toLowerCase())
      const end = result.indexOf('ff22')
      if (start < 0 || end < 0) {
        return error(401)
      }
      const code = result.substring(12, 14)
      if (code !== '93') {
        return error(402)
      }
      const dat = parseInt(result.substring(15, 16))
      return success(dat)
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
Relay.prototype.configure = function(options, attribute) {
  let cmds = []
  const he = this.he
  function paramData(cmd, orderNo, cmds) {
    if (cmd.length > 100) {
      // 计算指令截成几段
      let i = 1
      const j = parseInt(cmd.length / 100) + 1
      while (cmd.length > 100) {
        var mm = cmd.substr(0, 100)
        cmd = cmd.substr(100)
        let sendCmd = 'aa' + options.shortAddress.toLowerCase() + '16' + orderNo + i + '' + j + mm + '0001'
        sendCmd = he(sendCmd)
        sendCmd = 'aa' + options.netAddr + sendCmd + 'ff22'
        cmds.push(sendCmd)
        i = i + 1
      }
      if (cmd.length > 0) {
        let sendCmd = 'aa' + options.shortAddress.toLowerCase() + '16' + orderNo + j + '' + j + cmd + '0001'
        sendCmd = he(sendCmd)
        sendCmd = 'aa' + options.netAddr + sendCmd + 'ff22'
        cmds.push(sendCmd)
      }
    } else {
      let sendCmd = 'aa' + options.shortAddress.toLowerCase() + '16' + orderNo + '11' + cmd + '0001'
      sendCmd = he(sendCmd)
      sendCmd = 'aa' + options.netAddr + sendCmd + 'ff22'
      cmds.push(sendCmd)
    }
    return cmds
  }
  attribute.forEach(item => {
    if (item.key === '10')cmds = paramData(item.value.replace(/ *[\s] */gm, ''), '10', cmds)
    else if (item.key === '11')cmds = paramData(item.value.replace(/ *[\s] */gm, ''), '11', cmds)
    else if (item.key === '20')cmds = paramData(item.value.replace(/ *[\s] */gm, ''), '20', cmds)
    else if (item.key === '21')cmds = paramData(item.value.replace(/ *[\s] */gm, ''), '21', cmds)
  })
  return {
    cmd: cmds.join(','),
    try: 5,
    resolve: function(result, success, error) {
      const data = result.split(',')
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        if (item !== '') {
          const start = item.indexOf('aa' + options.netAddr.toLowerCase())
          const end = item.indexOf('ff22')
          if (start < 0 || end < 0) {
            return error(402)
          }
          item = item.substring(start + 6, end)
          const start2 = item.indexOf('aa' + options.shortAddress.toLowerCase() + '96')
          if (start2 < 0) {
            return error(403)
          }
        } else {
          error(401)
        }
      }
      success({})
    }
  }
}
Relay.prototype.decode = function(command, options) {
  if (options.netAddr === undefined || options.loraAddr === undefined) {
    return ''
  }
  const start = command.indexOf('aa' + options.netAddr.toLowerCase())
  const end = command.indexOf('ff22')
  if (start < 0 || end < 0) return ''
  command = command.substring(start + 6, end)
  const start2 = command.indexOf('aa' + options.loraAddr.toLowerCase())
  if (start2 < 0) {
    return ''
  }
  // const code = command.substring(6, 8)
  // if (code === '86') {
  //   const cmd = command.substring(0, command.length - 2)
  //   if (command === this.he(cmd)) {
  //     const dy_data_z = parseInt(command.substring(8, 10), 16)
  //     const dy_data_x = parseInt(command.substring(10, 12), 16) / 100
  //     const dy_data = dy_data_z + dy_data_x
  //     const wd_data_z = parseInt(command.substring(12, 14), 16)
  //     const wd_data_x = parseInt(command.substring(14, 16), 16) / 100
  //     const wd_data = wd_data_z + wd_data_x
  //     let db = command.substr(16, 2)
  //     db = parseInt(db, 16)
  //     return { 3: dy_data, 4: wd_data, 5: db }
  //   } else {
  //     return {}
  //   }
  // }
  return {}
}

module.exports = Relay

