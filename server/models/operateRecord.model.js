const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const Operate = require('./operate.model')
/**
 * Checkrecord Schema
 */
const OperateRecordSchema = new Schema({
  address: { // 数据地址
    type: String,
    index: true
  },
  operate: {// 检测
    type: Schema.Types.ObjectId, ref: 'Operate',
    autopopulate: { maxDepth: 1, model: Operate }
  },
  recordTime: { // 记录时间
    type: Date
  },
  value: { // 值
    type: Number
  },
  valueStr: { // 字符串值
    type: String
  }
})
OperateRecordSchema.plugin(autopopulate)

module.exports = OperateRecordSchema
