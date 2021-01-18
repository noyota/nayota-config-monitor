const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const packageSchema = require('./package.model')
const OrderDataSchema = new Schema({
  sdk: { // 套餐编号
    type: String
  },
  user: {
    type: Schema.Types.ObjectId, ref: 'User',
    autopopulate: { maxDepth: 1 }
  },
  status: { // 使用状态 0-未使用 1--已使用
    type: Number
  },
  controlModel: {// 设备类型(设备字典)
    type: Schema.Types.ObjectId, ref: 'ControlWord',
    autopopulate: { maxDepth: 1 }
  },
  userTime: {
    type: Date
  },
  packageData: {// 套餐子文档
    type: packageSchema
  }
}, {
  timestamps: true
})

OrderDataSchema.plugin(autopopulate)
const model = mongoose.model('OrderData', OrderDataSchema)
module.exports = model
