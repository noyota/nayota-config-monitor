// const config = require('../config/config')
const { CodeApi, CommandApi } = require('../com')
const Verification = require('../../utils/verification')
const Hardware = require('../com/hardware')
const path = require('path')
class Device {
  /**
   * 传入lora代表无线 传入hardware代表有线设备
   * @param props
   */
  constructor(props) {
    if (this.state === undefined) {
      this.state = state
    }
    if (this.configCmds === undefined || this.configCmds.length <= 0) {
      this.configCmds = configCmds
    }
    this.state.lora = props.lora
    const { lora } = this.state
    if (lora) {
      const LoraDevice = require(path.resolve('./public/' + lora.hardwareword.agreement.hanshu))
      const loradevice = new LoraDevice(lora.hardwareword, Verification.crc16)
      lora.agreement = loradevice
      console.log(lora.agreement)
      console.log('agreement-----------------------')
      // lora.hardwares.map(hardware=>{
      //   hardware.button=hardware.controlSet.toRefArray().map(control=>{
      //     control.meAddr=encodeAddress(control.address).cAddr;
      //     return control;
      //   });
      //   hardware.test=hardware.checkSet.toRefArray().map(check=>{
      //     check.meAddr=encodeAddress(check.address).cAddr;
      //     return check;
      //   });
      //   const address = encodeAddress(hardware.address); //设备全地址
      //   const number=address.type;  //设备型号
      //   hardware.meAddr=address.harewareAddr;
      //   hardware.agreement=HardWareAgreement[number];
      // });
    }
    //   lora.agreement = LoraAgreement[SlaveTypes[lora.type].code]
    //   lora.hardwares = session.Hardware.filter({ lora: lora.id }).toModelArray()
    //   lora.hardwares.map(hardware => {
    //     hardware.button = hardware.controlSet.toRefArray().map(control => {
    //       control.meAddr = encodeAddress(control.address).cAddr
    //       return control
    //     })
    //     hardware.test = hardware.checkSet.toRefArray().map(check => {
    //       check.meAddr = encodeAddress(check.address).cAddr
    //       return check
    //     })
    //     const address = encodeAddress(hardware.address) // 设备全地址
    //     const number = address.type // 设备型号
    //     hardware.meAddr = address.harewareAddr
    //     hardware.agreement = HardWareAgreement[number]
    //   })
    // }
  }
  findHardware(obj) {
    // if(findObj.changeAddr){
    console.log(1235)
    // }
  }
  async changeAddr(options, harddevice) {
    const { lora } = this.state
    if (!lora || !lora.agreement) throw new Error('这不是一个有效的LORA设备')
    const changeAddrObj = harddevice.changeAddr(options)
    let port = '41'
    if (harddevice.serialData !== undefined) {
      port = BAUD.indexOf(harddevice.serialData.baud) + '' + PORTSET.indexOf(harddevice.serialdata.databit + harddevice.serialdata.verification + harddevice.serialdata.stopbit)
    }
    const command = new CommandApi({
      com: options.com,
      cmd: changeAddrObj.cmd,
      resolve: changeAddrObj.resolve,
      port: port,
      netAddr: lora.netAddr,
      state: 1,
      loraDecode: lora.agreement.decode,
      loraEncode: lora.agreement.encode,
      loraAddr: lora.address,
      loraPwd: lora.password
    })
    const res = await this.addCommand(command)
    res.state = options.state // 数据保存  0为新增 1为修改
    const addr16 = res.address
    res.lora = lora
    res.oldAddr = options.oldAddr
    let addressOutRola = ''
    if (res.state === 0) { // 如果为新增
      lora.portadds.push(parseInt(res.address, 16)) // 存下地址 转换成int
      addressOutRola = options.number + '_' + lora.netAddr + '8' + res.address
      res.address = addressOutRola + '_' + lora.address
      res.name = parseInt(lora.address, 16) + res.name
      lora.portaddsWidthType.push(res.address) // 存下完整地址
    }
    for (const x in res.test) {
      res.test[x].address = addressOutRola + res.test[x].address + '_' + lora.address
      res.test[x].name = parseInt(lora.address, 16) + addr16 + res.test[x].name
    }
    for (const x in res.button) {
      res.button[x].address = addressOutRola + res.button[x].address + '_' + lora.address
      res.button[x].name = parseInt(lora.address, 16) + addr16 + res.button[x].name
    }
    Hardware.createHardware(res)
  }
  addCommand(command) {
    return new Promise((resolve, reject) => {
      this.configCmds.push(command)
      command.end = resolve
      command.error = reject
    })
  }
  removeCommand(command) {
    this.configCmds.splice(this.configCmds.findIndex(item => item === command), 1)
  }
  async setC(mqtt) {
    let command = null
    if (this.configCmds.length > 0) {
      command = this.configCmds[0]
    }
    if (command == null) return null
    if (command.field.timeout != null && command.timeout > 0) {
      await this.sleep(command.timeout)
    }
    const cmd = command.field.cmd
    await new Promise(resolve => {
      clearInterval(this.job)
      this._sendCommand({ cmd: cmd, com: command.field.com, key: 'key_' + parseInt(Math.random() * 1000 + 1) }, mqtt, (err, result) => {
        if (!command) return resolve()
        console.log('-----------------------')
        console.log(err)
        if (!err) {
          command.callback(result)
        }
        this.removeCommand(command) // 执行完从命令等待队列里清除命令兑现
        this.job = setInterval(() => this.setC(mqtt), 100)
        resolve()
      })
    })
  }
  async start(mqtt) {
    this.job = setInterval(() => this.setC(mqtt), 100)
  }
  async _sendCommand(options, mqtt, callback) {
    console.log('xiafa' + options.cmd)
    const topic = '0164/serial/sendin'
    mqtt.on(options.key, function(message) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!')
      console.log(message.cmd)
      if (message !== undefined) {
        const cmdcode = new CodeApi()
        const loraData = cmdcode.discode(message.cmd)
        if (loraData.funcode === '83') {
          clearTimeout(to) // 清除超时判定
          console.log(to)
          callback(null, message.cmd)
        }
      }
    })
    mqtt.publish(topic, JSON.stringify(options), { qos: 1 })
    const to = setTimeout(function() {
      console.log('没收到正确的反馈')
      callback('没收到正确的反馈')
    }, 2000)
  }
  sleep(timeout) {
    new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, timeout)
    })
  }
}
const configCmds = []
const state = { lora: null, agreement: null }
const BAUD = [0, 1200, 2400, 4800, 9600, 19200, 38400]
const PORTSET = ['', '8N1', '8E1', '8O1', '7N1', '7E1', '7O1', '6N1', '6E1', '6O1']
// const encodeAddress = function(address) {
//   const addr = address.split('_')
//   const type = addr[0]
//   let loraAddr = null
//   if (addr.length === 3)loraAddr = addr[2]
//   const netAddr = addr[1].substr(0, 4)
//   const com = parseInt(addr[1].substr(4, 1))
//   const harewareAddr = parseInt(addr[1].substr(5, 2))
//   let cAddr = null
//   if (addr[1].length === 9) {
//     cAddr = parseInt(addr[1].substr(7, 2))
//   }
//   return {
//     type,
//     loraAddr,
//     netAddr,
//     com,
//     harewareAddr,
//     cAddr
//   }
// }
module.exports = Device
