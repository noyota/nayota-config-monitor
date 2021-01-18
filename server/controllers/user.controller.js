const Joi = require('joi')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const GeneratorCtrl = require('./generator.controller')
const ServerError = require('../utils/error')
const { getPageLimit } = require('../utils/pagelist')
/**
 * 验证
 */
const userSchema = Joi.object({
  username: Joi.string().required(),
  trueName: Joi.string().required(),
  email: Joi.string().email(),
  password: Joi.string().required(),
  repeatPassword: Joi.string().required().valid(Joi.ref('password')), // 比对密码
  roles: Joi.array(), // 数组
  phones: Joi.string(), // 数组
  emails: Joi.string() // 数组
})

/**
 * this is UserCtrl
 * @constructor
 * @UserCtrl
 * const userCtrl = new UserCtrl();
 */
class UserCtrl extends GeneratorCtrl {
  async insert(body) {
    if (body.password === '') {
      throw new ServerError(10012, '密码不能为空')
    }
    // if (process.env.ROLE === 'serve' && body.type === 0) {
    //   await updateMqttUser({ username: body.mqttUsername, password: body.mqttPassword, mqttRole: body.mqttRole })
    // }
    return super.insert(body)
  }

  /**
   * mqtt 同步修改账户信息
   * @param {Object} body 新用户信息
   * @return {Promise<*>} {} 无
   */
  async mqttInsert(body) {
    if (body.username === 'admin') { // 如果是超级管理员账户，那就修改
      return await User.updateOne({ username: body.username }, body)
    } else {
      return await User.insertMany([body])
    }
  }
  /**
   * TODO
   * mqtt 查询账户信息
   * @param {Object} body 新用户信息
   * @return {Promise<*>} {} 无
   */
  async checkUser(option, body) {
    let user = await User.findOne(option)
    if (!user || (body != null && body.password !== undefined && !user.authenticate(body.password))) {
      return null
    }
    user = user.toObject()
    delete user.salt
    delete user.password
    delete user.mqttPassword
    return user
  }
  // 查询用户保存用户信息
  async findOne(option) {
    const user = await User.findOne(option)
    return user
  }
  /**
   * @param object
   * @param body
   * @returns {Promise<*>}
   */
  async update(object, body) {
    if (body.password === '') {
      delete body.password
    }
    // if (process.env.ROLE === 'serve' && body.type === 0) {
    //   await updateMqttUser({ username: body.mqttUsername, password: body.mqttPassword, mqttRole: body.mqttRole })
    // }
    return super.update(object, body)
  }

  async list(options) {
    options.select = options.select || ' -salt -password'
    if (typeof options !== 'object') {
      throw new TypeError('参数错误')
    }
    const { page, limit, sort, label, search, creator, time, range, autopopulate, select, ...where } = options
    const opt = { sort, autopopulate }
    if (typeof autopopulate !== 'boolean') {
      opt.autopopulate = autopopulate !== 'false'
    }
    const user = await User.findOne({ _id: mongoose.Types.ObjectId(creator) })
    if (creator && (user.username !== 'admin' || (user.roles !== null && !user.roles.some(role => role.name === 'admin')))) {
      where._id = creator
    }
    if (label != null && label !== '' && search != null && search !== '') {
      where[label] = new RegExp(decodeURI(search), 'i')
    }
    if (time != null && time !== '' && range && range.length === 2) {
      where[time] = { $gt: range[0], $lt: range[1] }
    }
    for (const key in where) {
      if (where[key] === '') { delete where[key] }
    }
    return await getPageLimit(this.Model, page, limit, where, select, opt)
  }

  // user表清理保留admin 账户
  async clear() {
    return await this.Model.deleteMany({ $nor: [{ username: 'admin' }] })
  }
}

module.exports = new UserCtrl(User, userSchema)

