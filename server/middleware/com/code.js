// const config = require('../config/config')
exports.discode = function(cmd) {
  const obj = { }
  if (cmd === undefined) {
    return
  }
  if (cmd.substr(0, 2) === 'AA' && cmd.substr(cmd.length - 4, 4) === 'FF22') {
    if (cmd.length === 8) {
      if (cmd === 'AA85FF22') {
        obj.funcode = '85'
        obj.title = '主站进入配置模式'
      } else if (cmd === 'AA86FF22') {
        obj.funcode = '86'
        obj.title = '主站退出配置模式'
      } else if (cmd === 'AA87FF22') {
        obj.funcode = '87'
        obj.title = '指令下发成功'
      } else {
        obj.title = '指令未知'
      }
    } else if (cmd === 'AA0000AA00008200010100011A0C1740882256FF22') {
      obj.title = '从站初始化成功'
    } else {
      const funcode = cmd.substr(12, 2)
      // 功能码
      obj.funcode = funcode
      obj.type = 1
      if (funcode === '81') {
        obj.loraAddr = cmd.substr(14, 4) // 从站地址
        obj.netAddr = cmd.substr(22, 4) // 主站地址
        obj.loraType = cmd.substr(18, 2) // 设备类型
        obj.speed = cmd.substr(20, 2) // 设备速率
      } else if (funcode === '82') {
        obj.loraAddr = cmd.substr(14, 4) // 从站地址
        obj.netAddr = cmd.substr(20, 4) // 主站地址
      }
    }
    return obj
  } else {
    obj.type = 0
    return obj
  }
}
