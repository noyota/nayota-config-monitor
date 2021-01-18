const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const ActionSchema = require('./action.model')
const ExecutetimeSchema = require('./executetime.model')
const SceneSchema = new Schema({
  type: { // 0 本地场景 1 云场景
    type: Number
  },
  name: {// 名称
    type: String
  },
  sort: {// 排序
    type: Number
  },
  actions: [// 动作
    ActionSchema
  ],
  executeTime: [// 时间
    ExecutetimeSchema
  ],
  creator: {// 所属用户
    type: Schema.Types.ObjectId, ref: 'User',
    autoPopulate: { maxDepth: 1 }
  },
  loopV: {// 循环状态 0 未循环执行 1 循环执行
    type: Number
  },
  loopTime: {// 循环时间间隔 毫秒
    type: Number
  },
  sceneDis: {// 关联场景类型
    type: String
  },
  dis: {// 关联区域
    type: String
  },
  state: {// 状态  0  停用 1 启用  定时所用
    type: Number
  },
  control: {// 关联的设备编号 本地场景
    type: Schema.Types.ObjectId, ref: 'Control'
  },
  isRun: {// 是否运行 正在执行中的场景不要重复执行
    type: Boolean
  },
  doneAc: {// 当前已执行的动作
    type: Array
  }
}, {
  timestamps: true
})

SceneSchema.plugin(autopopulate)
module.exports = mongoose.model('Scene', SceneSchema)
