const mongoose = require('mongoose')
const Schema = mongoose.Schema
// AI配置子文档
const AisettingSchema = new Schema({

  name: {// 名称
    type: String

  },
  startAt: {// 开始时间
    type: Number
  },
  endAt: {// 结束时间
    type: Number
  },
  deviceList: {// 设备列表
    type: Array
  },
  sort: {// 排序
    type: Number
  },
  lineAt: {
    type: Date
  }
})

module.exports = AisettingSchema
