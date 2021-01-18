const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const PackageSchema = new Schema({
  name: { // 套餐名称
    type: String
  },
  year: { // 套餐时长
    type: Number
  },
  activeTime: { // 开始时间
    type: Date
  },
  exceedTime: { // 结束时间
    type: Date
  },
  price: { // 单价
    type: Number
  },
  number: { // 节点数
    type: Number
  },
  status: { // 状态
    type: Boolean
  },
  cloudType: {
    type: Boolean
  },
  hardwareWord: [{// 检测数据
    type: Schema.Types.ObjectId, ref: 'HardwareWord',
    autopopulate: { maxDepth: 1 }
  }]
}, {
  timestamps: true
})

PackageSchema.plugin(autopopulate)
mongoose.model('Package', PackageSchema)
module.exports = PackageSchema
