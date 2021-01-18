const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PictureRecordSchema = new Schema({
  creator: {// 所属用户
    type: Schema.Types.ObjectId, ref: 'User'
  },
  cameraId: {// 摄像头id
    type: Schema.Types.ObjectId, ref: 'Camera'
  },
  ezViz: {// 萤石账号
    type: String
  },
  picturePath: {// 图片路径
    type: String
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('PictureRecord', PictureRecordSchema)
