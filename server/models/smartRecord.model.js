const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const Smart = require('./smart.model')

const SmartRecordSchema = new Schema({
  smart: {// 智能ID
    type: Schema.Types.ObjectId, ref: 'Smart',
    autopopulate: { maxDepth: 1, model: Smart }
  },
  emitAt: {// 开始时间
    type: Date
  },
  completeAt: {// 完成时间
    type: Number
  },
  state: { // 执行是否成功
    type: Boolean
  },
  roll: {// 回滚是否成功
    type: Boolean
  },
  log: {//
    type: String
  },
  rollLog: {//
    type: String
  }
})

SmartRecordSchema.plugin(autopopulate)

module.exports = SmartRecordSchema
