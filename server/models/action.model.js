const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
// 动作子文档(action)
const ActionSchema = new Schema({
  type: { // 类型 控制器 o   场景 s  联动 j  报警 p  物 w 摄像头录制 r
    type: String
  },
  operate: { // 控制数据
    type: Schema.Types.ObjectId, ref: 'Operate',
    autopopulate: { maxDepth: 1 }
  },
  scene: { // 场景
    type: Schema.Types.ObjectId, ref: 'Scene',
    autopopulate: { maxDepth: 1 }
  },
  smart: { // 联动ID
    type: Schema.Types.ObjectId, ref: 'Smart',
    autopopulate: { maxDepth: 1 }
  },
  camera: { // 摄像头ID
    type: Schema.Types.ObjectId, ref: 'Camera',
    autopopulate: { maxDepth: 1 }
  },
  thing: { // 物
    type: Schema.Types.ObjectId, ref: 'Thing'
  },
  propId: { // 物中的参数
    type: Schema.Types.ObjectId
  },
  performTime: { // 延时执行时间 毫秒
    type: Number
  },
  performType: { // 执行值
    type: Number
  },
  performContent: { // 执行内容
    type: String
  },
  state: { // 状态  0 普通自定义 1 精品模板复制
    type: Number
  },
  interval: Schema.Types.Mixed, // 可选的值
  aTypeValue: { // 用于存放级联的数组
    type: Array
  }
})
ActionSchema.plugin(autopopulate)
module.exports = ActionSchema
