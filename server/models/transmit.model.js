/**
 * @author wbb
 * @date 19-12-11
 * @Description: 短信邮件推送记录
*/

// 短信邮件推送记录
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const TransmitSchema = new Schema({
  pushTime: {// 名称
    type: Date,
    index: true
  },
  type: { // 0-短信推送 1-邮件推送
    type: Number
  },
  content: {
    type: String
  },
  creator: {// 所属用户
    type: Schema.Types.ObjectId, ref: 'User',
    autopopulate: { maxDepth: 1 }
  },
  status: {
    type: Boolean
  },
  err: {
    type: String
  }
})

TransmitSchema.plugin(autopopulate)
module.exports = mongoose.model('transmit', TransmitSchema)
