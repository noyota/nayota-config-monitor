const Verification = require('../../utils/verification')
const path = require('path')
// 主站进入配置模式


exports.mConfig_in = function(options, mqtt) {
  const data = { com: options.com, cmd: 'AA05FF22' }
  mqtt.publish(options.topic, JSON.stringify(data), { qos: 1 })
}
// 主站退出配置模式
exports.mConfig_out = function(options, mqtt) {
  const data = { com: options.com, cmd: 'AA06FF22' }
  mqtt.publish(options.topic, JSON.stringify(data), { qos: 1 })
}
// 从站退出配置模式
exports.sConfig_out = function(options, mqtt) {
  const data = { com: options.com, cmd: 'AA0000AA00000FB9FF22' }
  mqtt.publish(options.topic, JSON.stringify(data), { qos: 1 })
}
// 初始化从站指令
exports.sConfig_init = function(options, mqtt) {
  const data = { com: options.com, cmd: 'AA0000AA00000200010100011A0C17408822D6FF22' }
  mqtt.publish(options.topic, JSON.stringify(data), { qos: 1 })
}
// 配置从站速率
exports.sConfig_sl = function(options, mqtt) {
  const data = { com: options.com, cmd: 'AA0000AA000002000101000119DE5080882220FF22' }
  mqtt.publish(options.topic, JSON.stringify(data), { qos: 1 })
}
exports.doConfig = function(options, mqtt) {
  if (options.configType === '0') {
    this.mConfig_in(options, mqtt)
  } else if (options.configType === '1') {
    this.mConfig_out(options, mqtt)
  } else if (options.configType === '2') {
    this.sConfig_out(options, mqtt)
  } else if (options.configType === '3') {
    this.sConfig_init(options, mqtt)
  } else if (options.configType === '4') {
    this.sConfig_sl(options, mqtt)
  }
}

exports.dConfig_in = function(options, mqtt) {
  const data = { com: options.com, cmd: options.cmd }
  mqtt.publish(options.topic, JSON.stringify(data), { qos: 1 })
}

exports.reqAgreement = function(hardwareword) {
  const LoraDevice = require(path.resolve('./public/' + hardwareword.agreement.hanshu))
  const loradevice = new LoraDevice(hardwareword, Verification.crc16)
  return loradevice
}
