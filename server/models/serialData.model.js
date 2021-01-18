const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 串口子文档
const SerialDataSchema = new Schema({
  comName: {// 串口
    type: String//, enum: ['COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'COM10', 'COM11', 'COM12', 'COM13', 'COM14', 'COM15', 'COM16', 'COM17', 'COM18', 'COM19', 'COM20']
  },
  baud: {// 波特率
    type: Number//, enum: ['110', '300', '600', '1200', '2400', '4800', '9600', '14400', '19200', '38400', '56000', '57600', '115200']
  },
  verification: {// 校验
    type: String//, enum: ['无', '奇校验', '偶校验', 'Mark', '空格校验', '其他']
  },
  stopBit: {// 停止位
    type: Number//, enum: ['1', '1.5', '2']
  },
  dataBit: {// 数据位
    type: Number//, enum: ['8', '7', '6']
  },
  state: {// 连接状态
    type: Boolean
  },
  lineAt: {
    type: Date
  },
  address: { // 地址
    type: String
  }
})

module.exports = SerialDataSchema
