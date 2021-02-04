const Joi = require('joi')
const mongoose = require('mongoose')
const Upload = mongoose.model('Upload')
const GeneratorCtrl = require('./generator.controller')

/**
 * 验证
 */
const uploadSchema = Joi.object().keys({
  type: Joi.string(),
  size: Joi.number(),
  name: Joi.string(),
  path: Joi.string(),
  lastLookAt: Joi.date()
})

class UploadCtrl extends GeneratorCtrl {
// 在这里新加函数或者修改继承的函数
  async removes(_ids) {
    return await Promise.all(_ids.map(_id => {
      this.Model.findById(_id)
        .then(res => {
          res.remove()
        })
    }))
  }

  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new TypeError('Id is invalid.')
    }
    const upload = await this.Model.findById(id)
    if (upload) {
      upload.lastUseAt = Date.now()
      upload.save()
    }
    return upload
  }
}

module.exports = new UploadCtrl(Upload, uploadSchema)

