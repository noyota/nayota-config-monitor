const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const serialDataSchema = require('./serialData.model')
const packageSchema = require('./package.model')
const IncAddress = require('./incAddress.model')
const { hexStrAdd } = require('../utils/transformation')

const ControlSchema = new Schema({
  name: { // 中控名称
    type: String
  },
  number: { // 中控编号
    type: String
  },
  phone: { // SIM卡号
    type: String
  },

  icCid: { // icCid
    type: String
  },
  simType: { // 运营商
    type: Number
  },
  line: { // 在线状态
    type: Boolean
  },
  onlineTime: { // 上线时间戳
    type: Number,
    default: Date.now()
  },
  ip_address: { // ip地址
    type: String
  },
  login_time: { // 登录时间
    type: String
  },
  lastSend: { // 设备离线时间戳（上次发信时间）
    type: Number
  },
  serialData: [// 串口配置
    serialDataSchema
  ],
  packageData: {// 套餐子文档
    type: packageSchema
  },
  sdk: {
    type: String
  },
  env: { // 当前模式（开发，生产，调试）
    type: String
  },
  status: { // 激活状态0-待激活 1-已激活 2-已绑定账号
    type: Number,
    defalut: 2
  },
  clientId: { // MQTT 客户端ID
    type: String
  },
  // mqttClients: [{
  //   type: Schema.Types.ObjectId, ref: 'MqttClient',
  //   autopopulate: { maxDepth: 1 }
  // }],
  version: { // 系统版本号
    type: String
  },
  controlModel: {// 设备类型(设备字典)
    type: Schema.Types.ObjectId, ref: 'ControlWord'
  },
  creator: {// 所属用户
    type: Schema.Types.ObjectId, ref: 'User',
    autopopulate: { maxDepth: 1 }
  },
  driveDownAt: {// 中控信息下发时间
    type: Date
  }
}, {
  timestamps: true
})
// 生成自增number
ControlSchema.pre('save', async function() {
  if (this.number == null || this.number === '') {
    const incAddress = await IncAddress.findOne({ model_name: 'Control' })
    if (incAddress) {
      if (incAddress.address) {
        this.number = incAddress.address
        incAddress.remove()
        return
      } else {
        incAddress.remove()
      }
    }
    const preModel = await Model.find().sort({ number: -1 }).limit(1)
    if (preModel.length === 1) {
      this.number = hexStrAdd(preModel[0].number)
    } else {
      this.number = '0001'
    }
  }
})

ControlSchema.plugin(autopopulate)
const Model = mongoose.model('Control', ControlSchema)

module.exports = Model
