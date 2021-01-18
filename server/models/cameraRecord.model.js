const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const Camera = require('./camera.model')

const CameraRecordSchema = new Schema({
  camera: {// 检测
    type: Schema.Types.ObjectId, ref: 'Camera',
    autopopulate: { maxDepth: 1, model: Camera }
  },
  recordTime: { // 记录时间
    type: Date
  },
  path: { // 视频地址
    type: String
  },
  duration: { // 视频时长
    type: Number
  },
  image: { // 截图地址
    type: String
  }
})
CameraRecordSchema.plugin(autopopulate)

module.exports = CameraRecordSchema
