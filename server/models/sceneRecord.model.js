const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const Scene = require('./scene.model')

const SceneRecordSchema = new Schema({
  scene: {// 场景
    type: Schema.Types.ObjectId, ref: 'Scene',
    autopopulate: { maxDepth: 1, model: Scene }
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

SceneRecordSchema.plugin(autopopulate)
module.exports = SceneRecordSchema
