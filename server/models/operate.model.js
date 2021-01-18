const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')

const OperateSchema = new Schema({
  name: { // 名称
    type: String
  },
  creator: {// 所属用户
    type: Schema.Types.ObjectId, ref: 'User',
    autopopulate: { maxDepth: 1 }
  },
  control: {
    type: Schema.Types.ObjectId, ref: 'Control'
  },
  hardware: {// 所属设备
    type: Schema.Types.ObjectId, ref: 'Hardware',
    autopopulate: { maxDepth: 2 }
  },
  loraSlave: {// 所属lora
    type: Schema.Types.ObjectId, ref: 'LoraSlave',
    autopopulate: { maxDepth: 1 }
  },
  parent: {
    type: Schema.Types.ObjectId, refPath: 'parentName',
    autopopulate: { maxDepth: 1 }
  },
  parentName: {
    type: String,
    // required: true,
    enum: ['Hardware', 'LoraSlave', 'HttpDrive']
  },
  line: { // 在线
    type: Boolean,
    default: false
  },
  address: { // 地址
    type: String
  },
  icon: {// 图标
    type: String
  },
  shortAddress: { // 短地址
    type: String
  },
  value: { // 最后状态 lastStatus
    type: Number,
    default: null
  },
  valueStr: {
    type: String,
    default: null
  },
  type: { // 状态（lora通讯、485通讯）
    type: Number
  },
  valueAt: { // 最后值时间
    type: Date
  },
  interval: {
    type: String// Array
  },
  canRead: { // 是否可主动读取
    type: Boolean
  },
  uiTemplate: {// 控制ui模板
    type: Schema.Types.ObjectId, ref: 'UiManagement',
    autopopulate: { maxDepth: 1 }
  },
  sort: {// 排序
    type: Number
  }
}, {
  timestamps: true
})
OperateSchema.plugin(autopopulate)
module.exports = mongoose.model('Operate', OperateSchema)
