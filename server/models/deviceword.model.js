const mongoose = require('mongoose')
const Schema = mongoose.Schema
const serialDataSchema = require('./serialData.model')
const loraDataSchema = require('./loraData.model')
const AttributeSchema = require('./attribute.model')
const autopopulate = require('mongoose-autopopulate')
// 设备/LORA字典
const DeviceWordSchema = new Schema({
  name: {// 名称
    type: String
  },
  type: {// 类型  0 设备 1 Lora节点 2 http设备
    type: Number
  },
  code: {// 型号
    type: String
  },
  addressLength: {
    type: Number
  },
  serialData: {// 串口配置
    type: serialDataSchema
  },
  loraData: {// LORA配置
    type: loraDataSchema
  },
  hardwareWord: {
    type: Schema.Types.ObjectId, ref: 'HardwareWord',
    autopopulate: { maxDepth: 1 }
  },
  attribute: [ // 属性键值对
    AttributeSchema
  ]
}, {
  timestamps: true
})
DeviceWordSchema.plugin(autopopulate)
module.exports = mongoose.model('DeviceWord', DeviceWordSchema)
