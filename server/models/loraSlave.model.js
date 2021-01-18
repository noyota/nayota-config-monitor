/**
 * @author lifeng
 * @date 19-8-2
 * @Description: 从站信息 一个从站最多可以对接两个主站(新特性)
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const loraDataSchema = require('./loraData.model')
const IncAddress = require('./incAddress.model')
const AttributeSchema = require('./attribute.model')
const { hexStrAdd } = require('../utils/transformation')
const autopopulate = require('mongoose-autopopulate')

const LoraSlaveSchema = new Schema({
  creator: {// 所属用户
    type: Schema.Types.ObjectId, ref: 'User'
  },
  control: {
    type: Schema.Types.ObjectId, ref: 'Control'
  },
  loraMaster: {// 所属主站 主主站 下发指令永远为此主站下发
    type: Schema.Types.ObjectId, ref: 'LoraMaster',
    autopopulate: { maxDepth: 1 }
  },
  secondMaster: { // 次主站 上报主站
    type: Schema.Types.ObjectId, ref: 'LoraMaster',
    autopopulate: { maxDepth: 1 }
  },
  loraData: { // lora配置信息
    type: loraDataSchema
  },
  secondLoraData: { // 上报窗口的配置信息
    type: loraDataSchema
  },
  status: { // 状态（配置1，正常0）
    type: Number,
    default: 1
  },
  type: String, // 从站型号 16进制字符串  01 485
  model: Number, // 从站模式 0 收发从站 1 上报从站 2 双主从站
  attribute: [AttributeSchema],
  scanCode: { // 二维码编号
    type: String
  },
  name: { // 名称
    type: String
  },
  address: { // rola从地址
    type: String
  },
  shortAddress: { // 短地址
    type: String
  },
  line: { // 在线状态
    type: Boolean
  },
  agreement: {// 协议 协议型号
    type: Schema.Types.ObjectId, ref: 'Agreement',
    autopopulate: { maxDepth: 1 }
  },
  hardwareWord: {// 设备字典 设备型号
    type: Schema.Types.ObjectId, ref: 'HardwareWord',
    autopopulate: { maxDepth: 1 }
  },
  rxLev: { // 信号强度
    type: String
  }
}, {
  timestamps: true
})

LoraSlaveSchema.pre('save', async function() {
  if (this.shortAddress == null) {
    const incAddress = await IncAddress.findOne({ model_name: 'LoraSlave', superId: this.control })
    if (incAddress) {
      this.shortAddress = incAddress.address
      incAddress.remove()
      return
    }
    const preModel = await Model.find({ control: this.control }).sort({ shortAddress: -1 }).limit(1)
    if (preModel.length === 1 && preModel[0].shortAddress) {
      this.shortAddress = hexStrAdd(preModel[0].shortAddress)
    } else {
      this.shortAddress = '0001'
    }
  }
})

LoraSlaveSchema.plugin(autopopulate)

const Model = mongoose.model('LoraSlave', LoraSlaveSchema)
module.exports = Model
