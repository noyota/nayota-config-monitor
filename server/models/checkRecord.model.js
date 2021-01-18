const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const Check = require('./check.model')
/**
 * Checkrecord Schema
 */
var CheckRecordSchema = new Schema({
  address: { // 数据地址
    type: String,
    index: true
  },
  check: {// 检测
    type: Schema.Types.ObjectId, ref: 'Check',
    autopopulate: { maxDepth: 1, model: Check }
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
CheckRecordSchema.plugin(autopopulate)

module.exports = CheckRecordSchema
