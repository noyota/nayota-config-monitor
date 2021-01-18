const Joi = require('joi')
const mongoose = require('mongoose')
const Word = mongoose.model('Word')
const GeneratorCtrl = require('./generator.controller')

/**
 * 验证
 */
const wordSchema = Joi.object().keys({
  name: Joi.string(),
  wordType: Joi.any(),
  sort: Joi.string(),
  flag: Joi.boolean(),
  remark: Joi.string()
})

class WordCtrl extends GeneratorCtrl {
// 在这里新加函数或者修改继承的函数

}

module.exports = new WordCtrl(Word, wordSchema)

