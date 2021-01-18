const Joi = require('joi')
const mongoose = require('mongoose')
const HardwareWord = mongoose.model('HardwareWord')
// const fsPromises = require('fs').promises
// const path = require('path')
// const _ = require('lodash')
// const OldHardwareWordSchema = require('../models/oldHardwareword.model')
// const Agreement = mongoose.model('Agreement')

// const oldAgreementSchema = require('../models/oldAgreement.model')

// const Hardware = require('../models/hardware.model')
// const Agreement = mongoose.model('Agreement')
const { getPageLimit } = require('../utils/pagelist')
const { loadFile } = require('../utils/download')
const Control = mongoose.model('Control')
const GeneratorCtrl = require('./generator.controller')
// function resolve(dir) {
//   return path.join(process.cwd(), '.', dir)
// }

/**
 * 验证  （必须有）
 */
const HardwareWordSchema = Joi.object({
  name: Joi.string(),
  type: Joi.number(),
  code: Joi.string(),
  doc: Joi.any(),
  attribute: Joi.array(),
  agreement: Joi.any(),
  defaultCheck: Joi.array().items(Joi.any()),
  defaultOperate: Joi.array().items(Joi.any())
})
class HardwareWordCtrl extends GeneratorCtrl {
// 在这里新加函数或者修改继承的函数

  /**
   * 查询所有LORA字典
   * @returns {Promise<Query|*>}
   */
  async selectWord(query) {
    if (query != null && query.type !== undefined && typeof query.type !== 'number') {
      query.type = parseInt(query.type)
    }
    const data = await HardwareWord.find(query).sort({ name: 1 })
    return await data
  }

  async hardwareWordCode(query) {
    const data = HardwareWord.find(query)
    return await data
  }
  async insert(hardwareWord) {
    hardwareWord = await Joi.validate(hardwareWord, HardwareWordSchema, { abortEarly: false, allowUnknown: true })
    // await fsPromises.mkdir(resolve(`assets/hardwareword/${hardwareWord.name}`), { recursive: true })
    // if (hardwareWord.doc) {
    //   const dos = hardwareWord.doc.split('.')
    //   const fileType = dos[dos.length - 1]
    //   await fsPromises.copyFile(resolve('assets/' + hardwareWord.doc), resolve(`assets/hardwareword/${hardwareWord.name}/${hardwareWord.name}.` + fileType))
    //   hardwareWord.doc = `hardwareword/${hardwareWord.name}/${hardwareWord.name}.` + fileType
    // }
    // if (hardwareWord.image) {
    //   await fsPromises.copyFile(resolve('assets/' + hardwareWord.image), resolve(`assets/hardwareword/${hardwareWord.name}/image.${hardwareWord.image.split('.').slice(-1)[0]}`))
    //   hardwareWord.image = `hardwareword/${hardwareWord.name}/image.${hardwareWord.image.split('.').slice(-1)[0]}`
    // }
    // if (hardwareWord.img_example1) {
    //   await fsPromises.copyFile(resolve('assets/' + hardwareWord.img_example1), resolve(`assets/hardwareword/${hardwareWord.name}/image.${hardwareWord.img_example1.split('.').slice(-1)[0]}`))
    //   hardwareWord.img_example1 = `hardwareword/${hardwareWord.name}/image.${hardwareWord.img_example1.split('.').slice(-1)[0]}`
    // }
    // if (hardwareWord.img_example2) {
    //   await fsPromises.copyFile(resolve('assets/' + hardwareWord.img_example2), resolve(`assets/hardwareword/${hardwareWord.name}/image.${hardwareWord.img_example2.split('.').slice(-1)[0]}`))
    //   hardwareWord.img_example2 = `hardwareword/${hardwareWord.name}/image.${hardwareWord.img_example2.split('.').slice(-1)[0]}`
    // }
    hardwareWord = await new HardwareWord(hardwareWord).save()
    return hardwareWord
  }

  async insertMany(array) {
    // if (process.env.ROLE === 'pi') { // 树莓派上要把所有图片文件下载到本地
    //   for (let i = 0; i < array.length; i++) {
    //     const item = array[i]
    //     if (item.image && item.image.indexOf('http') === 0)item.image = await loadFile(item.image)
    //     if (item.img_example1 && item.img_example1.indexOf('http') === 0)item.img_example1 = await loadFile(item.img_example1)
    //     if (item.img_example2 && item.img_example2.indexOf('http') === 0)item.img_example2 = await loadFile(item.img_example2)
    //   }
    // }
    await super.insertMany(array)
  }

  /**
   * 下载示例图
   * @return {Promise<void>}
   */
  async loadImg() {
    const hardwareWords = await HardwareWord.find()
    if (process.env.ROLE === 'pi') { // 树莓派上要把所有图片文件下载到本地
      for (let i = 0; i < hardwareWords.length; i++) {
        const item = hardwareWords[i]
        if (item.image && item.image.indexOf('http') === 0)item.image = await loadFile(item.image)
        if (item.img_example1 && item.img_example1.indexOf('http') === 0)item.img_example1 = await loadFile(item.img_example1)
        if (item.img_example2 && item.img_example2.indexOf('http') === 0)item.img_example2 = await loadFile(item.img_example2)
        await item.save()
      }
    }
  }

