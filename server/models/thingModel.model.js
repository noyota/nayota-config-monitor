const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PropSchema = require('./thingSubDoc.model')
const autopopulate = require('mongoose-autopopulate')

const ThingModelSchema = new Schema({
  name: { // 名称
    type: String
  },
  type: { // 物模型类型
    type: Number
  },
  uiModel: {
    type: Schema.Types.ObjectId, ref: 'UiModel'
  },
  props: [PropSchema]
}, {
  timestamps: true
})
ThingModelSchema.plugin(autopopulate)
module.exports = mongoose.model('ThingModel', ThingModelSchema)
