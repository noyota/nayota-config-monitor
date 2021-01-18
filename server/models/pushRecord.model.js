/**
 * @author lifeng
 * @date 19-8-29
 * @Description: 推送记录
*/

// TODO 本地摄像头
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const PushRecordSchema = new Schema({
  pushTime: {// 名称
    type: Date,
    index: true
  },
  type: { // 0-APP推送 1-短信推送 2-微信推送 3-邮件推送
    type: Number
  },
  content: {
    type: String
  },
  status: { // 状态
    type: Boolean,
    default: false
  },
  pushStatus: { // 推送状态
    type: Boolean,
    default: false
  }
})

PushRecordSchema.plugin(autopopulate)
module.exports = PushRecordSchema
