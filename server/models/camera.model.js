/**
 * @author lifeng
 * @date 19-8-29
 * @Description: 本地和云摄像头
*/

// TODO 本地摄像头
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const CameraSchema = new Schema({
  name: {// 名称
    type: String
  },
  picture: {// 图片路径
    type: String
  },
  alias: {// 别名
    type: String
  },
  ezvizAccount: {// 萤石账号
    type: Schema.Types.ObjectId, ref: 'EzvizAccount',
    autopopulate: { maxDepth: 1 }
  },
  dis: {// 所属区域
    type: String
  },
  creator: {// creator
    type: Schema.Types.ObjectId, ref: 'User',
    autopopulate: { maxDepth: 1 }
  },
  line: {// 在线
    type: Boolean
  },
  number: {// 序号
    type: String
  },
  local_ip: { // 本地摄像头rtsp地址
    type: String
  },
  local_username: { // 本地摄像头账户名
    type: String
  },
  local_password: { // 本地摄像头密码
    type: String
  },
  control: { // 本地摄像头所属中控
    type: Schema.Types.ObjectId, ref: 'Control'
  }
}, {
  timestamps: true
})

CameraSchema.plugin(autopopulate)
module.exports = mongoose.model('Camera', CameraSchema)
