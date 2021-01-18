const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')

const DisplayAreaClassSchema = new Schema({
  name: {// 区域名称
    type: String
  },
  sort: {// 排序
    type: Number
  },
  remark: {// 备注
    type: String
  },
  displayArea: [{// 区域
    type: Schema.Types.ObjectId, ref: 'DisplayArea',
    autopopulate: { maxDepth: 2 }
  }],
  isCloud: {// 是否是云配置
    type: Boolean,
    default: false
  },
  creator: {// 所属用户
    type: Schema.Types.ObjectId, ref: 'User',
    autopopulate: { maxDepth: 1 }
  },
  isHomepage: {// 是否主页
    type: Boolean
  },
  control: { // 本地区域类别所属网关
    type: Schema.Types.ObjectId, ref: 'Control',
    autopopulate: { maxDepth: 1 }
  }
}, {
  timestamps: true
})

DisplayAreaClassSchema.plugin(autopopulate)
module.exports = mongoose.model('DisplayAreaClass', DisplayAreaClassSchema)
