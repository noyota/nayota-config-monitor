const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 串口子文档
const AttributeSchema = new Schema({
  key: String,
  value: String,
  note: String // 描述说明
})

module.exports = AttributeSchema
