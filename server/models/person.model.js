/**
 * @author lifeng
 * @date 19-12-3
 * @Description: 人员信息表 用于摄像头 人员信息录入
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Personchema = new Schema({
  creator: { // 所属用户
    type: Schema.Types.ObjectId, ref: 'User'
  },
  name: {
    type: String
  },
  code: { // 唯一编码
    type: String
  },
  pic: { // base64编码的头像图片
    type: String
  }
}, {
  timestamps: true
})

const Model = mongoose.model('Person', Personchema)
module.exports = Model
