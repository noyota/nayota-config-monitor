const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EzvizAccountSchema = new Schema({
  account: {// 账号
    type: String
  },
  password: {// 密码
    type: String
  },
  appKey: {// 密钥
    type: String
  },
  secret: {// 机密
    type: String
  },
  access_token: {// 访问命令
    type: String
  },
  expireTime: {// 获取时间
    type: Number
  },
  strName: {// 名称备注
    type: String
  },
  status: {// 状态
    type: Boolean
  },
  creator: {// creator
    type: Schema.Types.ObjectId, ref: 'User',
    autopopulate: { maxDepth: 1 }
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('EzvizAccount', EzvizAccountSchema)
