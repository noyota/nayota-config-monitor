const mongoose = require('mongoose')
const Schema = mongoose.Schema
// LORA参数子文档
const LoradataSchema = new Schema({
  factor: {// 扩频因子
    type: String
  },
  bandwidth: {// 带宽
    type: String
  },
  codingrate: {// 编码率
    type: String
  },
  frequency: {// 频段
    type: String
  },
  type: { // 类型 轮询主站 0 附庸主站 1 网关主站 2 [双模主站 3]
    type: Number
  },
  smType: { // 0轮询，1监听
    type: Number
  },
  comName: {
    type: String
  },
  address: { // 地址
    type: String
  }
})

module.exports = LoradataSchema
