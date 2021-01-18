const Joi = require('joi')
const mongoose = require('mongoose')
const DeviceWord = mongoose.model('DeviceWord')
const { getPageLimit } = require('../utils/pagelist')
const GeneratorCtrl = require('./generator.controller')

/**
 * 验证  （必须有）
 */
const DeviceWordSchema = Joi.object({
  name: Joi.string(),
  type: Joi.number(),
  code: Joi.string(),
  attribute: Joi.array()
})
class DeviceWordCtrl extends GeneratorCtrl {
// 在这里新加函数或者修改继承的函数
  async insertMany(array) {
    await super.insertMany(array)
  }

  async update(deviceWord, body) {
    deviceWord = Object.assign(deviceWord, body)
    if (body.loraData !== undefined && body.loraData != null) {
      deviceWord.loraData = await Object.assign(deviceWord.loraData, body.loraData)
    }
    if (body.serialData !== undefined && body.serialData != null) {
      deviceWord.serialData = await Object.assign(deviceWord.serialData, body.serialData)
    }
    const dd = await deviceWord.save()
    return dd
  }

  async list(options) {
    if (typeof options !== 'object') {
      throw new TypeError('参数错误')
    }
    const { page, limit, sort, label, search, creator, time, range, autopopulate, select, query, ...where } = options
    const opt = { sort, autopopulate }
    if (typeof autopopulate !== 'boolean') {
      opt.autopopulate = autopopulate !== 'false'
    }
    if (this.Model.schema.obj.creator) where.creator = creator
    if (label != null && label !== '') {
      where[label] = new RegExp(decodeURI(search), 'i')
    }
    if (time != null && time !== '' && range && range.length === 2) {
      where[time] = { $gt: range[0], $lt: range[1] }
    }
    for (const key in where) {
      if (where[key] === '') { delete where[key] }
    }
    let super_where = null
    if (query) {
      super_where = { ...where, ...JSON.parse(query) }
    }
    return await getPageLimit(this.Model, page, limit, super_where || where, select, opt)
  }
}

module.exports = new DeviceWordCtrl(DeviceWord, DeviceWordSchema)
