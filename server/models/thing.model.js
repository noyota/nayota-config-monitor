const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PropSchema = require('./thingSubDoc.model')
const autopopulate = require('mongoose-autopopulate')

const ThingSchema = new Schema({
  name: {// 名称
    type: String
  },
  creator: {// 所属用户
    type: Schema.Types.ObjectId, ref: 'User',
    autopopulate: { maxDepth: 1 }
  },
  control: {// 所属中控
    type: Schema.Types.ObjectId, ref: 'Control',
    autopopulate: { maxDepth: 1 }
  },
  thingModel: {// 使用物模型
    type: Schema.Types.ObjectId, ref: 'ThingModel',
    autopopulate: { maxDepth: 1 }
  },
  uiModel: { // 使用UI
    type: Schema.Types.ObjectId, ref: 'UiModel',
    autopopulate: { maxDepth: 1 }
  },
  props: [PropSchema],
  actions: { // 动作
    type: Array
  },
  aiModels: {// AiModel模型
    type: Array
  }
}, {
  timestamps: true
})
ThingSchema.plugin(autopopulate)
module.exports = mongoose.model('Thing', ThingSchema)
