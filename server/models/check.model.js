const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')

const CheckSchema = new Schema({
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
    enum: ['Hardware', 'LoraSlave', 'HttpDrive']
  },
  line: { // 在线
    type: Boolean,
    default: false
  },
  address: { // 地址
    type: String
  },
  shortAddress: { // 短地址
    type: String
  },
  value: { // 最后值
    type: String,
    default: null
  },
  valueStr: { // 值的字符串意思， 根据区间确定或直接上传的是字符串
    type: String,
    default: null
  },
  type: { // 状态（lora通讯、485通讯）
    type: Number
  },
  valueAt: { // 最后值时间
    type: Date
  },
  precision: {// 精度 判断值上报最小条件
    type: Number
  },
  company: {// 单位
    type: String
  },
  icon: {// 图标
    type: String
  },
  interval: {//   区间 意 值 对应
    type: String// Array
  },
  boardConfigStr: {// 看板样式配置String
    type: String
  },
  remark: {// 备注
    type: String
  },
  canRead: { // 是否可主动读取
    type: Boolean
  },
  sort: {// 排序
    type: Number
  }
}, {
  timestamps: true
})
CheckSchema.plugin(autopopulate)
module.exports = mongoose.model('Check', CheckSchema)
