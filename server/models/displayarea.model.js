const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')

const DisplayAreaSchema = new Schema({
  name: {// 区域名称
    type: String
  },
  sort: {// 排序
    type: Number
  },
  areaImg: {// 区域图片
    type: String
  },
  showStatus: {// 显示状态
    type: Boolean
  },
  isCloud: {// 是否是云配置
    type: Boolean,
    default: false
  },
  showEventStatus: {// 是否显示事件
    type: Boolean
  },
  checks: [{// 检测数据
    type: Schema.Types.ObjectId, ref: 'Check',
    autopopulate: { maxDepth: 1 }
  }],
  operates: [{// 控制按钮
    type: Schema.Types.ObjectId, ref: 'Operate',
    autopopulate: { maxDepth: 1 }
  }],
  camera: {// 摄像头
    type: Schema.Types.ObjectId, ref: 'Camera',
    autopopulate: { maxDepth: 1 }
  },
  scenes: [{// 场景
    type: Schema.Types.ObjectId, ref: 'Scene',
    autopopulate: { maxDepth: 1 }
  }],
  smarts: [{// 场景
    type: Schema.Types.ObjectId, ref: 'Smart',
    autopopulate: { maxDepth: 1 }
  }],
  creator: {// 所属用户
    type: Schema.Types.ObjectId, ref: 'User',
    autopopulate: { maxDepth: 1 }
  },
  control: { // 本地区域信息所属网关
    type: Schema.Types.ObjectId, ref: 'Control',
    autopopulate: { maxDepth: 1 }
  }
}, {
  timestamps: true
})

DisplayAreaSchema.plugin(autopopulate)
module.exports = mongoose.model('DisplayArea', DisplayAreaSchema)
