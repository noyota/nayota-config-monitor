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
  const frequency = (parseInt(loraData.frequency, 16)).toString(16)
  let cmd = 'aa000002' + address + sf + bw + net + frequency + cr + pwd
  cmd = 'aa0000' + this.he(cmd) + 'ff22'
  return {
    cmd
  }
}

Relay.prototype.read = function(options, code) {
  let cmd = 'aa' + options.loraAddr + '18'
  cmd = this.he(cmd)
  cmd = 'aa' + options.netAddr + cmd + 'ff22'
  return {
    cmd: cmd,
    resolve: function(result, success, error) {
      if (result.length < 24) {
        return error(400)
      }
      const start = result.indexOf('aa' + options.netAddr.toLowerCase())
      const end = result.indexOf('ff22')
      if (start < 0 || end < 0) {
        return error(401)
      }
      const code = result.substring(12, 14)
      if (code !== '98') {
        return error(402)
      }
      const data = result.substr(14, 16)
      let dy = data.substr(0, 4)
      let wd = data.substr(4, 4)
      let sd = data.substr(8, 4)
      dy = parseInt(dy.substr(0, 2), 16) + parseInt(dy.substr(2, 2), 16) / 100
      wd = parseInt(wd.substr(0, 2), 16) + parseInt(wd.substr(2, 2), 16) / 10
      sd = parseInt(sd.substr(0, 2), 16) + parseInt(sd.substr(2, 2), 16) / 10
      if (wd > 128)wd = -(wd - 128)
      dy = Math.round(dy * 100) / 100
      wd = Math.round(wd * 10) / 10
      sd = Math.round(sd * 10) / 10
      let db = result.substr(12, 2)
      db = parseInt(db, 16)
      return success({ '0': dy, '1': wd, '2': sd, '3': db })
    }
  }
}

Relay.prototype.decode = function(command, options) {
  const start = command.indexOf('aa' + options.netAddr.toLowerCase())
  const end = command.indexOf('ff22')
  if (start < 0 || end < 0) return ''
  command = command.substring(start + 6, end)
  const start2 = command.indexOf('aa' + options.loraAddr.toLowerCase())
  if (start2 < 0) {
    return ''
  }
  return {}
}

module.exports = Relay

