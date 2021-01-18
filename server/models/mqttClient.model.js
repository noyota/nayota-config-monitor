/**
 * @author lifeng
 * @date 19-7-5
 * @Description: 中控主机实体 mqtt clintId 连接 唯一对象
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MqttClientSchema = new Schema({
  creator: {// 所属用户
    type: Schema.Types.ObjectId, ref: 'User'
  },
  clientId: {
    type: String
  },
  line: {
    type: Boolean
  },
  control: { // 所属中控
    type: Schema.Types.ObjectId, ref: 'Control'
  },
  ip_address: {
    type: String
  },
  onlineTime: {
    type: Number,
    default: Date.now()
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('MqttClient', MqttClientSchema)
