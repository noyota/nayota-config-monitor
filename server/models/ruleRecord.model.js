const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const RuleRecordSchema = new Schema({
  creator: {// 所属用户
    type: Schema.Types.ObjectId, ref: 'User'
  },
  checks: [{// 摄像头id
    type: Schema.Types.ObjectId, ref: 'Check',
    autopopulate: { maxDepth: 1 }
  }],
  name: {// 名称
    type: String
  },
  time: {// 间隔时间
    type: Number
  },
  day: { // 保留时间
    type: Number
  },
  rules: {
    type: Array
  }
}, {
  timestamps: true
})
RuleRecordSchema.plugin(autopopulate)
module.exports = mongoose.model('RuleRecord', RuleRecordSchema)
