function Relay(options, verification) {
  this.options = options
  this.he = verification.he
  this.numToHexStr = verification.numToHexStr
  options.defaultCheck.forEach((test) => {
    this['analysis' + test.address] = test.analysis
  })
}

Relay.prototype.config = function(address, net, pwd, loraData, attribute) {
  let hb = null
  attribute.forEach(item => {
    if (item.key === 'Heartbeat')hb = item.value
  })
  if (!hb) {
    throw new Error('球阀LORA设置参数不全，请确认参数是否设置。')
  }
  hb = this.numToHexStr(hb, 4)
  const sf = loraData.factor
  const bw = loraData.bandwidth
  const cr = loraData.codingrate
  const frequency = (parseInt(loraData.frequency, 16)).toString(16)
  let cmd = 'aa000002' + address + sf + bw + net + frequency + cr + hb + pwd
  cmd = 'aa0000' + this.he(cmd) + 'ff22'
  return {
    cmd
  }
}

Relay.prototype.read = function(options, code) {
  let cmd = 'aa' + options.loraAddr + '0400'
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
      if (code !== '84') {
        return error(402)
      }
      let dat1 = 0
      let dat2 = 0
      dat1 = parseInt(result.substring(14, 15)) - 1
      dat2 = parseInt(result.substring(15, 16)) - 1
      success({ '0': dat1, '1': dat2 })
    }
  }
}
Relay.prototype.write = function(options, code, state, data) {
  if (code === 0 || code === '0') {
    state = (state + 1).toString() + '0'
  }
  if (code === 1 || code === '1') {
    state = '0' + (state + 1).toString()
  }
  let cmd = 'aa' + options.loraAddr + '04' + state
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
      if (code !== '84') {
        return error(402)
      }
      let dat = 0
      if (code === '0') dat = parseInt(result.substring(14, 15)) - 1
      else if (code === '1') dat = parseInt(result.substring(15, 16)) - 1
      return success(dat)
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
  const code = command.substring(6, 8)
  if (code === '99') {
    return {}
  }
  let dat1 = 0
  let dat2 = 0
  dat1 = parseInt(command.substring(8, 9)) - 1
  dat2 = parseInt(command.substring(9, 10)) - 1
  return { '0': dat1, '1': dat2 }
}

module.exports = Relay

