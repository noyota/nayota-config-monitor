const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const LoraSlave = require('./loraSlave.model')
/**
 * Checkrecord Schema
 */
var RxLevRecordSchema = new Schema({
  loraSlave: {// 检测
    type: Schema.Types.ObjectId, ref: 'LoraSlave',
    autopopulate: { maxDepth: 1, model: LoraSlave }
  },
  recordTime: { // 记录时间
    type: Date
  },
  value: { // 值
    type: String
  },
  key: { // 功能码
    type: String
  }
})
RxLevRecordSchema.plugin(autopopulate)

module.exports = RxLevRecordSchema
