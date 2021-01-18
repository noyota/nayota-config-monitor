const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const WordTypeSchema = new Schema({
  name: { // 主站名称
    type: String
  },
  sort: { // 排序
    type: Number
  },
  flag: { // 状态
    type: Boolean
  },
  remark: { // 备注
    type: String
  },
  level: {
    type: Number
  },
  children: [{
    type: Schema.Types.ObjectId, ref: 'WordType',
    autopopulate: { maxDepth: 3, sort: { 'sort': 1 }}
  }]
}, {
  timestamps: true
})
WordTypeSchema.plugin(autopopulate)
module.exports = mongoose.model('WordType', WordTypeSchema)
