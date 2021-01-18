function Relay(options, verification) {
  this.options = options
  this.he = verification.he
}

Relay.prototype.config = function(address, net, pwd, loraData, attribute) {
  let cmd = 'aa000002' + address + loraData.factor + loraData.bandwidth + net + loraData.frequency + loraData.codingrate + pwd
  cmd = 'aa0000' + this.he(cmd) + 'ff22'
  return {
    cmd
  }
}

Relay.prototype.encode = function(command, options) {
  let cmd = 'aa' + options.loraAddr + options.type + command + options.port
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
  return command.substring(8, command.length - 4)
}

module.exports = Relay
