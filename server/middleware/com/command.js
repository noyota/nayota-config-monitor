'use strict'

class Command {
  constructor(prop) {
    if (this.field === undefined) {
      this.field = field
    }
    this.field = Object.assign(this.field, prop)
    let cmds = []
    if (this.field.cmd.indexOf(',') > -1) {
      cmds = this.field.cmd.split(',')
    } else {
      cmds.push(this.field.cmd)
    }
    cmds = cmds.map(cmd => this.field.loraEncode(cmd, this.field))
    this.field.cmd = cmds.join(',')
  }
  /**
   * 处理反馈的命令
   * @param result
   */
  callback(result) {
    const { loraDecode, resolve } = this.field
    let cmds = []
    if (result.indexOf(',') > -1) {
      cmds = result.split(',')
    } else {
      cmds.push(result)
    }
    cmds = cmds.map(cmd => loraDecode(cmd, this.field))
    cmds = cmds.join(',')
    resolve(cmds, (res) => {
      this.end(res)
    }, (rej) => {
      this.error(rej)
    })
  }

  /**
   * 返回函数 此函数由SerialPort中的addCommand赋予 执行完成后可以反馈到正确的结果
   * @param res
   */
  end(res) {
    console.log(res)
  }

  error(rej) {
    console.log(rej)
  }
}
const field = {
  com: '',
  cmd: '', // 已经经过设备协议分析的命令  可能的结构：单个命令 或 多个以逗号分割的命令 或 空命令（没有设备协议）
  loraDecode: null, // Lora命令解析
  loraEncode: null, // Lora命令组合
  resolve: null, // 设备命令解析
  backtype: true, // 返回类型。读到数据就返回(true)和读完所有指令返回
  back: '', // 返回命令的拼接
  loraAddr: '',
  loraPwd: '',
  timeout: 0, // 指定命令发送间隔时间 默认0
  state: null, // lora从站类型  01 485型 02 开关型 03 电流 04电机型 05开关量 06温湿度 07人员感应
  port: null, // 串口配置
  waitTime: 0, // 指定超时等待时间 如果没指定或为0 则使用默认超时等等时间
  netAddr: ''
}
module.exports = Command
