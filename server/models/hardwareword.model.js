const mongoose = require('mongoose')
const Schema = mongoose.Schema
const serialDataSchema = require('./serialData.model')
const loraDataSchema = require('./loraData.model')
const detConSchema = require('./detcon.model')
const AttributeSchema = require('./attribute.model')
const autopopulate = require('mongoose-autopopulate')
// 设备/LORA字典
const HardWareWordSchema = new Schema({
  name: {// 名称
    type: String
  },
  type: {// 类型  0 设备 1 Lora节点 2 http设备
    type: Number
  },
  status: {// TODO 新增 类型  0 轮训 1 监听 2 其它
    type: Number,
    default: 0
  },
  image: { // 设备演示图
    type: String
  },
  img_example1: { // 例1
    type: String
  },
  img_example2: { // 例2
    type: String
  },
  code: {// 型号
    type: String
  },
  // 接线说明
  doc: {
    type: String
  },
  serialData: {// 串口配置
    type: serialDataSchema
  },
  loraData: {// LORA配置
    type: loraDataSchema
  },
  uiTemplate: {// 控制ui模板
    type: Schema.Types.ObjectId, ref: 'UiManagement',
    autopopulate: { maxDepth: 1 }
  },
  attribute: [ // 属性键值对
    AttributeSchema
  ],
  agreement: {// 调用协议
    type: Schema.Types.ObjectId, ref: 'Agreement',
    autopopulate: { maxDepth: 1 }
  },
  defaultCheck: [// 监测子文档
    detConSchema
  ],
  defaultOperate: [// 控制子文档
    detConSchema
  ]
}, {
  timestamps: true
})
HardWareWordSchema.plugin(autopopulate)
module.exports = mongoose.model('HardwareWord', HardWareWordSchema)
