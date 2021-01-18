/**
 * @author lifeng
 * @date 19-9-26
 * @Description: 主站从站设备的接受包统计
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 动作子文档(action)
const PacketSchema = new Schema({
  modelBody: {// 检测
    type: Schema.Types.ObjectId, refPath: 'onModel',
    index: true
  },
  onModel: { // model名称
    type: String,
    required: true
  },
  send: [], // 发送
  accept: [], // 收到
  loss: [], // 丢失
  send_fr: {
    type: Number,
    default: 0
  },
  accept_fr: {
    type: Number,
    default: 0
  },
  loss_scale: {
    type: Number,
    default: 0
  },
  status: { // 1:在线 0:离线
    type: Number,
    default: 0
  } // TODO 当前时间离收包平均超4倍没收到或 丢包率达到1倍的时候 离线 一旦离线 数据全清除 等待下次自动或手动收到 收到第一条后 自动转为在线,第二条开始计算频率  1小时没收到消息自动离线
})

module.exports = mongoose.model('Packet', PacketSchema)
