const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
// AI模型名称
const AimodelSchema = new Schema({

  // AI模型名称
  name: {
    type: String
    // unique: true
  },
  // AI库配置
  library: { // type: String
    type: Object// Schema.Types.ObjectId, ref: 'AiSetting'

  },
  // 地址
  address: {
    type: String
  },
  // 主机
  control: {
    type: Schema.Types.ObjectId, ref: 'Control'

  },
  // 路径
  url: {
    type: String
  },
  // 本地路径
  localUrl: {
    type: Schema.Types.ObjectId, ref: 'Upload',
    autopopulate: { maxDepth: 1 }
  }

}, {
  timestamps: true
})
AimodelSchema.plugin(autopopulate)
module.exports = mongoose.model('Aimodel', AimodelSchema)
