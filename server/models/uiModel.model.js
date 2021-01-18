/**
 * @author lifeng
 * @date 19-11-18
 * @Description: 新UI模板
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UiModelSchema = new Schema({
  name: {// 名称
    type: String
  },
  type: { // UI类型 为空时默认为设备UI  0 设备UI 1 控制器UI 2 检测器UI 3 物UI
    type: Number
  },
  code: { // 模板编码名
    type: String,
    unique: 'code already exists'
  },
  image: { // 文件路径
    type: String
  },
  json: {
    type: String
  },
  js: {
    type: String
  },
  width: {
    type: String
  },
  pcScale: {
    type: Number
  },
  phScale: {
    type: Number
  },
  height: {
    type: String
  },
  // 版本
  edition: {
    type: String
  },
  // 备注
  notes: {
    type: String
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('UiModel', UiModelSchema)
