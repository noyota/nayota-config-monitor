function Relay(options, validate) {
  this.addrmin = 1 // 地址最小
  this.addrmax = 20 // 地址最大
  this.validate = validate
}

/**
 * 读取数据
 */

Relay.prototype.read = function(addr, code) {

}

Relay.prototype.write = function(addr, code, state) {

}

Relay.prototype.encode = function(cmd) {
  return cmd
}
/**
 * 简析主动上报指令，并且生成一个数组
 */
Relay.prototype.decode = function(result) {
  return result
}

module.exports = Relay
