/**
 * @author lifeng
 * @date 19-8-13
 * @Description: 多个中控的混合智能将在服务器做判定,单中控智能在中控上做判定,实现边缘功能
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
const ActionSchema = require('./action.model')
const TermSchema = require('./term.model')
const SmartSchema = new Schema({
  type: { // 0 本地智能 1 云智能
    type: Number
  },
  name: {// 名称
    type: String
  },
  term: [// 条件
    TermSchema
  ],
  action: [// 动作
    ActionSchema
  ],
  status: {// 启用状态
    type: Boolean
  },
  creator: {// 所属用户
    type: Schema.Types.ObjectId, ref: 'User',
    autopopulate: { maxDepth: 1 }
  },
  // time: {// 联动检测时间
  //   type: Number
  // },
  // confirmNo: {// 确认条件次数
  //   type: Number
  // },
  // confirmTime: {// 确认间隔
  //   type: Number
  // },
  smartDis: {// 关联智能类型
    type: String
  },
  lastRun: {// 上次条件判断是否是满足的
    type: Boolean,
    default: false
  },
  control: {// 关联的设备编号
    type: Schema.Types.ObjectId, ref: 'Control'
  },
  keepRun: { // 为true时持续执行,直到不符合判断条件 为false时在判定条件满足时只执行一遍,直到不满足条件以后的下次满足条件才会再次执行
    type: Number,
    default: 0
  },
  dis: {// 区域
    type: String
  }
}, {
  timestamps: true
})

SmartSchema.plugin(autopopulate)
module.exports = mongoose.model('Smart', SmartSchema)
