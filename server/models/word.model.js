const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')

const WordSchema = new Schema({
  name: { // 名称
    type: String
  },
  wordType: {// 字典类型
    type: Schema.Types.ObjectId, ref: 'WordType',
    autopopulate: { maxDepth: 1 }
  },
  sort: { // 排序
    type: String
  },
  flag: { // 状态
    type: Boolean
  },
  remark: { // 备注
    type: String
  },
  key: { // 键
    type: String
  },
  value: { // 值
    type: String
  }
}, {
  timestamps: true
})
WordSchema.plugin(autopopulate)
module.exports = mongoose.model('Word', WordSchema)
