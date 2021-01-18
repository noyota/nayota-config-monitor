/**
 * @author lifeng
 * @date 19-7-9
 * @Description: 主站命令执行对象  依赖 mqtt serve (用于远程命令) serialport 用于本地串口命令 （两个口重叠的serialport）
 */
class Master {
  /**
   * @param serialport 串口对象
   * @param options  主站配置信息
   */
  constructor(serialport, options) {
    this.serialport = serialport
    this.line = false
    this.options = options
  }

  /**
   * 进入配置模式
   * @return {Promise<boolean>}
   */
  async inConfig() {
    const data = await this.serialport.writeReOne('aa05ff22')
    return data === 'aa85ff22'
  }

  /**
   * 退出配置模式
   * @return {Promise<boolean>}
   */
  async outConfig() {
    const data = await this.serialport.writeReOne('aa06ff22')
    return data === 'aa86ff22'
  }

  /**
   * 在线判定
   * @return {Promise<void>}
   */
  async isLine() {

  }

  /**
   * 广播
   */
  async broadcast() {
    const data = 'AA 00 00 AA 00 00 01 AB FF 22'
  }

  /**
   * 退出从站配置模式
   */
  async outSalveConfig() {

  }
  /**
   * 配置主站参数
   */
  async sendConfig() {
    const data='AA 00 00 AA 00 00 02 00 00 01 01 00 00 1C 03 A1 80 01 00 00 5D FF 22'

  }
}
module.exports = Master
