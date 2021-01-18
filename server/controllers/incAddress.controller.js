const Joi = require('joi')
const mongoose = require('mongoose')
const IncAddress = mongoose.model('IncAddress')
const GeneratorCtrl = require('./generator.controller')

/**
 * 验证
 */
const IncAddressSchema = Joi.object().keys({
  type: Joi.number().required(),
  address: Joi.string().required()
})

class IncAddressCtrl extends GeneratorCtrl {
// 在这里新加函数或者修改继承的函数

}

module.exports = new IncAddressCtrl(IncAddress, IncAddressSchema)
