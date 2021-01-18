const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
// 条件子文档(term)
const ThingSubDocSchema = new Schema({
  name: {
    type: String
  },
  model_name: { // 参数类想 Check Operate ThingDrive
    type: String
  },
  modelId: {// 数据
    type: Schema.Types.ObjectId,
    refPath: 'model_name'
  },
  status: { // 值类型 0 number 1 json
    type: Number,
    default: 0
  },
  shortAddress: { // 识别编码, 这里是因为物的参数的识别编码大多数情况是和控制器采集器中shortAddress起到一样的功能 ,所以起同样的名字便于通用
    type: String
  },
  value: {//  value 值
    type: Number
  },
  valueStr: {
    type: String
  },
  valueAt: {
    type: Date
  },
  company: {
    type: String
  }
})

ThingSubDocSchema.plugin(autopopulate)
module.exports = ThingSubDocSchema

