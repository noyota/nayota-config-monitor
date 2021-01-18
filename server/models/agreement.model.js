const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
// 硬件/lora/Ai协议表
const AgreementSchema = new Schema({

  // 协议类型
  type: { // 0:Ai, 1：设备 2：LORA 3 http协议
    type: Number
  },
  // 协议名字
  name: {
    type: String
  },
  // 协议函数
  hanShu: {
    type: String
  },
  // 协议文档
  doc: {
    type: String
  },
  // 协议编码 网页端
  minJs: {
    type: String
  },
  minNode: { // node端
    type: String
  },
  // 协议版本
  edition: {
    type: String
  },
  // 协议备注
  notes: {
    type: String
  },
  // AI维度
  dimension: {
    type: Number
  }
}, {
  timestamps: true
})
AgreementSchema.plugin(autopopulate)
module.exports = mongoose.model('Agreement', AgreementSchema)
