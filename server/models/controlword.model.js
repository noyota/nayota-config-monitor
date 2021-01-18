const mongoose = require('mongoose')
const Schema = mongoose.Schema
const serialDataSchema = require('./serialData.model')
const LoradataSchema = require('./loraData.model')
const autopopulate = require('mongoose-autopopulate')
const ControlWordSchema = new Schema({
// 中控字典表
  name: {// 名称
    type: String
    // unique: true
  },
  serialData: [// 串口型号
    serialDataSchema
  ],
  loraData: [ // lora配置
    LoradataSchema
  ],
  systemType: {// 系统型号
    type: String
  }
}, {
  timestamps: true
})
ControlWordSchema.plugin(autopopulate)
module.exports = mongoose.model('ControlWord', ControlWordSchema)
