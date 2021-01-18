/**
 * @author lifeng
 * @date 19-8-30
 * @Description:文件资源表
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const fsPromises = require('fs').promises
const path = require('path')

var UploadSchema = new Schema({
  type: { // 文件类型
    type: String
  },
  size: { // 文件大小
    type: Number
  },
  name: { // 文件名
    type: String
  },
  path: { // 文件路径
    type: String
  },
  dir: {
    type: String
  },
  lastUseAt: { // 最后使用时间
    type: Date
  }
}, {
  timestamps: true
})

UploadSchema.post('remove', async function() {
  await fsPromises.unlink(path.resolve(`./assets/${this.path}`))
})

module.exports = mongoose.model('Upload', UploadSchema)
