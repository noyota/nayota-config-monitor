const config = require('./config')
const mongoose = require('mongoose')
const LoraMaster = mongoose.model('LoraMaster')

// 控制器
const serialPorts = require('../middleware/serialport/serialports')

// 串口任务
const ScanJob = require('../apis/scanJob')
// const jobSave = require('../apis/jobSave')
let loraMaster = null

async function loraMasterInit() {
  // 查询 是否存在正在使用状态的主站
  loraMaster = await LoraMaster.findOne({ status: true })
  if (loraMaster) { // 如果有用户启动mqtt服务
    // TODO 如有原任务，停止原jobs
    await serialPorts.init(loraMaster) // 初始串口
    if (loraMaster.useType === 1) {
      config.scanJob = new ScanJob()
      config.scanJob.load({ loraMasterId: loraMaster._id, force: false }, '1')
    }
    // jobService.startJob(loraMaster)
    // if (control.clientId === config.clientId) {
    //   jobService.startJob(control)
    // }
  }
}
module.exports = {
  loraMasterInit
}
