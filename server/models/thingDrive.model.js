const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')

const ThingDriveSchema = new Schema({
  type: { // 类型 0 时间驱动 1 事件驱动 2 数据驱动
    type: Number
  },
  shortAddress: { // 驱动编码, 统一用字段名shortAddress
    type: String
  },
  thingModel: {
    type: Schema.Types.ObjectId
  },
  props: [{
    type: Schema.Types.ObjectId
  }],
  propId: { // 做运算的驱动 会生成一个对应的物的参数,保存下来方便删除的时候对应删除
    type: Schema.Types.ObjectId
  },
  name: { // 名称
    type: String
  },
  interval: { // 时间驱动（时间ms） 默认参数
    type: Number
  },
  intervalType: { // 时间驱动 从0点开始计时还是 服务开启开始计时
    type: Number,
    default: 0
  },
  runType: { // 运行类型 0 串口行为 1 运算行为
    type: Number,
    default: 0
  },
  dataType: { // 数据驱动处理类型
    type: Number,
    default: 0
  },
  actionType: { // 动作类型, 0 继承 原控制器动作 1 自定义动作类型
    type: Number,
    default: 0
  },
  rangeTime: { // 时间
    type: Number
  },
  rangeNumber: { // 个数
    type: Number
  },
  countType: { // 统计类型 0 统计 1 ai
    type: Number
  },
  aiLib: {
    type: Schema.Types.ObjectId, ref: 'Agreement',
    autopopulate: { maxDepth: 1 }
  },
  mapFunc: {// Map函数 聚合 分组函数
    type: String
  },
  reduceFunc: {// Reduce函数 算法函数
    type: String
  },
  aiFunc: {// AI解析函数
    type: String
  },
  hasReport: {// 是否上报动作
    type: Boolean
  },
  actions: [{
    propId: Schema.Types.ObjectId, // 参数ID
    value: Number,
    valueStr: String
  }]
}, {
  timestamps: true
})
ThingDriveSchema.plugin(autopopulate)
module.exports = mongoose.model('ThingDrive', ThingDriveSchema)
