function Relay(options, verification) {
  this.options = options
  this.he = verification.he
  this.numToHexStr = verification.numToHexStr
  options.defaultCheck.forEach((test) => {
    this['analysis' + test.address] = test.analysis
  })
}

Relay.prototype.config = function(address, net, pwd, loraData, attribute) {
  let mnTime = null
  let mnNumber = null
  let hb = null
  attribute.forEach(item => {
    if (item.key === '检测周期')mnTime = item.value
    if (item.key === '模拟量精度')mnNumber = item.value
    if (item.key === 'Heartbeat')hb = item.value
  })
  if (!hb || !mnTime || !mnNumber) {
    throw new Error('模拟量LORA设置参数不全，请确认参数是否设置。')
  }
  mnTime = this.numToHexStr(mnTime, 4)
  mnNumber = this.numToHexStr(mnNumber, 2)
  hb = this.numToHexStr(hb, 4)
  const sf = loraData.factor
  const bw = loraData.bandwidth
  const cr = loraData.codingrate
  const frequency = (parseInt(loraData.frequency, 16)).toString(16)
  let cmd = 'aa000002' + address + sf + bw + net + frequency + cr + mnTime + mnNumber + hb + pwd
  cmd = 'aa0000' + this.he(cmd) + 'ff22'
  return {
    cmd
  }
}

Relay.prototype.encode = function(command, options) {
  let cmd = 'aa' + options.loraAddr + options.type
  cmd = this.he(cmd)
  cmd = 'aa' + options.netAddr + cmd + 'ff22'
  return cmd
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
  const result = parseInt(command.substring(8, command.length - 4), 16)
  var analyze = null
  eval(this['analysis1'])
  if (analyze) {
    return { '1': analyze(result) }
  } else {
    return { '1': result }
  }
}

module.exports = Relay

