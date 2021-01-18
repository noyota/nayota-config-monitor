/**
 * @author lifeng
 * @date 19-12-3
 * @Description: http设备
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AttributeSchema = require('./attribute.model')
const autopopulate = require('mongoose-autopopulate')

const HttpDriveSchema = new Schema({
  creator: {// 所属用户
    type: Schema.Types.ObjectId, ref: 'User'
  },
  control: {
    type: Schema.Types.ObjectId, ref: 'Control'
  },
  status: { // 状态（配置1，正常0）
    type: Number,
    default: 0
  },
  attribute: [AttributeSchema],
  scanCode: { // 二维码编号
    type: String
  },
  name: { // 名称
    type: String
  },
  shortAddress: { // 短地址/编码
    type: String
  },
  line: { // 在线状态
    type: Boolean,
    default: false
  },
  hardwareWord: {// 设备字典 设备型号
    type: Schema.Types.ObjectId, ref: 'HardwareWord',
    autopopulate: { maxDepth: 1 }
  }
}, {
  timestamps: true
})

HttpDriveSchema.plugin(autopopulate)

const Model = mongoose.model('HttpDrive', HttpDriveSchema)
module.exports = Model
