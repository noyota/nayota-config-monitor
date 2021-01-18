const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
// 条件子文档(term)
const TermSchema = new Schema({
  type: {// 类型  检测设备c 时间t 控制设备o 物 w
    type: String
  },
  check: {// 数据
    type: Schema.Types.ObjectId, ref: 'Check',
    autopopulate: { maxDepth: 1 }
  },
  operate: {// 控制设备ID
    type: Schema.Types.ObjectId, ref: 'Operate',
    autopopulate: { maxDepth: 1 }
  },
  thing: { // 物
    type: Schema.Types.ObjectId, ref: 'Thing'
  },
  propId: { // 物中的参数
    type: Schema.Types.ObjectId
  },
  termType: {// 条件类型 和0  或 1 平均 2 默认和
    type: Number,
    default: 0
  },
  value: {//  value 值
    type: Number
  },
  min: { // 区间
    type: Number
  },
  max: { // 区间
    type: Number
  },
  valueStr: { // 字符串值
    type: String
  },
  timeRange: [{ // 时间范围
    type: Date
  }],
  condition: {//  条件  (值)大于1 小于2 等于0 (in,out - 区间)
    type: Number
  },
  interval: Schema.Types.Mixed, // 区间辅助选择
  tTypeValue: {// 用于存放级联的数组
    type: Array
  }
})
TermSchema.plugin(autopopulate)
module.exports = TermSchema

