/**
 * @author lifeng
 * @date 19-7-23
 * @Description: 设备/LORA运行模式子文档 标记此设备的运行函数(设计中 未用到)
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HarewareRunTypeSchema = new Schema({
  find: { // 是否可搜索 设备专有 lora无
    type: Boolean
  },
  config: { // 是否可配置
    type: Boolean
  },
  type1: { // 发收设备 监听设备  发收+监听
    type: Number
  },
  type2: { // 读设备 写设备 读写设备
    type: Number
  },
  type3: {
    type: Number
  }
})

module.exports = HarewareRunTypeSchema
