const loraMasterCtrl = require('../controllers/loraMaster.controller')
const schedule = require('node-schedule')
const MasterApi = require('../middleware/com/MasterApi')
const serialPorts = require('../middleware/serialport/serialports')
const serialMaps = require('../middleware/serialport/index')
const log4js = require('log4js')
const logger_4js = log4js.getLogger('success')
let job
class ScanJob {
  async load(message) {
    const { loraMasterId } = message
    this.st = 0
    if (loraMasterId) {
      this.loraMaster = await loraMasterCtrl.getById(loraMasterId, null, { autopopulate: false })
      message.comName = message.comName || this.loraMaster.serialData.comName
      if (!serialMaps.serialPorts.get(message.comName)) {
        await serialPorts.init(this.loraMaster) // 初始串口
      }
      this.serialport = serialMaps.serialPorts.get(message.comName)
      this.masterApi = new MasterApi(this.serialport, this.loraMaster || {})
      if (this.loraMaster.useType === 1) {
        this.lora = this.loraMaster.loraData
        this.loras = []
        for (var i = 0; i < 20; i++) {
          let frequency = parseInt(this.lora.frequency, 16) + i * 100000
          let bandwidth = parseInt(this.lora.bandwidth, 16)
          for (bandwidth; bandwidth < 10; bandwidth = bandwidth + 1) {
            let factor = parseInt(this.lora.bandwidth, 16)
            for (factor; factor < 13; factor = factor + 1) {
              frequency = frequency.toString(16)
              while (frequency.length < 8) {
                frequency = '0' + frequency
              }
              let bw = bandwidth.toString(16)
              while (bw.length < 2) {
                bw = '0' + bw
              }
              let fac = factor.toString(16)
              while (fac.length < 2) {
                fac = '0' + fac
              }
              const lora = { frequency: frequency, bandwidth: bw, factor: fac, codingrate: '01' }
              this.loras.push(lora)
            }
          }
        }
        await this.cancelscanTimeJob()
        this.scanTimeJob()
      } else {
        await this.cancelscanTimeJob()
      }
    }
  }

  async scanTimeJob() {
    job = schedule.scheduleJob('0 */2 * * * *', () => {
      const lora = this.loras[this.st]
      this.writeConfig(lora)
      this.st = this.st + 1
      if (this.st > this.loras.length) {
        this.st = 0
      }
    })
  }

  async writeConfig(lora) {
    console.log('writeConfig开始')
    // 主站进入配置模式
    await this.masterApi.inConfig()
    await this.masterApi.writeConfig(lora.factor, lora.bandwidth, lora.codingrate, lora.frequency)
    this.Log4JSInfo(lora)
    await this.masterApi.outConfig()
  }
  getDate() {
    const now = new Date()
    const Y = now.getFullYear() + '/'
    const M = (now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + '/'
    const D = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
    return Y + M + D
  }
  async cancelscanTimeJob() {
    if (job) job.cancel()
    return true
  }
  Log4JSInfo(lora) {
    const N = this.getDate()
    if (this.yearMonthDate !== N) {
      this.yearMonthDate = N
      log4js.configure({
        appenders: { success: { type: 'file', filename: 'assets/log/' + this.yearMonthDate + '.log' }},
        categories: { default: { appenders: ['success'], level: 'info' }}
      })
    }
    const json = {
      '频段': (parseInt(lora.frequency, 16) / 1000000) + 'MHz',
      '带宽': lora.bandwidth,
      '编码率': lora.codingrate,
      '扩频': lora.factor
    }
    logger_4js.info(JSON.stringify(json))
  }
}
module.exports = ScanJob