  async update(hardwareWord, body) {
    // const haw = Object.assign(hardwareWord, {})
    hardwareWord = Object.assign(hardwareWord, body)
    // await fsPromises.mkdir(resolve(`assets/hardwareword/${hardwareWord.name}`), { recursive: true })
    // if (hardwareWord.doc !== haw.doc) {
    //   const dos = hardwareWord.doc.split('.')
    //   const fileType = dos[dos.length - 1]
    //   await fsPromises.copyFile(resolve('assets/' + hardwareWord.doc), resolve(`assets/hardwareword/${hardwareWord.name}/${hardwareWord.name}.` + fileType))
    //   hardwareWord.doc = `hardwareword/${hardwareWord.name}/${hardwareWord.name}.` + fileType
    // }
    // if (hardwareWord.image !== haw.image) {
    //   await fsPromises.copyFile(resolve('assets/' + hardwareWord.image), resolve(`assets/hardwareword/${hardwareWord.name}/image.${hardwareWord.image.split('.').slice(-1)[0]}`))
    //   hardwareWord.image = `hardwareword/${hardwareWord.name}/image.${hardwareWord.image.split('.').slice(-1)[0]}`
    // }
    const dd = await hardwareWord.save()
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
    if (process.env.ROLE === 'pi') {
      const control = await Control.findOne()
      if (control && control.packageData !== undefined && control.packageData.hardwareWord !== undefined && control.packageData.hardwareWord.length > 0) {
        where._id = { $in: control.packageData.hardwareWord }
      }
    }
    let super_where = null
    if (query) {
      super_where = { ...where, ...JSON.parse(query) }
    }
    return await getPageLimit(this.Model, page, limit, super_where || where, select, opt)
  }
  // 导入数据
  // async copyOld() {
  //   // 导数据代码块
  //   // connect db
  //   const URL = 'mongodb://192.168.1.210:27017/' + 'node_nayuta_back'// 数据库地址
  //   const db2 = this.connect('node_nayuta_back', URL) // 拼接
  //
  //   const db2table = db2.model('HardwareWord', OldHardwareWordSchema) // 导入的旧数据的model
  //   const db2tableA = db2.model('Agreement', oldAgreementSchema) // 导入的旧数据的model
  //
  //   const list = await db2table.find().lean().exec()
  //   // console.log(list)
  //
  //   for (let i = 0; i < list.length; i++) { // 遍历
  //     const data = new HardwareWord()
  //     console.log(list[i])
  //     console.log('------------------')
  //     data.name = list[i].devicename // 名称
  //     data.code = list[i].types // 型号
  //     data.type = 0 // 类型
  //
  //     const oldId = mongoose.Types.ObjectId(list[i].agreement)
  //     const oldName = await db2tableA.findById(oldId).lean().exec()
  //     const newName = await Agreement.find({ name: oldName.name })
  //     console.log(oldName.name)
  //     console.log(newName)
  //     console.log(newName.length)
  //     console.log(newName[0]._id)
  //     console.log('------------------')
  //     data.agreement = mongoose.Types.ObjectId(newName[0]._id) // 协议
  //
  //     const serialData = {} // 串口信息
  //     if (list[i].serialdata === '8N1') {
  //       serialData.dataBit = 8
  //       serialData.verification = 'None'
  //       serialData.stopBit = 1
  //       serialData.baud = list[i].baud
  //     } else if (list[i].serialdata === '8E1') {
  //       serialData.dataBit = 8
  //       serialData.verification = 'Even'
  //       serialData.stopBit = 1
  //       serialData.baud = list[i].baud
  //     } else {
  //       serialData.dataBit = 8
  //       serialData.verification = 'Odd'
  //       serialData.stopBit = 1
  //       serialData.baud = list[i].baud
  //     }
  //     data.serialData.push(serialData)
  //
  //     const detCon = {}// 监测子文档
  //     console.log(list[i].defaulttest.length)
  //     for (let j = 0; j < list[i].defaulttest.length; j++) {
  //       console.log(j)
  //       console.log(list[i].defaulttest[j].name)
  //       // console.log(list[i].defaulttest[j].name)
  //       detCon.name = list[i].defaulttest[j].name
  //       detCon.company = list[i].defaulttest[j].company
  //       detCon.analysis = list[i].defaulttest[j].analysis
  //       detCon.address = list[i].defaulttest[j].address
  //       detCon.precision = list[i].defaulttest[j].accuracy
  //       detCon.sort = list[i].defaulttest[j].sort
  //       detCon.interval = list[i].defaulttest[j].interval
  //       detCon.icon = list[i].defaulttest[j].icons
  //       detCon.chartModel = list[i].defaulttest[j].chart
  //       detCon.exAnalysis = list[i].defaulttest[j].abnormal
  //       detCon.numericalValue = list[i].defaulttest[j].intervalType
  //       data.detCon.push(detCon)
  //     }
  //
  //     const defaultButton = {}
  //     for (let j = 0; j < list[i].defaultbutton.length; j++) {
  //       defaultButton.name = list[i].defaultbutton[j].name
  //       defaultButton.analysis = list[i].defaultbutton[j].analysis
  //       defaultButton.icon = list[i].defaultbutton[j].btn_types
  //       defaultButton.address = list[i].defaultbutton[j].address
  //       defaultButton.interval = list[i].defaultbutton[j].interval
  //       defaultButton.sort = list[i].defaultbutton[j].sort
  //       data.defaultButton.push(defaultButton)
  //     }
  //
  //     data.save()
  //     // data.save()
  //     // const defaultButton = {}// 控制子文档
  //   }
  //
  //   return await true
  // }
  // connect(name, mongoUri) { // 拼接
  //   return mongoose.createConnection(mongoUri, _.merge({}, { useCreateIndex: true, useNewUrlParser: true }))
  // }
}

module.exports = new HardwareWordCtrl(HardwareWord, HardwareWordSchema)
