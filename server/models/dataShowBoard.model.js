const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')

const DataShowBoardSchema = new Schema({
  name: {// 名称
    type: String
  },
  templateCode: {// 展板代码
    type: String
  },
  remarks: {// 备注
    type: String
  },
  creator: {// 所属用户
    type: Schema.Types.ObjectId, ref: 'User',
    autopopulate: { maxDepth: 1 }
  }
}, {
  timestamps: true
})

DataShowBoardSchema.plugin(autopopulate)
module.exports = mongoose.model('DataShowBoard', DataShowBoardSchema)
