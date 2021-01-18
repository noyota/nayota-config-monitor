const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const Thing = require('./thing.model')
/**
 * ThingRecord Schema
 */
const ThingRecordSchema = new Schema({
  thing: {// 物
    type: Schema.Types.ObjectId, ref: 'Thing',
    autopopulate: { maxDepth: 1, model: Thing }
  },
  propId: { // 参数ID
    type: Schema.Types.ObjectId
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

ThingRecordSchema.plugin(autopopulate)

module.exports = ThingRecordSchema
