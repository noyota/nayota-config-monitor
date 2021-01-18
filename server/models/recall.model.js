/**
 * @author lifeng
 * @date 19-8-30
 * @Description: 记录回溯系统  一条线上触发的所有事件的记录,都将回溯
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')

const RecallSchema = new Schema({
  modelBody: {// 检测
    type: Schema.Types.ObjectId, refPath: 'onModel',
    index: true,
    autopopulate: { maxDepth: 2 }
  },
  onModel: { // model名称
    type: String,
    required: true,
    enum: ['CameraRecord', 'SceneRecord', 'SmartRecord', 'CheckRecord', 'OperateRecord', 'PushRecord', 'ThingRecord']
  },
  code: { // 编码
    type: String,
    index: true
  },
  recordTime: {
    type: Date,
    index: true
  }
})
RecallSchema.plugin(autopopulate)

module.exports = RecallSchema
