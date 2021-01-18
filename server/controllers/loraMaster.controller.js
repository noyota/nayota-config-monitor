const Joi = require('joi')
const mongoose = require('mongoose')
const LoraMaster = mongoose.model('LoraMaster')
const GeneratorCtrl = require('./generator.controller')
/**
 * 验证
 */
const loraMasterSchema = Joi.object().keys({
  Name: Joi.string(),
  creator: Joi.any(),
  control: Joi.any(),
  model: Joi.string(),
  type: Joi.number(),
  line: Joi.boolean(),
  // serialData: Joi.array().items(Joi.any()),
  // loraData: Joi.array().items(Joi.any())
  serialData: Joi.object({ comName: Joi.string(), baud: Joi.number(), verification: Joi.string(), stopBit: Joi.number(), dataBit: Joi.number() }),
  loraData: Joi.object({ factor: Joi.string(), bandwidth: Joi.string(), codingrate: Joi.string(), frequency: Joi.string() })
})

class LoraMasterCtrl extends GeneratorCtrl {
// 在这里新加函数或者修改继承的函数

  /**
   * update代码重写
   * @param object
   * @param body
   * @returns {Promise<void>}
   */
  async update(object, body) {
    object = await Object.assign(object, body)
    /**
     * 判断子文档是否为空
     * 将子文档数据重新复制到object子文档中
     */
    if (body.loraData !== undefined && body.loraData != null) {
      object.loraData = await Object.assign(object.loraData, body.loraData)
    }
    if (body.serialData !== undefined && body.serialData != null) {
      object.serialData = await Object.assign(object.serialData, body.serialData)
    }
    if (body.secondLoraData !== undefined && body.secondLoraData != null) {
      object.secondLoraData = await Object.assign(object.secondLoraData, body.secondLoraData)
    }
    await object.save()
  }
  async select() {
    return await this.Model.find()
  }
}

module.exports = new LoraMasterCtrl(LoraMaster, loraMasterSchema)
