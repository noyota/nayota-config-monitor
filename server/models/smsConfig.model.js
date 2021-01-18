const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 短信配置
const smsConfigSchema = new Schema({
  type: { // 0 筑望
    type: Number,
    default: 0
  },
  userid: { // 用户id
    type: String
  },
  username: { // 场景
    type: String
  },
  password: { // 联动ID
    type: String
  },
  apiurl: { // 摄像头ID
    type: String
  },
  status: { // 0-云配置 1-本地配置
    type: Number,
    default: 1
  },
  control: {// 关联的设备编号
    type: Schema.Types.ObjectId, ref: 'Control'
  }
})
module.exports = mongoose.model('smsConfig', smsConfigSchema)
