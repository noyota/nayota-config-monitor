const Joi = require('joi')
const mongoose = require('mongoose')
// const { fromJS, merge } = require('immutable')
// const _lodash = require('lodash')
const { getPageLimit } = require('../utils/pagelist')
const userModel = mongoose.model('User')
/**
 * @class GeneratorCtrl
 * @description 增删改查基础类
 */
class GeneratorCtrl {
  constructor(Model, joiSchema, modelname) {
    this.Model = Model
    this.joiSchema = joiSchema
    this.modelname = modelname
  }

  async getById(id, select, options) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new TypeError('Id is invalid.')
    }
    return await this.Model.findById(id, select, options)
  }

  async insert(body) {
    body = await Joi.validate(body, this.joiSchema, { abortEarly: false, allowUnknown: true }) // 返回找到的所有错误
    body = await new this.Model(body).save()
    return body.toObject()
  }

  async insertMany(array) {
    return await this.Model.insertMany(array)
  }

  async update(object, body) {
    object = Object.assign(object, body)
    await object.save()
    return object
  }

  async list(options) {
    if (typeof options !== 'object') {
      throw new TypeError('参数错误')
    }
    const { page, limit, sort, label, search, creator, time, range, autopopulate, select, ...where } = options
    // 查询当前用户信息
    let user
    if (creator !== undefined) {
      user = await userModel.findOne({ _id: creator })
    }
    const opt = { sort, autopopulate }
    if (typeof autopopulate !== 'boolean') {
      opt.autopopulate = autopopulate !== 'false'
    }
    if (this.Model.schema.obj.creator) {
      where.creator = creator
      // 添加一个判断是否是子用户
      if (user !== undefined && user.type === 1) {
        where.creator = user.father
      }
    }
    if (label != null && label !== '') {
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

  async remove(obj) {
    return obj.remove()
  }

  async removes(_ids) {
    return await this.Model.deleteMany({ _id: { $in: _ids }})
  }

  /**
   * 清除全部
   * @param creator
   * @returns {Promise<void>}
   */
  async clear(creator) {
    const where = {}
    if (this.Model.schema.obj.creator) where.creator = creator
    return await this.Model.deleteMany(where)
  }

  /**
   *  树结构
   * 如果是超级管理员账户 并且树的第一层有creator 默认再加上User
   * @param options 结构数组
   * 单个option结构
   * model
   * label
   * [children]
   * [where]
   * [father]
   * @param [user] 所属用户
   * @param exclude 剔除不需要的节点
   * @param fatherIds 树的父级限定
   * @param level 树的等级
   * @return [[]]
   */
  async tree(options, user, exclude = [], fatherIds, level = 0) {
    const datas = await Promise.all(options.map(async item => {
      item.where = item.where || {}
      if (fatherIds && item.father)item.where[item.father] = { $in: fatherIds }
      const data = await this._tree(item, user, exclude, level)
      if (exclude.includes(item.model)) {
        const children = []
        for (const value of data) {
          children.push(...value.children)
        }
        return children
      }
      return data
    }))
    const tree = []
    datas.forEach(data => {
      tree.push(...data)
    })
    return tree
  }

  async _tree(option, user, exclude, level) {
    const Model = mongoose.model(option.model)
    const where = option.where || {}
    // if (Model.schema.obj.creator && !user.roles.some(role => role.name === 'admin')) where.creator = user
    if (Model.schema.obj.creator) where.creator = user // T 暂时所有人只能查看自己
    let datas = null
    // if (option.model === 'User' && !user.roles.some(role => role.name === 'admin')) { // 对于用户信息 除了超级管理员 其他角色都只能看到自己的信息
    if (option.model === 'User') { // T 暂时所有人只能查看自己
      datas = [{ _id: user._id, label: option.label, children: [], level, model: option.model }]
      datas[0][option.label] = user[option.label]
    } else {
      datas = await Model.find(where, `${option.label} ${option.father || ''}`, { autopopulate: false })
    }
    const map = new Map()
    const ids = []
    datas.forEach(data => {
      map.set(data._id.toString(), { _id: data._id, label: data[option.label], children: [], father: data[option.father], level, model: option.model })
      ids.push(data._id)
    })
    if (option.children) {
      const opts = option.children
      const arr = await this.tree(opts, user, exclude, ids, level + 1) // 返回的是一个二维数组
      arr.forEach((item) => {
        map.get(item.father.toString()).children.push(item)
      })
    }
    return map.values()
  }
}

module.exports = GeneratorCtrl
