const Joi = require('joi')
const mongoose = require('mongoose')
const Role = mongoose.model('Role')
const GeneratorCtrl = require('./generator.controller')

/**
 * 验证
 */
const roleSchema = Joi.object().keys({
  name: Joi.string().required(),
  sort: Joi.number().required()
  // desc: Joi.string()
})

class RouterCtrl extends GeneratorCtrl {
// 在这里新加函数或者修改继承的函数

}

module.exports = new RouterCtrl(Role, roleSchema)
