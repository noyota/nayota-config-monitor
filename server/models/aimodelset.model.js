const mongoose = require('mongoose')
const Schema = mongoose.Schema
// AI模型子文档
const AimodelsetSchema = new Schema({

  // AI设备地址
  hardWareAdd: {
    type: String
    // unique: true
  },

  // 开始时间
  startDate: {
    type: Number
  },
  // 结束时间
  endDate: {
    type: Number

  }

})
module.exports = AimodelsetSchema
