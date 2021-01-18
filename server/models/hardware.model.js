const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const serialDataSchema = require('./serialData.model')
const AttributeSchema = require('./attribute.model')

const HardwareSchema = new Schema({
  creator: {// 所属用户
    type: Schema.Types.ObjectId, ref: 'User',
    autopopulate: { maxDepth: 1 }
  },
  serialData: {// 串口配置
    type: serialDataSchema
  },
  name: { // 名称
    type: String
  },
  address: { // 设备地址
    type: String
  },
  shortAddress: { // 短地址
    type: String
  },
  control: {// 所属中控
    type: Schema.Types.ObjectId, ref: 'Control',
    autopopulate: { maxDepth: 1 }
  },
  loraSlave: {// 所属从站
    type: Schema.Types.ObjectId, ref: 'LoraSlave'
  },
  line: { // 在线
    type: Boolean
  },
  isShow: { // 展示状态
    type: Boolean
  },
  sort: { // 排序
    type: Number
  },
  scanCode: { // 最后值
    type: String
  },
  type: { // 类型（0，有线；1，lora）
    type: Number
  },
  attribute: [ // 属性键值对
    AttributeSchema
  ],
  status: { // 状态
    type: Number
  },
  hardwareWord: {// 设备字典表
    type: Schema.Types.ObjectId, ref: 'HardwareWord',
    autopopulate: { maxDepth: 2 }
  }
}, {
  timestamps: true
})

HardwareSchema.plugin(autopopulate)
const Model = mongoose.model('Hardware', HardwareSchema)

module.exports = Model
