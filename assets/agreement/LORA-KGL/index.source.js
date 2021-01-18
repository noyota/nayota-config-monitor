function Relay(options, verification) {
  this.options = options
  this.he = verification.he
  this.numToHexStr = verification.numToHexStr
  options.defaultCheck.forEach((test) => {
    this['analysis' + test.address] = test.analysis
  })
}

Relay.prototype.config = function(address, net, pwd, loraData, attribute) {
  const sf = loraData.factor
  const bw = loraData.bandwidth
  const cr = loraData.codingrate
  let hb = null
  attribute.forEach(item => {
    if (item.key === 'Heartbeat')hb = item.value
  })
  // let speed = null
  // if (sf === '09' && bw === '06') {
  //   speed = '02'
  // } else if (sf === '09' && bw === '07') {
  //   speed = '03'
  // } else if (sf === '08' && bw === '08') {
  //   speed = '04'
  // } else {
  //   throw new Error('开关量LORA设备无法支持此扩频因子或带宽。')
  // }
  if (!hb) {
    throw new Error('开关量LORA设置参数不全，请确认参数是否设置。')
  }
  hb = this.numToHexStr(hb, 4)
  const frequency = (parseInt(loraData.frequency, 16)).toString(16)
  let cmd = 'aa000002' + address + sf + bw + net + frequency + cr + hb + pwd
  cmd = 'aa0000' + this.he(cmd) + 'ff22'
  return {
    cmd
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
  const result = parseInt(command.substring(8, command.length - 4))
  const db = parseInt(command.substr(command.length - 4, 2), 16)
  var analyze = null
  eval(this['analysis1'])
  if (analyze) {
    return { '1': analyze(result), '0': db }
  } else {
    return { '1': result, '0': db }
  }
}

module.exports = Relay

