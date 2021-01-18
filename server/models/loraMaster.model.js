/**
 * @author lifeng
 * @date 19-7-16
 * @Description: 主站
 * 1. 轮询主站 监听主站为轮询主站的服用 一个轮询主站为一个实体对象（私有协议LORA网关），使用本公司自定义的主站协议通信，通信介质为串口对象
 * 2. 网关主站 LORAWAN网关，为一个网关对象，使用公有lorawan协议，通信介质为本地mqtt服务，mqtt，一个中控最多只能有一个网关主站，本地mqtt服务配置通过环境配置固定
 * 3. 其他主站 公司主站需要接入其他公司的点对点lora节点，协议为其他协议，将使用其他主站为一个实体对象，此种主站将使用从站的协议，有且只有一种协议
 * 4. 双模主站 本公司自自研自产的LORA主站,一个串口接入一个双LORA射频模块的主板,双频双工,一个主收发窗口,一个主监听窗口
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const LoradataSchema = require('./loraData.model')
const serialDataSchema = require('./serialData.model')
const autopopulate = require('mongoose-autopopulate')

const LoraMasterSchema = new Schema({
  name: { // 主站名称
    type: String
  },
  creator: { // 所属用户
    type: Schema.Types.ObjectId, ref: 'User'
  },
  control: { // 所属中控
    type: String
  },
  comName: {
    type: String
  },
  address: { // 主站地址
    type: String
  },
  model: { // 当前模式  配置模式 dev 运行模式 prod
    type: String
  },
  type: { // 类型 轮询主站 0 附庸主站 1 网关主站 2 [双模主站 3]
    type: Number
  },
  line: {
    type: Boolean
  },
  status: { // 正在使用的LORA主站
    type: Boolean
  },
  useType: { //  0监听,1:扫描
    type: Number,
    default: 0
  },
  loraData: LoradataSchema,
  secondLoraData: LoradataSchema, // 双模主站第二窗口的配置信息
  serialData: serialDataSchema // 双模主站第一窗口的配置信息
}, {
  timestamps: true
})

LoraMasterSchema.plugin(autopopulate)

const Model = mongoose.model('LoraMaster', LoraMasterSchema)
module.exports = Model
