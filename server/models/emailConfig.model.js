const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 邮件配置
const emailConfigSchema = new Schema({
  host: { // 邮件服务器
    type: String
  },
  port: { // 端口
    type: String
  },
  username: { // 邮箱
    type: String
  },
  password: { // 密码
    type: String
  },
  secure: { // 开启保护
    type: Boolean
  },
  type: { // 类型
    type: String
  }
})
module.exports = mongoose.model('emailConfig', emailConfigSchema)
