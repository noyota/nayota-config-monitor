/**
 * @author lifeng
 * @date 19-7-2
 * @Description:
 * 中控数据历史行为同步
 * Synchronization of Historical Behavior of Control Data
 * 相对于中控的历史数据完全型同步业务
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')

const ShbOfControlSchema = new Schema({
  model: {
    type: String,
    required: true
  }, // 操作哪个model
  modelId: { // 为了使用自动填充 将ID用另一个字段再保存字符串
    type: String,
    required: true
  },
  modelBody: {
    type: Schema.Types.ObjectId,
    autopopulate: { maxDepth: 1 },
    refPath: 'model'
  },
  commitTime: Number, // 操作执行时间戳
  control: { // 中控
    type: Schema.Types.ObjectId, ref: 'Control'
  },
  behavior: { // 行为
    type: String // 增 create 删 delete 改 update
  },
  body: { // 操作之前的数据（如果有的话）便于回溯 -删除必有，新增必没有
    type: Schema.Types.Mixed
  },
  clientId: { // 来自于那个终端的修改
    type: String
  },
  covered: { // 此条记录是否被覆盖
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

ShbOfControlSchema.plugin(autopopulate)
module.exports = mongoose.model('ShbOfControl', ShbOfControlSchema)
