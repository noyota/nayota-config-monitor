const Joi = require('joi')
const mongoose = require('mongoose')
const WordType = mongoose.model('WordType')
const Word = mongoose.model('Word')
const GeneratorCtrl = require('./generator.controller')
// const { createTree } = require('../middleware/tree')

/**
 * 验证
 */
const WordTypeSchema = Joi.object().keys({
  name: Joi.string(),
  sort: Joi.number(),
  flag: Joi.boolean(),
  level: Joi.number(),
  remark: Joi.string()
})

class WordTypeCtrl extends GeneratorCtrl {
  async findCode(query) {
    const data = await Word.find({ wordType: query })
    return data
  }
}

module.exports = new WordTypeCtrl(WordType, WordTypeSchema)

