function Relay(options, verification) {
  this.options = options
  this.he = verification.he
  this.numToHexStr = verification.numToHexStr
  options.defaultCheck.forEach((test) => {
    this['analysis' + test.address] = test.analysis
  })
}

Relay.prototype.config = function(address, net, pwd, loraData, attribute) {
  let sampling = null
  let report = null
  let reportTemp = null
  let reportHum = null
  attribute.forEach(item => {
    if (item.key === '温湿度采样周期')sampling = item.value
    else if (item.key === 'Heartbeat')report = item.value
    else if (item.key === '触发上报温度差')reportTemp = item.value
    else if (item.key === '触发上报湿度差')reportHum = item.value
  })
  if (!sampling || !report || !reportTemp || !reportHum) {
    throw new Error('LCD温湿度设置参数不全，请确认参数是否设置。')
  }
  sampling = this.numToHexStr(sampling, 4)
  report = this.numToHexStr(report, 4)
  reportTemp = this.numToHexStr(reportTemp, 2)
  reportHum = this.numToHexStr(reportHum, 2)
  const sf = loraData.factor
  const bw = loraData.bandwidth
  let speed = null
  if (sf === '09' && bw === '06') {
    speed = '02'
  } else if (sf === '09' && bw === '07') {
    speed = '03'
  } else if (sf === '08' && bw === '08') {
    speed = '04'
  } else {
    throw new Error('LCD温湿度设备无法支持此扩频因子或带宽。')
  }
  const frequency = (parseInt(loraData.frequency, 16)).toString(16)
  let cmd = 'aa000002' + address + speed + net + frequency + sampling + report + reportTemp + reportHum + pwd
  cmd = 'aa0000' + this.he(cmd) + 'ff22'
  return {
    cmd
  }
}

Relay.prototype.decode = function(command, options) {
  const result = command.substr(14, 16)
  let dy = result.substr(0, 4)
  let wd = result.substr(4, 4)
  let sd = result.substr(8, 4)
  dy = parseInt(dy.substr(0, 2), 16) + parseInt(dy.substr(2, 2), 16) / 100
  wd = parseInt(wd.substr(0, 2), 16) + parseInt(wd.substr(2, 2), 16) / 10
  sd = parseInt(sd.substr(0, 2), 16) + parseInt(sd.substr(2, 2), 16) / 10
  if (wd > 128)wd = -(wd - 128)
  dy = Math.round(dy * 100) / 100
  wd = Math.round(wd * 10) / 10
  sd = Math.round(sd * 10) / 10
  return { '0': dy, '1': wd, '2': sd }
}

module.exports = Relay

