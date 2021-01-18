const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 此Model暂时不做同步
const IncAddressSchema = new Schema({
  type: {   //type:1--Lora，2--device
    type: Number
  },
  address: {
    type: String
  },
  createTime: {
    type: Date
  },
  deviceWord: {
    type: Schema.Types.ObjectId, ref: 'DeviceWord'
  }
})

module.exports = mongoose.model('IncAddress', IncAddressSchema)
