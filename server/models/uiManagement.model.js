const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const UiManagementSchema = new Schema({
  name: {// 名称
    type: String
  },
  type: { // UI类型 为空时默认为设备UI  0 设备UI 1 控制器UI 2 检测器UI 3 物UI
    type: Number
  },
  templateComponentName: { // 模板组件名称
    type: String,
    unique: 'templateComponentName already exists'
  },
  template: { // 文件路径
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

UiManagementSchema.plugin(autopopulate)
module.exports = mongoose.model('UiManagement', UiManagementSchema)
