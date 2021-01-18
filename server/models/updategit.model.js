const mongoose = require('mongoose')
const Schema = mongoose.Schema
/**
 * 系统更新历史记录表
 */
var UpdateGitSchema = new Schema({
  ref: { // 版本号
    type: String
  },
  pushed_at: { // 推送时间
    type: Date
  },
  clone_url: { // 仓库clone地址
    type: String
  },
  name: { // 仓库名
    type: String
  },
  used: { // 当前使用版本
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('UpdateGit', UpdateGitSchema)
